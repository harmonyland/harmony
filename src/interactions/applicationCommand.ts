import { RESTManager } from '../rest/manager.ts'
import type { Guild } from '../structures/guild.ts'
import {
  ApplicationCommandType,
  GuildApplicationCommandPermissions,
  GuildSlashCommmandPermissionsPartial,
  GuildSlashCommmandPermissionsPayload,
  ApplicationCommandChoice,
  ApplicationCommandOption,
  ApplicationCommandOptionPayload,
  ApplicationCommandOptionType,
  ApplicationCommandPartial,
  ApplicationCommandPartialPayload,
  ApplicationCommandPayload,
  ApplicationCommandPermission,
  ApplicationCommandPermissionPayload,
  ApplicationCommandPermissionType
} from '../types/applicationCommand.ts'
import { ChannelTypes } from '../types/channel.ts'
import { Collection } from '../utils/collection.ts'
import type {
  InteractionsClient,
  ApplicationCommandHandlerCallback
} from './client.ts'

export class ApplicationCommand {
  slash: ApplicationCommandsManager
  id: string
  applicationID: string
  name: string
  type: ApplicationCommandType
  description?: string
  defaultPermission = true
  options: ApplicationCommandOption[]
  guild?: Guild
  guildID?: string

  constructor(
    manager: ApplicationCommandsManager,
    data: ApplicationCommandPayload,
    guild?: Guild
  ) {
    this.slash = manager
    this.id = data.id
    this.applicationID = data.application_id
    this.name = data.name
    this.type = data.type ?? ApplicationCommandType.CHAT_INPUT
    this.description = data.description
    this.options = data.options ?? []
    this.guild = guild
    this.defaultPermission = data.default_permission
  }

  async delete(): Promise<void> {
    await this.slash.delete(this.id, this.guildID)
  }

  async edit(data: ApplicationCommandPartial): Promise<void> {
    await this.slash.edit(this.id, data, this.guildID)
  }

  async setPermissions(
    data: ApplicationCommandPermission[],
    guild?: Guild | string
  ): Promise<GuildApplicationCommandPermissions> {
    const guildID =
      this.guildID ??
      (typeof guild === 'string'
        ? guild
        : typeof guild === 'object'
        ? guild.id
        : undefined)
    if (guildID === undefined)
      throw new Error('Expected Slash Command to be a Guild one')
    return await this.slash.permissions.set(this.id, data, guildID)
  }

  async getPermissions(
    guild?: Guild | string
  ): Promise<GuildApplicationCommandPermissions> {
    const guildID =
      this.guildID ??
      (typeof guild === 'string'
        ? guild
        : typeof guild === 'object'
        ? guild.id
        : undefined)
    if (guildID === undefined)
      throw new Error('Expected Slash Command to be a Guild one')
    return await this.slash.permissions.get(this.id, guildID)
  }

  /** Create a handler for this Slash Command */
  handle(
    func: ApplicationCommandHandlerCallback,
    options?: { parent?: string; group?: string }
  ): this {
    this.slash.slash.handle({
      name: this.name,
      parent: options?.parent,
      group: options?.group,
      guild: this.guildID,
      handler: func
    })
    return this
  }
}

export interface CreateOptions {
  name: string
  description?: string
  options?: Array<ApplicationCommandOption | SlashOptionCallable>
  choices?: Array<ApplicationCommandChoice | string>
}

function createSlashOption(
  type: ApplicationCommandOptionType,
  data: CreateOptions
): ApplicationCommandOption {
  return {
    name: data.name,
    type,
    description: data.description ?? 'No description.',
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

export { ApplicationCommand as SlashCommand }

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class SlashOption {
  static string(data: CreateOptions): ApplicationCommandOption {
    return createSlashOption(ApplicationCommandOptionType.STRING, data)
  }

  static bool(data: CreateOptions): ApplicationCommandOption {
    return createSlashOption(ApplicationCommandOptionType.BOOLEAN, data)
  }

  static subCommand(data: CreateOptions): ApplicationCommandOption {
    return createSlashOption(ApplicationCommandOptionType.SUB_COMMAND, data)
  }

  static subCommandGroup(data: CreateOptions): ApplicationCommandOption {
    return createSlashOption(
      ApplicationCommandOptionType.SUB_COMMAND_GROUP,
      data
    )
  }

  static role(data: CreateOptions): ApplicationCommandOption {
    return createSlashOption(ApplicationCommandOptionType.ROLE, data)
  }

  static channel(data: CreateOptions): ApplicationCommandOption {
    return createSlashOption(ApplicationCommandOptionType.CHANNEL, data)
  }

  static user(data: CreateOptions): ApplicationCommandOption {
    return createSlashOption(ApplicationCommandOptionType.USER, data)
  }

  static number(data: CreateOptions): ApplicationCommandOption {
    return createSlashOption(ApplicationCommandOptionType.INTEGER, data)
  }

  static mentionable(data: CreateOptions): ApplicationCommandOption {
    return createSlashOption(ApplicationCommandOptionType.MENTIONABLE, data)
  }
}

export type SlashOptionCallable = (
  o: typeof SlashOption
) => ApplicationCommandOption

export type SlashBuilderOptionsData =
  | Array<ApplicationCommandOption | SlashOptionCallable>
  | {
      [name: string]:
        | {
            description: string
            type: ApplicationCommandOptionType
            options?: ApplicationCommandOption[]
            choices?: ApplicationCommandChoice[]
          }
        | SlashOptionCallable
    }

function buildOptionsArray(
  options: SlashBuilderOptionsData
): ApplicationCommandOption[] {
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
  data: ApplicationCommandPartial

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

  option(option: SlashOptionCallable | ApplicationCommandOption): SlashBuilder {
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

  export(): ApplicationCommandPartial {
    if (this.data.name === '') {
      throw new Error('Name was not provided in Slash Builder')
    }
    return this.data
  }
}

export function transformApplicationCommandOption(
  _data: ApplicationCommandOption
): ApplicationCommandOptionPayload {
  const data: Record<string, unknown> = { ..._data }
  if (typeof data.type === 'string') {
    data.type =
      ApplicationCommandOptionType[
        data.type.toUpperCase() as keyof typeof ApplicationCommandOptionType
      ]
  }
  if (Array.isArray(data.options)) {
    data.options = data.options.map(transformApplicationCommandOption)
  }
  if (Array.isArray(data.channelTypes)) {
    data.channel_types = data.channelTypes.map(
      (e: ApplicationCommandOption['channelTypes']) =>
        typeof e === 'string' ? ChannelTypes[e] : e
    )
    delete data.channel_types
  }
  if (data.minValue !== undefined) {
    data.min_value = data.minValue
    delete data.minValue
  }
  if (data.maxValue !== undefined) {
    data.max_value = data.maxValue
    delete data.maxValue
  }
  return data as unknown as ApplicationCommandOptionPayload
}

export function transformApplicationCommand(
  _cmd: ApplicationCommandPartial
): ApplicationCommandPartialPayload {
  const cmd: Record<string, unknown> = { ..._cmd }
  if (cmd.defaultPermission !== undefined) {
    cmd.default_permission = cmd.defaultPermission
    delete cmd.defaultPermission
  }
  if (typeof cmd.type === 'string') {
    cmd.type =
      ApplicationCommandType[cmd.type as keyof typeof ApplicationCommandType]
  }
  if (typeof cmd.options === 'object' && Array.isArray(cmd.options)) {
    cmd.options = cmd.options.map(transformApplicationCommandOption)
  }
  return cmd as unknown as ApplicationCommandPartialPayload
}

export function transformApplicationCommandPermission(
  data: ApplicationCommandPermission
): ApplicationCommandPermissionPayload {
  data = { ...data }
  if (typeof data.type === 'string') {
    data.type =
      ApplicationCommandPermissionType[
        data.type.toUpperCase() as keyof typeof ApplicationCommandPermissionType
      ]
  }
  return data as unknown as ApplicationCommandPermissionPayload
}

export function transformApplicationCommandPermissions(
  _data: GuildSlashCommmandPermissionsPartial
): GuildSlashCommmandPermissionsPayload {
  const data = { ..._data }
  if (typeof data.permissions === 'object' && Array.isArray(data.permissions)) {
    data.permissions = data.permissions.map(
      transformApplicationCommandPermission
    )
  }
  return data as unknown as GuildSlashCommmandPermissionsPayload
}

export function transformApplicationCommandPermissionsPayload(
  _data: GuildSlashCommmandPermissionsPayload
): GuildApplicationCommandPermissions {
  const data: Record<string, unknown> = { ..._data }
  data.applicationID = data.application_id
  data.guildID = data.guild_id
  delete data.application_id
  delete data.guild_id
  return data as unknown as GuildApplicationCommandPermissions
}

export class ApplicationCommandPermissionsManager {
  readonly slash!: InteractionsClient
  readonly rest!: RESTManager

  constructor(client: InteractionsClient, public guildID?: string) {
    Object.defineProperty(this, 'slash', { value: client, enumerable: false })
    Object.defineProperty(this, 'rest', {
      enumerable: false,
      value: client.rest
    })
  }

  /** Get an array of all Slash Commands (of current Client) Permissions in a Guild */
  async all(
    guild?: Guild | string
  ): Promise<GuildApplicationCommandPermissions[]> {
    guild = guild ?? this.guildID
    if (guild === undefined) throw new Error('Guild argument not provided')
    const data = await this.rest.api.applications[this.slash.getID()].guilds[
      typeof guild === 'string' ? guild : guild.id
    ].commands.permissions.get()
    return data.map(transformApplicationCommandPermissionsPayload)
  }

  /** Get slash command permissions for a specific command */
  async get(
    cmd: string | ApplicationCommand,
    guild: Guild | string
  ): Promise<GuildApplicationCommandPermissions> {
    guild = guild ?? this.guildID
    if (guild === undefined) throw new Error('Guild argument not provided')
    const data = await this.rest.api.applications[this.slash.getID()].guilds[
      typeof guild === 'string' ? guild : guild.id
    ].commands[typeof cmd === 'object' ? cmd.id : cmd].permissions.get()
    return transformApplicationCommandPermissionsPayload(data)
  }

  /** Sets permissions of a Slash Command in a Guild */
  async set(
    cmd: string | ApplicationCommand,
    permissions: ApplicationCommandPermission[],
    guild: Guild | string
  ): Promise<GuildApplicationCommandPermissions> {
    guild = guild ?? this.guildID
    if (guild === undefined) throw new Error('Guild argument not provided')
    const data = await this.rest.api.applications[this.slash.getID()].guilds[
      typeof guild === 'string' ? guild : guild.id
    ].commands[typeof cmd === 'object' ? cmd.id : cmd].permissions.put({
      permissions: permissions.map(transformApplicationCommandPermission)
    })
    return transformApplicationCommandPermissionsPayload(data)
  }

  /** Sets permissions of multiple Slash Commands in a Guild with just one call */
  async bulkEdit(
    permissions: GuildSlashCommmandPermissionsPartial[],
    guild?: Guild | string
  ): Promise<GuildApplicationCommandPermissions[]> {
    guild = guild ?? this.guildID
    if (guild === undefined) throw new Error('Guild argument not provided')
    const data = await this.rest.api.applications[this.slash.getID()].guilds[
      typeof guild === 'string' ? guild : guild.id
    ].commands.permissions.put(
      permissions.map(transformApplicationCommandPermissions)
    )
    return data.map(transformApplicationCommandPermissionsPayload)
  }

  async *[Symbol.asyncIterator](): AsyncIterableIterator<GuildApplicationCommandPermissions> {
    for (const perm of await this.all()) {
      yield perm
    }
  }
}

export { ApplicationCommandPermissionsManager as SlashCommandPermissionsManager }

/** Manages Slash Commands, allows fetching/modifying/deleting/creating Slash Commands. */
export class ApplicationCommandsManager {
  readonly slash!: InteractionsClient
  readonly rest!: RESTManager
  readonly permissions!: ApplicationCommandPermissionsManager

  constructor(client: InteractionsClient) {
    Object.defineProperty(this, 'slash', { value: client, enumerable: false })
    Object.defineProperty(this, 'rest', {
      enumerable: false,
      value: client.rest
    })
    Object.defineProperty(this, 'permissions', {
      enumerable: false,
      value: new ApplicationCommandPermissionsManager(this.slash)
    })
  }

  /** Get all Global Slash Commands */
  async all(): Promise<Collection<string, ApplicationCommand>> {
    const col = new Collection<string, ApplicationCommand>()

    const res = (await this.rest.api.applications[
      this.slash.getID()
    ].commands.get()) as ApplicationCommandPayload[]
    if (!Array.isArray(res)) return col

    for (const raw of res) {
      const cmd = new ApplicationCommand(this, raw)
      col.set(raw.id, cmd)
    }

    return col
  }

  /** Get a Guild's Slash Commands */
  async guild(
    guild: Guild | string
  ): Promise<Collection<string, ApplicationCommand>> {
    const col = new Collection<string, ApplicationCommand>()

    const res = (await this.rest.api.applications[this.slash.getID()].guilds[
      typeof guild === 'string' ? guild : guild.id
    ].commands.get()) as ApplicationCommandPayload[]
    if (!Array.isArray(res)) return col

    const _guild =
      typeof guild === 'object'
        ? guild
        : await this.slash.client?.guilds.get(guild)

    for (const raw of res) {
      const cmd = new ApplicationCommand(this, raw, _guild)
      cmd.guildID = typeof guild === 'string' ? guild : guild.id
      col.set(raw.id, cmd)
    }

    return col
  }

  for(guild: Guild | string): GuildApplicationCommandsManager {
    return new GuildApplicationCommandsManager(this.slash, guild)
  }

  /** Create a Slash Command (global or Guild) */
  async create(
    data: ApplicationCommandPartial,
    guild?: Guild | string
  ): Promise<ApplicationCommand> {
    const route =
      guild === undefined
        ? this.rest.api.applications[this.slash.getID()].commands
        : this.rest.api.applications[this.slash.getID()].guilds[
            typeof guild === 'string' ? guild : guild.id
          ].commands

    const payload = await route.post(transformApplicationCommand(data))

    const _guild =
      typeof guild === 'object'
        ? guild
        : guild === undefined
        ? undefined
        : await this.slash.client?.guilds.get(guild)

    const cmd = new ApplicationCommand(this, payload, _guild)
    cmd.guildID =
      typeof guild === 'string' || guild === undefined ? guild : guild.id

    return cmd
  }

  /** Edit a Slash Command (global or Guild) */
  async edit(
    id: string,
    data: ApplicationCommandPartial,
    guild?: Guild | string
  ): Promise<ApplicationCommand> {
    const route =
      guild === undefined
        ? this.rest.api.applications[this.slash.getID()].commands[id]
        : this.rest.api.applications[this.slash.getID()].guilds[
            typeof guild === 'string' ? guild : guild.id
          ].commands[id]

    const d = await route.patch(transformApplicationCommand(data))
    const _guild =
      (await this.slash.client?.guilds.get(d.guild_id)) ??
      (typeof guild === 'object' ? guild : undefined)
    const cmd = new ApplicationCommand(this, d, _guild)
    if ('guild_id' in d) cmd.guildID = d.guildID
    return cmd
  }

  /** Delete a Slash Command (global or Guild) */
  async delete(
    id: string,
    guild?: Guild | string
  ): Promise<ApplicationCommandsManager> {
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
  async get(id: string, guild?: Guild | string): Promise<ApplicationCommand> {
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

    return new ApplicationCommand(this, data, _guild)
  }

  /** Bulk Edit Global or Guild Slash Commands */
  async bulkEdit(
    cmds: Array<ApplicationCommandPartial & { id?: string }>,
    guild?: Guild | string
  ): Promise<Collection<string, ApplicationCommand>> {
    const route =
      guild === undefined
        ? this.rest.api.applications[this.slash.getID()].commands
        : this.rest.api.applications[this.slash.getID()].guilds[
            typeof guild === 'string' ? guild : guild.id
          ].commands

    const d = await route.put(cmds.map(transformApplicationCommand))
    const col = new Collection<string, ApplicationCommand>()

    const _guild =
      typeof guild === 'object'
        ? guild
        : typeof guild === 'string'
        ? await this.slash.client?.guilds.get(guild)
        : undefined

    for (const raw of d) {
      const cmd = new ApplicationCommand(this, raw, _guild)
      cmd.guildID = _guild?.id
      cmd.guild = _guild
      col.set(raw.id, cmd)
    }

    return col
  }

  async *[Symbol.asyncIterator](): AsyncIterableIterator<ApplicationCommand> {
    for (const [, cmd] of await this.all()) {
      yield cmd
    }
  }
}

export { ApplicationCommandsManager as SlashCommandsManager }

export class GuildApplicationCommandsManager {
  readonly slash!: InteractionsClient
  readonly guild!: Guild | string
  readonly permissions: ApplicationCommandPermissionsManager

  private get commands(): ApplicationCommandsManager {
    return this.slash.commands
  }

  constructor(slash: InteractionsClient, guild: Guild | string) {
    Object.defineProperty(this, 'slash', {
      enumerable: false,
      value: slash
    })
    Object.defineProperty(this, 'guild', {
      enumerable: false,
      value: guild
    })
    this.permissions = new ApplicationCommandPermissionsManager(
      this.slash,
      typeof guild === 'object' ? guild.id : guild
    )
  }

  async get(id: string): Promise<ApplicationCommand> {
    return await this.commands.get(id, this.guild)
  }

  async delete(id: string): Promise<GuildApplicationCommandsManager> {
    await this.commands.delete(id, this.guild)
    return this
  }

  async all(): Promise<Collection<string, ApplicationCommand>> {
    return await this.commands.guild(this.guild)
  }

  async bulkEdit(
    commands: Array<ApplicationCommandPartial & { id?: string }>
  ): Promise<Collection<string, ApplicationCommand>> {
    return await this.commands.bulkEdit(commands, this.guild)
  }

  async create(cmd: ApplicationCommandPartial): Promise<ApplicationCommand> {
    return await this.commands.create(cmd, this.guild)
  }

  async edit(
    id: string,
    cmd: ApplicationCommandPartial
  ): Promise<ApplicationCommand> {
    return await this.commands.edit(id, cmd, this.guild)
  }

  async *[Symbol.asyncIterator](): AsyncIterableIterator<ApplicationCommand> {
    for (const [, cmd] of await this.all()) {
      yield cmd
    }
  }
}

export { GuildApplicationCommandsManager as GuildSlashCommandsManager }
