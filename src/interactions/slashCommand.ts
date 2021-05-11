import { RESTManager } from '../rest/manager.ts'
import type { Guild } from '../structures/guild.ts'
import {
  SlashCommandChoice,
  SlashCommandOption,
  SlashCommandOptionType,
  SlashCommandPartial,
  SlashCommandPayload
} from '../types/slashCommands.ts'
import { Collection } from '../utils/collection.ts'
import type { SlashClient, SlashCommandHandlerCallback } from './slashClient.ts'

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
  readonly slash!: SlashClient
  readonly rest!: RESTManager

  constructor(client: SlashClient) {
    Object.defineProperty(this, 'slash', { value: client, enumerable: false })
    Object.defineProperty(this, 'rest', {
      enumerable: false,
      value: client.rest
    })
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
