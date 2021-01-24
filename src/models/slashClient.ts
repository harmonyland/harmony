import { Guild } from '../structures/guild.ts'
import { Interaction } from '../structures/slash.ts'
import {
  InteractionType,
  SlashCommandChoice,
  SlashCommandOption,
  SlashCommandOptionType,
  SlashCommandPartial,
  SlashCommandPayload
} from '../types/slash.ts'
import { Collection } from '../utils/collection.ts'
import { Client } from './client.ts'
import { RESTManager } from './rest.ts'
import { SlashModule } from './slashModule.ts'
import { verify as edverify } from 'https://deno.land/x/ed25519/mod.ts'
import { Buffer } from 'https://deno.land/std@0.80.0/node/buffer.ts'
import type {
  Request as ORequest,
  Response as OResponse
} from 'https://deno.land/x/opine@1.0.0/src/types.ts'
import type { Context } from 'https://deno.land/x/oak@v6.4.0/mod.ts'

export class SlashCommand {
  slash: SlashCommandsManager
  id: string
  applicationID: string
  name: string
  description: string
  options: SlashCommandOption[]
  _guild?: string

  constructor(manager: SlashCommandsManager, data: SlashCommandPayload) {
    this.slash = manager
    this.id = data.id
    this.applicationID = data.application_id
    this.name = data.name
    this.description = data.description
    this.options = data.options ?? []
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

    for (const raw of res) {
      const cmd = new SlashCommand(this, raw)
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

    const cmd = new SlashCommand(this, payload)
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

    return new SlashCommand(this, data)
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

export type SlashCommandHandlerCallback = (interaction: Interaction) => any
export interface SlashCommandHandler {
  name: string
  guild?: string
  parent?: string
  group?: string
  handler: SlashCommandHandlerCallback
}

export interface SlashOptions {
  id?: string | (() => string)
  client?: Client
  enabled?: boolean
  token?: string
  rest?: RESTManager
  publicKey?: string
}

export class SlashClient {
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
    let id = options.id
    if (options.token !== undefined) id = atob(options.token?.split('.')[0])
    if (id === undefined)
      throw new Error('ID could not be found. Pass at least client or token')
    this.id = id
    this.client = options.client
    this.token = options.token
    this.publicKey = options.publicKey

    if (options !== undefined) {
      this.enabled = options.enabled ?? true
    }

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

    this.client?.on('interactionCreate', (interaction) =>
      this._process(interaction)
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
              .find((o) => o.name === e.group)
              ?.options?.find((o) => o.name === e.name) !== undefined
          : true
      const subMatched =
        e.group === undefined && e.parent !== undefined
          ? i.options.find((o) => o.name === e.name) !== undefined
          : true
      const nameMatched1 = e.name === i.name
      const parentMatched = hasGroupOrParent ? e.parent === i.name : true
      const nameMatched = hasGroupOrParent ? parentMatched : nameMatched1

      const matched = groupMatched && subMatched && nameMatched
      return matched
    })
  }

  /** Process an incoming Slash Command (interaction) */
  private _process(interaction: Interaction): void {
    if (!this.enabled) return

    if (interaction.type !== InteractionType.APPLICATION_COMMAND) return

    const cmd = this._getCommand(interaction)
    if (cmd?.group !== undefined)
      interaction.data.options = interaction.data.options[0].options ?? []
    if (cmd?.parent !== undefined)
      interaction.data.options = interaction.data.options[0].options ?? []

    if (cmd === undefined) return

    cmd.handler(interaction)
  }

  async verifyKey(
    rawBody: string | Uint8Array | Buffer,
    signature: string,
    timestamp: string
  ): Promise<boolean> {
    if (this.publicKey === undefined)
      throw new Error('Public Key is not present')
    return edverify(
      signature,
      Buffer.concat([
        Buffer.from(timestamp, 'utf-8'),
        Buffer.from(
          rawBody instanceof Uint8Array
            ? new TextDecoder().decode(rawBody)
            : rawBody
        )
      ]),
      this.publicKey
    ).catch(() => false)
  }

  async verifyOpineRequest(req: ORequest): Promise<boolean> {
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
    req: ORequest,
    res: OResponse,
    next: CallableFunction
  ): Promise<any> {
    const verified = await this.verifyOpineRequest(req)
    if (!verified) return res.setStatus(401).end()

    await next()
    return true
  }

  // TODO: create verifyOakMiddleware too
  /** Method to verify Request from Oak server "Context". */
  async verifyOakRequest(ctx: Context): Promise<any> {
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

    const verified = await this.verifyKey(body as any, signature, timestamp)
    if (!verified) return false
    return true
  }
}
