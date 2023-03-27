import {
  ApplicationCommandInteraction,
  InteractionApplicationCommandResolved
} from '../structures/applicationCommand.ts'
import { Interaction, InteractionChannel } from '../structures/interactions.ts'
import {
  InteractionPayload,
  InteractionResponsePayload,
  InteractionType
} from '../types/interactions.ts'
import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  InteractionApplicationCommandData
} from '../types/applicationCommand.ts'
import type { Client } from '../client/mod.ts'
import { RESTManager } from '../rest/mod.ts'
import { ApplicationCommandsModule } from './commandModule.ts'
import { edverify, decodeHex, readAll } from '../../deps.ts'
import { User } from '../structures/user.ts'
import { HarmonyEventEmitter } from '../utils/events.ts'
import { decodeText, encodeText } from '../utils/encoding.ts'
import { ApplicationCommandsManager } from './applicationCommand.ts'
import { Application } from '../structures/application.ts'
import { Member } from '../structures/member.ts'
import { Guild } from '../structures/guild.ts'
import { GuildPayload } from '../types/guild.ts'
import { Channel } from '../structures/channel.ts'
import { TextChannel } from '../structures/textChannel.ts'
import { Role } from '../structures/role.ts'
import { Message } from '../structures/message.ts'
import { MessageComponentInteraction } from '../structures/messageComponents.ts'
import { AutocompleteInteraction } from '../structures/autocompleteInteraction.ts'
import { ModalSubmitInteraction } from '../structures/modalSubmitInteraction.ts'

export type ApplicationCommandHandlerCallback = (
  interaction: ApplicationCommandInteraction
) => any // Any to include both sync and async return types

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

export type AutocompleteHandlerCallback = (d: AutocompleteInteraction) => any

export interface AutocompleteHandler {
  cmd: string
  option: string
  parent?: string
  group?: string
  handler: AutocompleteHandlerCallback
}

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
  autocompleteHandlers: AutocompleteHandler[] = []
  readonly rest!: RESTManager
  modules: ApplicationCommandsModule[] = []
  publicKey?: string

  constructor(options: SlashOptions) {
    super()
    let id = options.id
    if (options.token !== undefined) id = atob(options.token?.split('.')[0])
    if (id === undefined) {
      throw new Error('ID could not be found. Pass at least client or token')
    }
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
    const client = this.client as unknown as {
      _decoratedAppCmd: ApplicationCommandHandler[]
      _decoratedAutocomplete: AutocompleteHandler[]
    }
    if (client?._decoratedAppCmd !== undefined) {
      client._decoratedAppCmd.forEach((e) => {
        e.handler = e.handler.bind(this.client)
        this.handlers.push(e)
      })
    }

    if (client?._decoratedAutocomplete !== undefined) {
      client._decoratedAutocomplete.forEach((e) => {
        e.handler = e.handler.bind(this.client)
        this.autocompleteHandlers.push(e)
      })
    }

    const self = this as unknown as InteractionsClient & {
      _decoratedAppCmd: ApplicationCommandHandler[]
      _decoratedAutocomplete: AutocompleteHandler[]
    }

    if (self._decoratedAppCmd !== undefined) {
      self._decoratedAppCmd.forEach((e) => {
        e.handler = e.handler.bind(this.client)
        self.handlers.push(e)
      })
    }

    if (self._decoratedAutocomplete !== undefined) {
      self._decoratedAutocomplete.forEach((e) => {
        e.handler = e.handler.bind(this.client)
        self.autocompleteHandlers.push(e)
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

  /** Adds a new Application Command Handler */
  handle(cmd: ApplicationCommandHandler): this
  handle(cmd: string, handler: ApplicationCommandHandlerCallback): this
  handle(
    cmd: string,
    handler: ApplicationCommandHandlerCallback,
    type: ApplicationCommandType | keyof typeof ApplicationCommandType
  ): this
  handle(
    cmd: string | ApplicationCommandHandler,
    handler?: ApplicationCommandHandlerCallback,
    type?: ApplicationCommandType | keyof typeof ApplicationCommandType
  ): this {
    const handle = {
      name: typeof cmd === 'string' ? cmd : cmd.name,
      ...(handler !== undefined ? { handler } : {}),
      ...(typeof cmd === 'string' ? {} : cmd)
    }

    if (type !== undefined) {
      handle.type =
        typeof type === 'string' ? ApplicationCommandType[type] : type
    }

    if (handle.handler === undefined) {
      throw new Error('Invalid usage. Handler function not provided')
    }

    if (
      (handle.type === undefined ||
        handle.type === ApplicationCommandType.CHAT_INPUT) &&
      typeof handle.name === 'string' &&
      handle.name.includes(' ') &&
      handle.parent === undefined &&
      handle.group === undefined
    ) {
      const parts = handle.name.split(/ +/).filter((e) => e !== '')
      if (parts.length > 3 || parts.length < 1) {
        throw new Error('Invalid command name')
      }
      const root = parts.shift() as string
      const group = parts.length === 2 ? parts.shift() : undefined
      const sub = parts.shift()

      handle.name = sub ?? root
      handle.group = group
      handle.parent = sub === undefined ? undefined : root
    }

    this.handlers.push(handle as ApplicationCommandHandler)
    return this
  }

  /**
   * Add a handler for autocompletions (for application command options).
   *
   * @param cmd Command name. Can be `*`
   * @param option Option name. Can be `*`
   * @param handler Handler callback that is fired when a matching Autocomplete Interaction comes in.
   */
  autocomplete(
    cmd: string,
    option: string,
    handler: AutocompleteHandlerCallback
  ): this {
    const handle: AutocompleteHandler = {
      cmd,
      option,
      handler
    }

    if (
      typeof handle.cmd === 'string' &&
      handle.cmd.includes(' ') &&
      handle.parent === undefined &&
      handle.group === undefined
    ) {
      const parts = handle.cmd.split(/ +/).filter((e) => e !== '')
      if (parts.length > 3 || parts.length < 1) {
        throw new Error('Invalid command name')
      }
      const root = parts.shift() as string
      const group = parts.length === 2 ? parts.shift() : undefined
      const sub = parts.shift()

      handle.cmd = sub ?? root
      handle.group = group
      handle.parent = sub === undefined ? undefined : root
    }

    this.autocompleteHandlers.push(handle)
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
              ?.find(
                (o) =>
                  o.name === e.group &&
                  o.type === ApplicationCommandOptionType.SUB_COMMAND_GROUP
              )
              ?.options?.find((o) => o.name === e.name) !== undefined
          : true
      const subMatched =
        e.group === undefined && e.parent !== undefined
          ? i.data.options?.find(
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

  /** Get Handler for an autocomplete Interaction. Supports nested sub commands and sub command groups. */
  private _getAutocompleteHandler(
    i: AutocompleteInteraction
  ): AutocompleteHandler | undefined {
    return [
      ...this.autocompleteHandlers,
      ...this.modules.map((e) => e.autocomplete).flat()
    ].find((e) => {
      if (i.targetID !== undefined && i.name === e.cmd) {
        return true
      }

      const hasGroupOrParent = e.group !== undefined || e.parent !== undefined
      const groupMatched =
        e.group !== undefined && e.parent !== undefined
          ? i.data.options
              ?.find(
                (o) =>
                  o.name === e.group &&
                  o.type === ApplicationCommandOptionType.SUB_COMMAND_GROUP
              )
              ?.options?.find((o) => o.name === e.cmd) !== undefined
          : true
      const subMatched =
        e.group === undefined && e.parent !== undefined
          ? i.data.options?.find(
              (o) =>
                o.name === e.cmd &&
                o.type === ApplicationCommandOptionType.SUB_COMMAND
            ) !== undefined
          : true
      const nameMatched1 = e.cmd === i.name
      const parentMatched = hasGroupOrParent ? e.parent === i.name : true
      const nameMatched = hasGroupOrParent ? parentMatched : nameMatched1
      const optionMatched =
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        i.options.some((o) => o.name === e.option && o.focused) ||
        e.option === '*'

      const matched = groupMatched && subMatched && nameMatched && optionMatched
      return matched
    })
  }

  /** Process an incoming Interaction */
  async _process(
    interaction: Interaction | ApplicationCommandInteraction
  ): Promise<void> {
    if (!this.enabled) return

    await this.emit('interaction', interaction)

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (interaction.isAutocomplete()) {
      const handle =
        this._getAutocompleteHandler(interaction) ??
        [
          ...this.autocompleteHandlers,
          ...this.modules.map((e) => e.autocomplete).flat()
        ].find((e) => e.cmd === '*')
      try {
        await handle?.handler(interaction)
      } catch (e) {
        await this.emit('interactionError', e as Error)
      }
      return
    }

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!interaction.isApplicationCommand()) return

    const cmd =
      this._getCommand(interaction) ??
      this.getHandlers().find((e) => e.name === '*')

    if (cmd === undefined) return

    try {
      await cmd.handler(interaction)
    } catch (e) {
      await this.emit('interactionError', e as Error)
    }
  }

  /** Verify HTTP based Interaction */
  verifyKey(
    rawBody: string | Uint8Array,
    signature: string | Uint8Array,
    timestamp: string | Uint8Array
  ): boolean {
    if (this.publicKey === undefined) {
      throw new Error('Public Key is not present')
    }

    const fullBody = new Uint8Array([
      ...(typeof timestamp === 'string' ? encodeText(timestamp) : timestamp),
      ...(typeof rawBody === 'string' ? encodeText(rawBody) : rawBody)
    ])

    return edverify(
      decodeHex(encodeText(this.publicKey)),
      decodeHex(
        signature instanceof Uint8Array ? signature : encodeText(signature)
      ),
      fullBody
    )
  }

  /**
   * Verify [Deno Std HTTP Server Request](https://deno.land/std/http/server.ts) and return Interaction.
   *
   * **Data present in Interaction returned by this method is very different from actual typings
   * as there is no real `Client` behind the scenes to cache things.**
   */
  async verifyServerRequest(req: {
    headers: Headers
    method: string
    body: Deno.Reader | Uint8Array
    respond: (options: {
      status?: number
      headers?: Headers
      body?: BodyInit
    }) => Promise<void>
  }): Promise<false | Interaction> {
    if (req.method.toLowerCase() !== 'post') return false

    const signature = req.headers.get('x-signature-ed25519')
    const timestamp = req.headers.get('x-signature-timestamp')
    if (signature === null || timestamp === null) return false

    const rawbody =
      req.body instanceof Uint8Array ? req.body : await readAll(req.body)
    const verify = this.verifyKey(rawbody, signature, timestamp)
    if (!verify) return false

    try {
      const payload: InteractionPayload = JSON.parse(decodeText(rawbody))

      // Note: there's a lot of hacks going on here.

      const client = this as unknown as Client

      let res

      const channel =
        payload.channel_id !== undefined
          ? (new Channel(client, {
              id: payload.channel_id!,
              type: 0,
              flags: 0
            }) as unknown as TextChannel)
          : undefined

      const user = new User(client, (payload.member?.user ?? payload.user)!)

      const guild =
        payload.guild_id !== undefined
          ? // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
            new Guild(client, {
              id: payload.guild_id!,
              unavailable: true
            } as GuildPayload)
          : undefined

      const member =
        payload.member !== undefined
          ? // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
            new Member(client, payload.member, user, guild!)
          : undefined

      if (
        payload.type === InteractionType.APPLICATION_COMMAND ||
        payload.type === InteractionType.AUTOCOMPLETE
      ) {
        const resolved: InteractionApplicationCommandResolved = {
          users: {},
          members: {},
          roles: {},
          channels: {},
          messages: {}
        }

        for (const [id, data] of Object.entries(
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
          (payload.data as InteractionApplicationCommandData).resolved?.users ??
            {}
        )) {
          resolved.users[id] = new User(client, data)
        }

        for (const [id, data] of Object.entries(
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
          (payload.data as InteractionApplicationCommandData).resolved
            ?.members ?? {}
        )) {
          resolved.members[id] = new Member(
            client,
            data,
            resolved.users[id],
            undefined as unknown as Guild
          )
        }

        for (const [id, data] of Object.entries(
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
          (payload.data as InteractionApplicationCommandData).resolved?.roles ??
            {}
        )) {
          resolved.roles[id] = new Role(
            client,
            data,
            undefined as unknown as Guild
          )
        }

        for (const [id, data] of Object.entries(
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
          (payload.data as InteractionApplicationCommandData).resolved
            ?.channels ?? {}
        )) {
          resolved.channels[id] = new InteractionChannel(client, data)
        }

        for (const [id, data] of Object.entries(
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
          (payload.data as InteractionApplicationCommandData).resolved
            ?.messages ?? {}
        )) {
          resolved.messages[id] = new Message(
            client,
            data,
            data.channel_id as unknown as TextChannel,
            new User(client, data.author)
          )
        }

        res =
          payload.type === InteractionType.APPLICATION_COMMAND
            ? new ApplicationCommandInteraction(client, payload, {
                user,
                member,
                guild,
                channel,
                resolved
              })
            : new AutocompleteInteraction(client, payload, {
                user,
                member,
                guild,
                channel,
                resolved
              })
      } else if (payload.type === InteractionType.MODAL_SUBMIT) {
        res = new ModalSubmitInteraction(client, payload, {
          channel,
          guild,
          member,
          user
        })
      } else if (payload.type === InteractionType.MESSAGE_COMPONENT) {
        res = new MessageComponentInteraction(client, payload, {
          channel,
          guild,
          member,
          user,
          message: new Message(
            client,
            payload.message!,
            payload.message!.channel_id as unknown as TextChannel,
            new User(client, payload.message!.author)
          )
        })
      } else {
        res = new Interaction(client, payload, {
          user,
          member,
          guild,
          channel
        })
      }

      res._httpRespond = async (d: InteractionResponsePayload | FormData) =>
        await req.respond({
          status: 200,
          headers: new Headers({
            'content-type':
              d instanceof FormData ? 'multipart/form-data' : 'application/json'
          }),
          body: d instanceof FormData ? d : JSON.stringify(d)
        })

      await this.emit('interaction', res)

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
    const body = new Uint8Array(await req.arrayBuffer())

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

  async verifyOpineRequest<
    T extends {
      headers: Headers
      body: Deno.Reader
    }
  >(req: T): Promise<boolean> {
    const signature = req.headers.get('x-signature-ed25519')
    const timestamp = req.headers.get('x-signature-timestamp')
    const contentLength = req.headers.get('content-length')

    if (signature === null || timestamp === null || contentLength === null) {
      return false
    }

    const body = new Uint8Array(parseInt(contentLength))
    await req.body.read(body)

    const verified = await this.verifyKey(body, signature, timestamp)
    if (!verified) return false

    return true
  }

  /** Middleware to verify request in Opine framework. */
  async verifyOpineMiddleware<
    Req extends {
      headers: Headers
      body: Deno.Reader
    },
    Res extends {
      setStatus: (code: number) => Res
      end: () => Res
    }
  >(req: Req, res: Res, next: CallableFunction): Promise<boolean> {
    const verified = await this.verifyOpineRequest(req)
    if (!verified) {
      res.setStatus(401).end()
      return false
    }

    await next()
    return true
  }

  // TODO: create verifyOakMiddleware too
  /** Method to verify Request from Oak server "Context". */
  async verifyOakRequest<
    T extends {
      request: {
        headers: Headers
        hasBody: boolean
        body: () => { value: Promise<Uint8Array> }
      }
    }
  >(ctx: T): Promise<boolean> {
    const signature = ctx.request.headers.get('x-signature-ed25519')
    const timestamp = ctx.request.headers.get('x-signature-timestamp')
    const contentLength = ctx.request.headers.get('content-length')

    if (
      signature === null ||
      timestamp === null ||
      contentLength === null ||
      !ctx.request.hasBody
    ) {
      return false
    }

    const body = await ctx.request.body().value

    const verified = await this.verifyKey(body, signature, timestamp)
    if (!verified) return false
    return true
  }

  /** Fetch Application of the Client (if Token is present) */
  async fetchApplication(): Promise<Application> {
    const app = await this.rest.api.oauth2.applications['@me'].get()
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return new Application(this.client!, app)
  }
}

export { InteractionsClient as SlashClient }
