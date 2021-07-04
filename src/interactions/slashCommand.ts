import { RESTManager } from '../rest/manager.ts'
import type { Guild } from '../structures/guild.ts'
import {
  GuildSlashCommandPermissions,
  GuildSlashCommmandPermissionsPartial,
  GuildSlashCommmandPermissionsPayload,
  SlashCommandChoice,
  SlashCommandOption,
  SlashCommandOptionPayload,
  SlashCommandOptionType,
  SlashCommandPartial,
  SlashCommandPartialPayload,
  SlashCommandPayload,
  SlashCommandPermission,
  SlashCommandPermissionPayload,
  SlashCommandPermissionType
} from '../types/slashCommands.ts'
import { Collection } from '../utils/collection.ts'
import type { SlashClient, SlashCommandHandlerCallback } from './slashClient.ts'

export class SlashCommand {
  slash: SlashCommandsManager
  id: string
  applicationID: string
  name: string
  description: string
  defaultPermission = true
  options: SlashCommandOption[]
  guild?: Guild
  guildID?: string

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
    this.defaultPermission = data.default_permission
  }

  async delete(): Promise<void> {
    await this.slash.delete(this.id, this.guildID)
  }

  async edit(data: SlashCommandPartial): Promise<void> {
    await this.slash.edit(this.id, data, this.guildID)
  }

  async setPermissions(
    data: SlashCommandPermission[],
    guild?: Guild | string
  ): Promise<GuildSlashCommandPermissions> {
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
  ): Promise<GuildSlashCommandPermissions> {
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
    func: SlashCommandHandlerCallback,
    options?: { parent?: string; group?: string }
  ): SlashCommand {
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

  static mentionable(data: CreateOptions): SlashCommandOption {
    return createSlashOption(SlashCommandOptionType.MENTIONABLE, data)
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
    if (this.data.name === '') {
      throw new Error('Name was not provided in Slash Builder')
    }
    return this.data
  }
}

export function transformSlashCommandOption(
  _data: SlashCommandOption
): SlashCommandOptionPayload {
  const data = { ...(_data as any) }
  if (typeof data.type === 'string') {
    data.type = SlashCommandOptionType[data.type.toUpperCase()]
  }
  if (typeof data.options === 'object' && Array.isArray(data.options)) {
    data.options = data.options.map(transformSlashCommandOption)
  }
  return data
}

export function transformSlashCommand(
  _cmd: SlashCommandPartial
): SlashCommandPartialPayload {
  const cmd = { ...(_cmd as any) }
  if (cmd.defaultPermission !== undefined) {
    cmd.default_permission = cmd.defaultPermission
    delete cmd.defaultPermission
  }
  if (typeof cmd.options === 'object' && Array.isArray(cmd.options)) {
    cmd.options = cmd.options.map(transformSlashCommandOption)
  }
  return cmd
}

export function transformSlashCommandPermission(
  data: SlashCommandPermission
): SlashCommandPermissionPayload {
  data = { ...data }
  if (typeof data.type === 'string') {
    data.type =
      SlashCommandPermissionType[
        data.type.toUpperCase() as keyof typeof SlashCommandPermissionType
      ]
  }
  return data as unknown as SlashCommandPermissionPayload
}

export function transformSlashCommandPermissions(
  _data: GuildSlashCommmandPermissionsPartial
): GuildSlashCommmandPermissionsPayload {
  const data = { ...(_data as any) }
  if (typeof data.permissions === 'object' && Array.isArray(data.permissions)) {
    data.permissions = data.permissions.map(transformSlashCommandPermission)
  }
  return data
}

export function transformSlashCommandPermissionsPayload(
  _data: GuildSlashCommmandPermissionsPayload
): GuildSlashCommandPermissions {
  const data = { ...(_data as any) }
  data.applicationID = data.application_id
  data.guildID = data.guild_id
  delete data.application_id
  delete data.guild_id
  return data
}

export class SlashCommandPermissionsManager {
  readonly slash!: SlashClient
  readonly rest!: RESTManager

  constructor(client: SlashClient, public guildID?: string) {
    Object.defineProperty(this, 'slash', { value: client, enumerable: false })
    Object.defineProperty(this, 'rest', {
      enumerable: false,
      value: client.rest
    })
  }

  /** Get an array of all Slash Commands (of current Client) Permissions in a Guild */
  async all(guild?: Guild | string): Promise<GuildSlashCommandPermissions[]> {
    guild = guild ?? this.guildID
    if (guild === undefined) throw new Error('Guild argument not provided')
    const data = await this.rest.api.applications[this.slash.getID()].guilds[
      typeof guild === 'string' ? guild : guild.id
    ].commands.permissions.get()
    return data.map(transformSlashCommandPermissionsPayload)
  }

  /** Get slash command permissions for a specific command */
  async get(
    cmd: string | SlashCommand,
    guild: Guild | string
  ): Promise<GuildSlashCommandPermissions> {
    guild = guild ?? this.guildID
    if (guild === undefined) throw new Error('Guild argument not provided')
    const data = await this.rest.api.applications[this.slash.getID()].guilds[
      typeof guild === 'string' ? guild : guild.id
    ].commands[typeof cmd === 'object' ? cmd.id : cmd].permissions.get()
    return transformSlashCommandPermissionsPayload(data)
  }

  /** Sets permissions of a Slash Command in a Guild */
  async set(
    cmd: string | SlashCommand,
    permissions: SlashCommandPermission[],
    guild: Guild | string
  ): Promise<GuildSlashCommandPermissions> {
    guild = guild ?? this.guildID
    if (guild === undefined) throw new Error('Guild argument not provided')
    const data = await this.rest.api.applications[this.slash.getID()].guilds[
      typeof guild === 'string' ? guild : guild.id
    ].commands[typeof cmd === 'object' ? cmd.id : cmd].permissions.put({
      permissions: permissions.map(transformSlashCommandPermission)
    })
    return transformSlashCommandPermissionsPayload(data)
  }

  /** Sets permissions of multiple Slash Commands in a Guild with just one call */
  async bulkEdit(
    permissions: GuildSlashCommmandPermissionsPartial[],
    guild?: Guild | string
  ): Promise<GuildSlashCommandPermissions[]> {
    guild = guild ?? this.guildID
    if (guild === undefined) throw new Error('Guild argument not provided')
    const data = await this.rest.api.applications[this.slash.getID()].guilds[
      typeof guild === 'string' ? guild : guild.id
    ].commands.permissions.patch(
      permissions.map(transformSlashCommandPermissions)
    )
    return data.map(transformSlashCommandPermissionsPayload)
  }

  async *[Symbol.asyncIterator](): AsyncIterableIterator<GuildSlashCommandPermissions> {
    const arr = await this.all()
    const { readable, writable } = new TransformStream()
    const writer = writable.getWriter()
    arr.forEach((el: unknown) => writer.write(el))
    writer.close()
    yield* readable
  }
}

/** Manages Slash Commands, allows fetching/modifying/deleting/creating Slash Commands. */
export class SlashCommandsManager {
  readonly slash!: SlashClient
  readonly rest!: RESTManager
  readonly permissions!: SlashCommandPermissionsManager

  constructor(client: SlashClient) {
    Object.defineProperty(this, 'slash', { value: client, enumerable: false })
    Object.defineProperty(this, 'rest', {
      enumerable: false,
      value: client.rest
    })
    Object.defineProperty(this, 'permissions', {
      enumerable: false,
      value: new SlashCommandPermissionsManager(this.slash)
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
      cmd.guildID = typeof guild === 'string' ? guild : guild.id
      col.set(raw.id, cmd)
    }

    return col
  }

  for(guild: Guild | string): GuildSlashCommandsManager {
    return new GuildSlashCommandsManager(this.slash, guild)
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

    const payload = await route.post(transformSlashCommand(data))

    const _guild =
      typeof guild === 'object'
        ? guild
        : guild === undefined
        ? undefined
        : await this.slash.client?.guilds.get(guild)

    const cmd = new SlashCommand(this, payload, _guild)
    cmd.guildID =
      typeof guild === 'string' || guild === undefined ? guild : guild.id

    return cmd
  }

  /** Edit a Slash Command (global or Guild) */
  async edit(
    id: string,
    data: SlashCommandPartial,
    guild?: Guild | string
  ): Promise<SlashCommand> {
    const route =
      guild === undefined
        ? this.rest.api.applications[this.slash.getID()].commands[id]
        : this.rest.api.applications[this.slash.getID()].guilds[
            typeof guild === 'string' ? guild : guild.id
          ].commands[id]

    const d = await route.patch(transformSlashCommand(data))
    const _guild =
      (await this.slash.client?.guilds.get(d.guild_id)) ??
      (typeof guild === 'object' ? guild : undefined)
    const cmd = new SlashCommand(this, d, _guild)
    if ('guild_id' in d) cmd.guildID = d.guildID
    return cmd
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
    cmds: Array<SlashCommandPartial & { id?: string }>,
    guild?: Guild | string
  ): Promise<Collection<string, SlashCommand>> {
    const route =
      guild === undefined
        ? this.rest.api.applications[this.slash.getID()].commands
        : this.rest.api.applications[this.slash.getID()].guilds[
            typeof guild === 'string' ? guild : guild.id
          ].commands

    const d = await route.put(cmds.map(transformSlashCommand))
    const col = new Collection<string, SlashCommand>()

    const _guild =
      typeof guild === 'object'
        ? guild
        : typeof guild === 'string'
        ? await this.slash.client?.guilds.get(guild)
        : undefined

    for (const raw of d) {
      const cmd = new SlashCommand(this, raw, _guild)
      cmd.guildID = _guild?.id
      cmd.guild = _guild
      col.set(raw.id, cmd)
    }

    return col
  }

  async *[Symbol.asyncIterator](): AsyncIterableIterator<SlashCommand> {
    const arr = await this.all()
    const { readable, writable } = new TransformStream()
    const writer = writable.getWriter()
    arr.forEach((el: unknown) => writer.write(el))
    writer.close()
    yield* readable
  }
}

export class GuildSlashCommandsManager {
  readonly slash!: SlashClient
  readonly guild!: Guild | string
  readonly permissions: SlashCommandPermissionsManager

  private get commands(): SlashCommandsManager {
    return this.slash.commands
  }

  constructor(slash: SlashClient, guild: Guild | string) {
    Object.defineProperty(this, 'slash', {
      enumerable: false,
      value: slash
    })
    Object.defineProperty(this, 'guild', {
      enumerable: false,
      value: guild
    })
    this.permissions = new SlashCommandPermissionsManager(
      this.slash,
      typeof guild === 'object' ? guild.id : guild
    )
  }

  async get(id: string): Promise<SlashCommand> {
    return await this.commands.get(id, this.guild)
  }

  async delete(id: string): Promise<GuildSlashCommandsManager> {
    await this.commands.delete(id, this.guild)
    return this
  }

  async all(): Promise<Collection<string, SlashCommand>> {
    return await this.commands.guild(this.guild)
  }

  async bulkEdit(
    commands: Array<SlashCommandPartial & { id?: string }>
  ): Promise<Collection<string, SlashCommand>> {
    return await this.commands.bulkEdit(commands, this.guild)
  }

  async create(cmd: SlashCommandPartial): Promise<SlashCommand> {
    return await this.commands.create(cmd, this.guild)
  }

  async edit(id: string, cmd: SlashCommandPartial): Promise<SlashCommand> {
    return await this.commands.edit(id, cmd, this.guild)
  }

  async *[Symbol.asyncIterator](): AsyncIterableIterator<SlashCommand> {
    const arr = await this.all()
    const { readable, writable } = new TransformStream()
    const writer = writable.getWriter()
    arr.forEach((el: unknown) => writer.write(el))
    writer.close()
    yield* readable
  }
}
