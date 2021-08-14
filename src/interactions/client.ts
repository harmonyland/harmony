import {
  ApplicationCommandInteraction,
  InteractionApplicationCommandResolved
} from '../structures/applicationCommand.ts'
import { Interaction } from '../structures/interactions.ts'
import {
  InteractionPayload,
  InteractionResponsePayload,
  InteractionType
} from '../types/interactions.ts'
import {
  ApplicationCommandType,
  ApplicationCommandOptionType
} from '../types/applicationCommand.ts'
import type { Client } from '../client/mod.ts'
import { RESTManager } from '../rest/mod.ts'
import { ApplicationCommandsModule } from './commandModule.ts'
import { verify as edverify } from 'https://deno.land/x/ed25519@1.0.1/mod.ts'
import { User } from '../structures/user.ts'
import { HarmonyEventEmitter } from '../utils/events.ts'
import { encodeText, decodeText } from '../utils/encoding.ts'
import { ApplicationCommandsManager } from './applicationCommand.ts'

export type ApplicationCommandHandlerCallback = (
  interaction: ApplicationCommandInteraction
) => unknown
export interface ApplicationCommandHandler {
  name: string
  type?: ApplicationCommandType
  guild?: string
  parent?: string
  group?: string
  handler: ApplicationCommandHandlerCallback
}

// Deprecated
export type { ApplicationCommandHandlerCallback as SlashCommandHandlerCallback }
export type { ApplicationCommandHandler as SlashCommandHandler }

/** Options for InteractionsClient */
export interface SlashOptions {
  id?: string | (() => string)
  client?: Client
  enabled?: boolean
  token?: string
  rest?: RESTManager
  publicKey?: string
}

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type InteractionsClientEvents = {
  interaction: [Interaction]
  interactionError: [Error]
  ping: []
}

/** Slash Client represents an Interactions Client which can be used without Harmony Client. */
export class InteractionsClient extends HarmonyEventEmitter<InteractionsClientEvents> {
  id: string | (() => string)
  client?: Client

  #token?: string

  get token(): string | undefined {
    return this.#token
  }

  set token(val: string | undefined) {
    this.#token = val
  }

  enabled: boolean = true
  commands: ApplicationCommandsManager
  handlers: ApplicationCommandHandler[] = []
  readonly rest!: RESTManager
  modules: ApplicationCommandsModule[] = []
  publicKey?: string

  constructor(options: SlashOptions) {
    super()
    let id = options.id
    if (options.token !== undefined) id = atob(options.token?.split('.')[0])
    if (id === undefined)
      throw new Error('ID could not be found. Pass at least client or token')
    this.id = id

    if (options.client !== undefined) {
      Object.defineProperty(this, 'client', {
        value: options.client,
        enumerable: false
      })
    }

    this.token = options.token
    this.publicKey = options.publicKey

    this.enabled = options.enabled ?? true

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const client = this.client as any
    if (client?._decoratedAppCmd !== undefined) {
      client._decoratedAppCmd.forEach((e: any) => {
        e.handler = e.handler.bind(this.client)
        this.handlers.push(e)
      })
    }

    const self = this as any
    if (self._decoratedAppCmd !== undefined) {
      self._decoratedAppCmd.forEach((e: any) => {
        e.handler = e.handler.bind(this.client)
        self.handlers.push(e)
      })
    }

    Object.defineProperty(this, 'rest', {
      value:
        options.client === undefined
          ? options.rest === undefined
            ? new RESTManager({
                token: this.token
              })
            : options.rest
          : options.client.rest,
      enumerable: false
    })

    this.client?.on(
      'interactionCreate',
      async (interaction) => await this._process(interaction)
    )

    this.commands = new ApplicationCommandsManager(this)
  }

  getID(): string {
    return typeof this.id === 'string' ? this.id : this.id()
  }

  /** Adds a new Slash Command Handler */
  handle(
    cmd: string | ApplicationCommandHandler,
    handler?: ApplicationCommandHandlerCallback,
    type?: ApplicationCommandType | keyof typeof ApplicationCommandType
  ): InteractionsClient {
    const handle = {
      name: typeof cmd === 'string' ? cmd : cmd.name,
      ...(handler !== undefined ? { handler } : {}),
      ...(typeof cmd === 'string' ? {} : cmd)
    }

    if (type !== undefined) {
      handle.type =
        typeof type === 'string' ? ApplicationCommandType[type] : type
    }

    if (handle.handler === undefined)
      throw new Error('Invalid usage. Handler function not provided')

    if (
      (handle.type === undefined ||
        handle.type === ApplicationCommandType.CHAT_INPUT) &&
      typeof handle.name === 'string' &&
      handle.name.includes(' ') &&
      handle.parent === undefined &&
      handle.group === undefined
    ) {
      const parts = handle.name.split(/ +/).filter((e) => e !== '')
      if (parts.length > 3 || parts.length < 1)
        throw new Error('Invalid command name')
      const root = parts.shift() as string
      const group = parts.length === 2 ? parts.shift() : undefined
      const sub = parts.shift()

      handle.name = sub ?? root
      handle.group = group
      handle.parent = sub === undefined ? undefined : root
    }

    this.handlers.push(handle as any)
    return this
  }

  /** Load a Slash Module */
  loadModule(module: ApplicationCommandsModule): InteractionsClient {
    this.modules.push(module)
    return this
  }

  /** Get all Handlers. Including Slash Modules */
  getHandlers(): ApplicationCommandHandler[] {
    let res = this.handlers
    for (const mod of this.modules) {
      if (mod === undefined) continue
      res = [
        ...res,
        ...mod.commands.map((cmd) => {
          cmd.handler = cmd.handler.bind(mod)
          return cmd
        })
      ]
    }
    return res
  }

  /** Get Handler for an Interaction. Supports nested sub commands and sub command groups. */
  private _getCommand(
    i: ApplicationCommandInteraction
  ): ApplicationCommandHandler | undefined {
    return this.getHandlers().find((e) => {
      if (
        (e.type === ApplicationCommandType.MESSAGE ||
          e.type === ApplicationCommandType.USER) &&
        i.targetID !== undefined &&
        i.name === e.name
      ) {
        return true
      }

      const hasGroupOrParent = e.group !== undefined || e.parent !== undefined
      const groupMatched =
        e.group !== undefined && e.parent !== undefined
          ? i.data.options
              .find(
                (o) =>
                  o.name === e.group &&
                  o.type === ApplicationCommandOptionType.SUB_COMMAND_GROUP
              )
              ?.options?.find((o) => o.name === e.name) !== undefined
          : true
      const subMatched =
        e.group === undefined && e.parent !== undefined
          ? i.data.options.find(
              (o) =>
                o.name === e.name &&
                o.type === ApplicationCommandOptionType.SUB_COMMAND
            ) !== undefined
          : true
      const nameMatched1 = e.name === i.name
      const parentMatched = hasGroupOrParent ? e.parent === i.name : true
      const nameMatched = hasGroupOrParent ? parentMatched : nameMatched1

      const matched = groupMatched && subMatched && nameMatched
      return matched
    })
  }

  /** Process an incoming Interaction */
  private async _process(
    interaction: Interaction | ApplicationCommandInteraction
  ): Promise<void> {
    if (!this.enabled) return

    if (interaction.type !== InteractionType.APPLICATION_COMMAND) return

    const cmd =
      this._getCommand(interaction as ApplicationCommandInteraction) ??
      this.getHandlers().find((e) => e.name === '*')

    if (cmd === undefined) return

    await this.emit('interaction', interaction)
    try {
      await cmd.handler(interaction as ApplicationCommandInteraction)
    } catch (e) {
      await this.emit('interactionError', e)
    }
  }

  /** Verify HTTP based Interaction */
  async verifyKey(
    rawBody: string | Uint8Array,
    signature: string | Uint8Array,
    timestamp: string | Uint8Array
  ): Promise<boolean> {
    if (this.publicKey === undefined)
      throw new Error('Public Key is not present')

    const fullBody = new Uint8Array([
      ...(typeof timestamp === 'string' ? encodeText(timestamp) : timestamp),
      ...(typeof rawBody === 'string' ? encodeText(rawBody) : rawBody)
    ])

    return edverify(signature, fullBody, this.publicKey).catch(() => false)
  }

  /** Verify [Deno Std HTTP Server Request](https://deno.land/std/http/server.ts) and return Interaction. **Data present in Interaction returned by this method is very different from actual typings as there is no real `Client` behind the scenes to cache things.** */
  async verifyServerRequest(req: {
    headers: Headers
    method: string
    body: Deno.Reader | Uint8Array
    respond: (options: {
      status?: number
      headers?: Headers
      body?: any
    }) => Promise<void>
  }): Promise<false | Interaction> {
    if (req.method.toLowerCase() !== 'post') return false

    const signature = req.headers.get('x-signature-ed25519')
    const timestamp = req.headers.get('x-signature-timestamp')
    if (signature === null || timestamp === null) return false

    const rawbody =
      req.body instanceof Uint8Array ? req.body : await Deno.readAll(req.body)
    const verify = await this.verifyKey(rawbody, signature, timestamp)
    if (!verify) return false

    try {
      const payload: InteractionPayload = JSON.parse(decodeText(rawbody))

      // TODO: Maybe fix all this hackery going on here?
      let res
      if (payload.type === InteractionType.APPLICATION_COMMAND) {
        res = new ApplicationCommandInteraction(this as any, payload, {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          user: new User(this as any, (payload.member?.user ?? payload.user)!),
          member: payload.member as any,
          guild: payload.guild_id as any,
          channel: payload.channel_id as any,
          resolved: ((payload.data as any)
            ?.resolved as unknown as InteractionApplicationCommandResolved) ?? {
            users: {},
            members: {},
            roles: {},
            channels: {}
          }
        })
      } else {
        res = new Interaction(this as any, payload, {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          user: new User(this as any, (payload.member?.user ?? payload.user)!),
          member: payload.member as any,
          guild: payload.guild_id as any,
          channel: payload.channel_id as any
        })
      }
      await this.emit('interaction', res)
      res._httpRespond = async (d: InteractionResponsePayload | FormData) =>
        await req.respond({
          status: 200,
          headers: new Headers({
            'content-type':
              d instanceof FormData ? 'multipart/form-data' : 'application/json'
          }),
          body: d instanceof FormData ? d : JSON.stringify(d)
        })

      return res
    } catch (e) {
      return false
    }
  }

  /** Verify FetchEvent (for Service Worker usage) and return Interaction if valid */
  async verifyFetchEvent({
    request: req,
    respondWith
  }: {
    respondWith: CallableFunction
    request: Request
  }): Promise<false | Interaction> {
    if (req.bodyUsed === true) throw new Error('Request Body already used')
    if (req.body === null) return false
    const body = (await req.body.getReader().read()).value
    if (body === undefined) return false

    return await this.verifyServerRequest({
      headers: req.headers,
      body,
      method: req.method,
      respond: async (options) => {
        await respondWith(
          new Response(options.body, {
            headers: options.headers,
            status: options.status
          })
        )
      }
    })
  }

  async verifyOpineRequest(req: any): Promise<boolean> {
    const signature = req.headers.get('x-signature-ed25519')
    const timestamp = req.headers.get('x-signature-timestamp')
    const contentLength = req.headers.get('content-length')

    if (signature === null || timestamp === null || contentLength === null)
      return false

    const body = new Uint8Array(parseInt(contentLength))
    await req.body.read(body)

    const verified = await this.verifyKey(body, signature, timestamp)
    if (!verified) return false

    return true
  }

  /** Middleware to verify request in Opine framework. */
  async verifyOpineMiddleware(
    req: any,
    res: any,
    next: CallableFunction
  ): Promise<any> {
    const verified = await this.verifyOpineRequest(req)
    if (!verified) return res.setStatus(401).end()

    await next()
    return true
  }

  // TODO: create verifyOakMiddleware too
  /** Method to verify Request from Oak server "Context". */
  async verifyOakRequest(ctx: any): Promise<any> {
    const signature = ctx.request.headers.get('x-signature-ed25519')
    const timestamp = ctx.request.headers.get('x-signature-timestamp')
    const contentLength = ctx.request.headers.get('content-length')

    if (
      signature === null ||
      timestamp === null ||
      contentLength === null ||
      ctx.request.hasBody !== true
    ) {
      return false
    }

    const body = await ctx.request.body().value

    const verified = await this.verifyKey(body, signature, timestamp)
    if (!verified) return false
    return true
  }
}

export { InteractionsClient as SlashClient }

/** Decorator to create a Slash Command handler */
export function slash(name?: string, guild?: string) {
  return function (
    client: Client | InteractionsClient | ApplicationCommandsModule,
    prop: string
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const c = client as any
    if (c._decoratedAppCmd === undefined) c._decoratedAppCmd = []
    const item = (client as { [name: string]: any })[prop]
    if (typeof item !== 'function') {
      throw new Error('@slash decorator requires a function')
    } else
      c._decoratedAppCmd.push({
        name: name ?? prop,
        guild,
        handler: item
      })
  }
}

/** Decorator to create a Sub-Slash Command handler */
export function subslash(parent: string, name?: string, guild?: string) {
  return function (
    client: Client | ApplicationCommandsModule | InteractionsClient,
    prop: string
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const c = client as any
    if (c._decoratedAppCmd === undefined) c._decoratedAppCmd = []
    const item = (client as { [name: string]: any })[prop]
    if (typeof item !== 'function') {
      throw new Error('@subslash decorator requires a function')
    } else
      c._decoratedAppCmd.push({
        parent,
        name: name ?? prop,
        guild,
        handler: item
      })
  }
}

/** Decorator to create a Grouped Slash Command handler */
export function groupslash(
  parent: string,
  group: string,
  name?: string,
  guild?: string
) {
  return function (
    client: Client | ApplicationCommandsModule | InteractionsClient,
    prop: string
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const c = client as any
    if (c._decoratedAppCmd === undefined) c._decoratedAppCmd = []
    const item = (client as { [name: string]: any })[prop]
    if (typeof item !== 'function') {
      throw new Error('@groupslash decorator requires a function')
    } else
      c._decoratedAppCmd.push({
        group,
        parent,
        name: name ?? prop,
        guild,
        handler: item
      })
  }
}

/** Decorator to create a Message Context Menu Command handler */
export function messageContextMenu(name?: string) {
  return function (
    client: Client | InteractionsClient | ApplicationCommandsModule,
    prop: string
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const c = client as any
    if (c._decoratedAppCmd === undefined) c._decoratedAppCmd = []
    const item = (client as { [name: string]: any })[prop]
    if (typeof item !== 'function') {
      throw new Error('@messageContextMenu decorator requires a function')
    } else
      c._decoratedAppCmd.push({
        name: name ?? prop,
        type: 3,
        handler: item
      })
  }
}

/** Decorator to create a User Context Menu Command handler */
export function userContextMenu(name?: string) {
  return function (
    client: Client | InteractionsClient | ApplicationCommandsModule,
    prop: string
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const c = client as any
    if (c._decoratedAppCmd === undefined) c._decoratedAppCmd = []
    const item = (client as { [name: string]: any })[prop]
    if (typeof item !== 'function') {
      throw new Error('@userContextMenu decorator requires a function')
    } else
      c._decoratedAppCmd.push({
        name: name ?? prop,
        type: 3,
        handler: item
      })
  }
}
