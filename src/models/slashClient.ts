import type { Guild } from '../structures/guild.ts'
import {
  Interaction,
  InteractionApplicationCommandResolved
} from '../structures/slash.ts'
import {
  InteractionPayload,
  InteractionResponsePayload,
  InteractionType,
  SlashCommandChoice,
  SlashCommandOption,
  SlashCommandOptionType,
  SlashCommandPartial,
  SlashCommandPayload
} from '../types/slash.ts'
import { Collection } from '../utils/collection.ts'
import type { Client } from './client.ts'
import { RESTManager } from './rest.ts'
import { SlashModule } from './slashModule.ts'
import { verify as edverify } from 'https://deno.land/x/ed25519@1.0.1/mod.ts'
import { User } from '../structures/user.ts'
import { HarmonyEventEmitter } from '../utils/events.ts'
import { encodeText, decodeText } from '../utils/encoding.ts'

export class SlashCommand {
  slash: SlashCommandsManager
  id: string
  applicationID: string
  name: string
  description: string
  options: SlashCommandOption[]
  guild?: Guild
  _guild?: string

  constructor(
    manager: SlashCommandsManager,
    data: SlashCommandPayload,
    guild?: Guild
  ) {
    this.slash = manager
    this.id = data.id
    this.applicationID = data.application_id
    this.name = data.name
    this.description = data.description
    this.options = data.options ?? []
    this.guild = guild
  }

  async delete(): Promise<void> {
    await this.slash.delete(this.id, this._guild)
  }

  async edit(data: SlashCommandPartial): Promise<void> {
    await this.slash.edit(this.id, data, this._guild)
  }

  /** Create a handler for this Slash Command */
  handle(
    func: SlashCommandHandlerCallback,
    options?: { parent?: string; group?: string }
  ): SlashCommand {
    this.slash.slash.handle({
      name: this.name,
      parent: options?.parent,
      group: options?.group,
      guild: this._guild,
      handler: func
    })
    return this
  }
}

export interface CreateOptions {
  name: string
  description?: string
  options?: Array<SlashCommandOption | SlashOptionCallable>
  choices?: Array<SlashCommandChoice | string>
}

function createSlashOption(
  type: SlashCommandOptionType,
  data: CreateOptions
): SlashCommandOption {
  return {
    name: data.name,
    type,
    description:
      type === 0 || type === 1
        ? undefined
        : data.description ?? 'No description.',
    options: data.options?.map((e) =>
      typeof e === 'function' ? e(SlashOption) : e
    ),
    choices:
      data.choices === undefined
        ? undefined
        : data.choices.map((e) =>
            typeof e === 'string' ? { name: e, value: e } : e
          )
  }
}

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class SlashOption {
  static string(data: CreateOptions): SlashCommandOption {
    return createSlashOption(SlashCommandOptionType.STRING, data)
  }

  static bool(data: CreateOptions): SlashCommandOption {
    return createSlashOption(SlashCommandOptionType.BOOLEAN, data)
  }

  static subCommand(data: CreateOptions): SlashCommandOption {
    return createSlashOption(SlashCommandOptionType.SUB_COMMAND, data)
  }

  static subCommandGroup(data: CreateOptions): SlashCommandOption {
    return createSlashOption(SlashCommandOptionType.SUB_COMMAND_GROUP, data)
  }

  static role(data: CreateOptions): SlashCommandOption {
    return createSlashOption(SlashCommandOptionType.ROLE, data)
  }

  static channel(data: CreateOptions): SlashCommandOption {
    return createSlashOption(SlashCommandOptionType.CHANNEL, data)
  }

  static user(data: CreateOptions): SlashCommandOption {
    return createSlashOption(SlashCommandOptionType.USER, data)
  }

  static number(data: CreateOptions): SlashCommandOption {
    return createSlashOption(SlashCommandOptionType.INTEGER, data)
  }
}

export type SlashOptionCallable = (o: typeof SlashOption) => SlashCommandOption

export type SlashBuilderOptionsData =
  | Array<SlashCommandOption | SlashOptionCallable>
  | {
      [name: string]:
        | {
            description: string
            type: SlashCommandOptionType
            options?: SlashCommandOption[]
            choices?: SlashCommandChoice[]
          }
        | SlashOptionCallable
    }

function buildOptionsArray(
  options: SlashBuilderOptionsData
): SlashCommandOption[] {
  return Array.isArray(options)
    ? options.map((op) => (typeof op === 'function' ? op(SlashOption) : op))
    : Object.entries(options).map((entry) =>
        typeof entry[1] === 'function'
          ? entry[1](SlashOption)
          : Object.assign(entry[1], { name: entry[0] })
      )
}

/** Slash Command Builder */
export class SlashBuilder {
  data: SlashCommandPartial

  constructor(
    name?: string,
    description?: string,
    options?: SlashBuilderOptionsData
  ) {
    this.data = {
      name: name ?? '',
      description: description ?? 'No description.',
      options: options === undefined ? [] : buildOptionsArray(options)
    }
  }

  name(name: string): SlashBuilder {
    this.data.name = name
    return this
  }

  description(desc: string): SlashBuilder {
    this.data.description = desc
    return this
  }

  option(option: SlashOptionCallable | SlashCommandOption): SlashBuilder {
    if (this.data.options === undefined) this.data.options = []
    this.data.options.push(
      typeof option === 'function' ? option(SlashOption) : option
    )
    return this
  }

  options(options: SlashBuilderOptionsData): SlashBuilder {
    this.data.options = buildOptionsArray(options)
    return this
  }

  export(): SlashCommandPartial {
    if (this.data.name === '')
      throw new Error('Name was not provided in Slash Builder')
    return this.data
  }
}

/** Manages Slash Commands, allows fetching/modifying/deleting/creating Slash Commands. */
export class SlashCommandsManager {
  slash: SlashClient
  rest: RESTManager

  constructor(client: SlashClient) {
    this.slash = client
    this.rest = client.rest
  }

  /** Get all Global Slash Commands */
  async all(): Promise<Collection<string, SlashCommand>> {
    const col = new Collection<string, SlashCommand>()

    const res = (await this.rest.api.applications[
      this.slash.getID()
    ].commands.get()) as SlashCommandPayload[]
    if (!Array.isArray(res)) return col

    for (const raw of res) {
      const cmd = new SlashCommand(this, raw)
      col.set(raw.id, cmd)
    }

    return col
  }

  /** Get a Guild's Slash Commands */
  async guild(
    guild: Guild | string
  ): Promise<Collection<string, SlashCommand>> {
    const col = new Collection<string, SlashCommand>()

    const res = (await this.rest.api.applications[this.slash.getID()].guilds[
      typeof guild === 'string' ? guild : guild.id
    ].commands.get()) as SlashCommandPayload[]
    if (!Array.isArray(res)) return col

    const _guild =
      typeof guild === 'object'
        ? guild
        : await this.slash.client?.guilds.get(guild)

    for (const raw of res) {
      const cmd = new SlashCommand(this, raw, _guild)
      cmd._guild = typeof guild === 'string' ? guild : guild.id
      col.set(raw.id, cmd)
    }

    return col
  }

  /** Create a Slash Command (global or Guild) */
  async create(
    data: SlashCommandPartial,
    guild?: Guild | string
  ): Promise<SlashCommand> {
    const route =
      guild === undefined
        ? this.rest.api.applications[this.slash.getID()].commands
        : this.rest.api.applications[this.slash.getID()].guilds[
            typeof guild === 'string' ? guild : guild.id
          ].commands

    const payload = await route.post(data)

    const _guild =
      typeof guild === 'object'
        ? guild
        : guild === undefined
        ? undefined
        : await this.slash.client?.guilds.get(guild)

    const cmd = new SlashCommand(this, payload, _guild)
    cmd._guild =
      typeof guild === 'string' || guild === undefined ? guild : guild.id

    return cmd
  }

  /** Edit a Slash Command (global or Guild) */
  async edit(
    id: string,
    data: SlashCommandPartial,
    guild?: Guild | string
  ): Promise<SlashCommandsManager> {
    const route =
      guild === undefined
        ? this.rest.api.applications[this.slash.getID()].commands[id]
        : this.rest.api.applications[this.slash.getID()].guilds[
            typeof guild === 'string' ? guild : guild.id
          ].commands[id]

    await route.patch(data)
    return this
  }

  /** Delete a Slash Command (global or Guild) */
  async delete(
    id: string,
    guild?: Guild | string
  ): Promise<SlashCommandsManager> {
    const route =
      guild === undefined
        ? this.rest.api.applications[this.slash.getID()].commands[id]
        : this.rest.api.applications[this.slash.getID()].guilds[
            typeof guild === 'string' ? guild : guild.id
          ].commands[id]

    await route.delete()
    return this
  }

  /** Get a Slash Command (global or Guild) */
  async get(id: string, guild?: Guild | string): Promise<SlashCommand> {
    const route =
      guild === undefined
        ? this.rest.api.applications[this.slash.getID()].commands[id]
        : this.rest.api.applications[this.slash.getID()].guilds[
            typeof guild === 'string' ? guild : guild.id
          ].commands[id]

    const data = await route.get()

    const _guild =
      typeof guild === 'object'
        ? guild
        : guild === undefined
        ? undefined
        : await this.slash.client?.guilds.get(guild)

    return new SlashCommand(this, data, _guild)
  }

  /** Bulk Edit Global or Guild Slash Commands */
  async bulkEdit(
    cmds: Array<SlashCommandPartial | SlashCommandPayload>,
    guild?: Guild | string
  ): Promise<SlashCommandsManager> {
    const route =
      guild === undefined
        ? this.rest.api.applications[this.slash.getID()].commands
        : this.rest.api.applications[this.slash.getID()].guilds[
            typeof guild === 'string' ? guild : guild.id
          ].commands

    await route.put(cmds)

    return this
  }
}

export type SlashCommandHandlerCallback = (interaction: Interaction) => unknown
export interface SlashCommandHandler {
  name: string
  guild?: string
  parent?: string
  group?: string
  handler: SlashCommandHandlerCallback
}

/** Options for SlashClient */
export interface SlashOptions {
  id?: string | (() => string)
  client?: Client
  enabled?: boolean
  token?: string
  rest?: RESTManager
  publicKey?: string
}

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type SlashClientEvents = {
  interaction: [Interaction]
  interactionError: [Error]
  ping: []
}

/** Slash Client represents an Interactions Client which can be used without Harmony Client. */
export class SlashClient extends HarmonyEventEmitter<SlashClientEvents> {
  id: string | (() => string)
  client?: Client
  token?: string
  enabled: boolean = true
  commands: SlashCommandsManager
  handlers: SlashCommandHandler[] = []
  rest: RESTManager
  modules: SlashModule[] = []
  publicKey?: string

  _decoratedSlash?: Array<{
    name: string
    guild?: string
    parent?: string
    group?: string
    handler: (interaction: Interaction) => any
  }>

  constructor(options: SlashOptions) {
    super()
    let id = options.id
    if (options.token !== undefined) id = atob(options.token?.split('.')[0])
    if (id === undefined)
      throw new Error('ID could not be found. Pass at least client or token')
    this.id = id
    this.client = options.client
    this.token = options.token
    this.publicKey = options.publicKey

    this.enabled = options.enabled ?? true

    if (this.client?._decoratedSlash !== undefined) {
      this.client._decoratedSlash.forEach((e) => {
        e.handler = e.handler.bind(this.client)
        this.handlers.push(e)
      })
    }

    if (this._decoratedSlash !== undefined) {
      this._decoratedSlash.forEach((e) => {
        e.handler = e.handler.bind(this.client)
        this.handlers.push(e)
      })
    }

    this.rest =
      options.client === undefined
        ? options.rest === undefined
          ? new RESTManager({
              token: this.token
            })
          : options.rest
        : options.client.rest

    this.client?.on(
      'interactionCreate',
      async (interaction) => await this._process(interaction)
    )

    this.commands = new SlashCommandsManager(this)
  }

  getID(): string {
    return typeof this.id === 'string' ? this.id : this.id()
  }

  /** Adds a new Slash Command Handler */
  handle(handler: SlashCommandHandler): SlashClient {
    this.handlers.push(handler)
    return this
  }

  /** Load a Slash Module */
  loadModule(module: SlashModule): SlashClient {
    this.modules.push(module)
    return this
  }

  /** Get all Handlers. Including Slash Modules */
  getHandlers(): SlashCommandHandler[] {
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
  private _getCommand(i: Interaction): SlashCommandHandler | undefined {
    return this.getHandlers().find((e) => {
      const hasGroupOrParent = e.group !== undefined || e.parent !== undefined
      const groupMatched =
        e.group !== undefined && e.parent !== undefined
          ? i.options
              .find(
                (o) =>
                  o.name === e.group &&
                  o.type === SlashCommandOptionType.SUB_COMMAND_GROUP
              )
              ?.options?.find((o) => o.name === e.name) !== undefined
          : true
      const subMatched =
        e.group === undefined && e.parent !== undefined
          ? i.options.find(
              (o) =>
                o.name === e.name &&
                o.type === SlashCommandOptionType.SUB_COMMAND
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
  private async _process(interaction: Interaction): Promise<void> {
    if (!this.enabled) return

    if (
      interaction.type !== InteractionType.APPLICATION_COMMAND ||
      interaction.data === undefined
    )
      return

    const cmd = this._getCommand(interaction)
    if (cmd?.group !== undefined)
      interaction.data.options = interaction.data.options[0].options ?? []
    if (cmd?.parent !== undefined)
      interaction.data.options = interaction.data.options[0].options ?? []

    if (cmd === undefined) return

    await this.emit('interaction', interaction)
    try {
      await cmd.handler(interaction)
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
      body?: string | Uint8Array | FormData
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
      const res = new Interaction(this as any, payload, {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        user: new User(this as any, (payload.member?.user ?? payload.user)!),
        member: payload.member as any,
        guild: payload.guild_id as any,
        channel: payload.channel_id as any,
        resolved: ((payload.data
          ?.resolved as unknown) as InteractionApplicationCommandResolved) ?? {
          users: {},
          members: {},
          roles: {},
          channels: {}
        }
      })
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

/** Decorator to create a Slash Command handler */
export function slash(name?: string, guild?: string) {
  return function (client: Client | SlashClient | SlashModule, prop: string) {
    if (client._decoratedSlash === undefined) client._decoratedSlash = []
    const item = (client as { [name: string]: any })[prop]
    if (typeof item !== 'function') {
      throw new Error('@slash decorator requires a function')
    } else
      client._decoratedSlash.push({
        name: name ?? prop,
        guild,
        handler: item
      })
  }
}

/** Decorator to create a Sub-Slash Command handler */
export function subslash(parent: string, name?: string, guild?: string) {
  return function (client: Client | SlashModule | SlashClient, prop: string) {
    if (client._decoratedSlash === undefined) client._decoratedSlash = []
    const item = (client as { [name: string]: any })[prop]
    if (typeof item !== 'function') {
      throw new Error('@subslash decorator requires a function')
    } else
      client._decoratedSlash.push({
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
  return function (client: Client | SlashModule | SlashClient, prop: string) {
    if (client._decoratedSlash === undefined) client._decoratedSlash = []
    const item = (client as { [name: string]: any })[prop]
    if (typeof item !== 'function') {
      throw new Error('@groupslash decorator requires a function')
    } else
      client._decoratedSlash.push({
        group,
        parent,
        name: name ?? prop,
        guild,
        handler: item
      })
  }
}
