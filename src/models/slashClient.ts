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
      typeof e === 'function' ? e(SlashOptionCallableBuilder) : e
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
export class SlashOptionCallableBuilder {
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

export type SlashOptionCallable = (
  o: typeof SlashOptionCallableBuilder
) => SlashCommandOption

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
    ? options.map((op) =>
        typeof op === 'function' ? op(SlashOptionCallableBuilder) : op
      )
    : Object.entries(options).map((entry) =>
        typeof entry[1] === 'function'
          ? entry[1](SlashOptionCallableBuilder)
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
      typeof option === 'function' ? option(SlashOptionCallableBuilder) : option
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

  get rest(): RESTManager {
    return this.slash.rest
  }

  constructor(client: SlashClient) {
    this.slash = client
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
}

export class SlashClient {
  id: string | (() => string)
  client?: Client
  token?: string
  enabled: boolean = true
  commands: SlashCommandsManager
  handlers: SlashCommandHandler[] = []
  rest: RESTManager

  constructor(options: SlashOptions) {
    let id = options.id
    if (options.token !== undefined) id = atob(options.token?.split('.')[0])
    if (id === undefined)
      throw new Error('ID could not be found. Pass at least client or token')
    this.id = id
    this.client = options.client
    this.token = options.token
    this.commands = new SlashCommandsManager(this)

    if (options !== undefined) {
      this.enabled = options.enabled ?? true
    }

    if (this.client?._decoratedSlash !== undefined) {
      this.client._decoratedSlash.forEach((e) => {
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
  }

  getID(): string {
    return typeof this.id === 'string' ? this.id : this.id()
  }

  /** Adds a new Slash Command Handler */
  handle(handler: SlashCommandHandler): SlashClient {
    this.handlers.push(handler)
    return this
  }

  private _getCommand(i: Interaction): SlashCommandHandler | undefined {
    return this.handlers.find((e) => {
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

    if (cmd === undefined) return

    cmd.handler(interaction)
  }
}
