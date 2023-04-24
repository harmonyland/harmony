/* eslint-disable no-useless-return */
import type { Guild } from '../structures/guild.ts'
import type { Message } from '../structures/message.ts'
import type { TextChannel } from '../structures/textChannel.ts'
import type { User } from '../structures/user.ts'
import { Collection } from '../utils/collection.ts'
import type { CommandClient } from './client.ts'
import type { Extension } from './extension.ts'
import { join, walk } from '../../deps.ts'
import type { Args } from '../utils/command.ts'
import { Member } from '../structures/member.ts'

export interface CommandContext {
  /** The Client object */
  client: CommandClient
  /** Message which was parsed for Command */
  message: Message
  /** The Author of the Message */
  author: User
  /** The Author of the message as a Member object */
  member?: Member
  /** The Channel in which Command was used */
  channel: TextChannel
  /** Prefix which was used */
  prefix: string
  /** Object of Command which was used */
  command: Command
  /** Name of Command which was used */
  name: string
  /** Array of Raw Arguments used with Command */
  rawArgs: string[]
  /** Array of Arguments used with Command */
  args: Record<string, unknown> | null
  /** Complete Raw String of Arguments */
  argString: string
  /** Guild which the command has called */
  guild?: Guild
}

export interface CommandOptions {
  /** Name of the Command */
  name?: string
  /** Description of the Command */
  description?: string
  /** Category of the Command */
  category?: string
  /** Array of Aliases of Command, or only string */
  aliases?: string | string[]
  /** Extension (Parent) of the Command */
  extension?: Extension
  /** Usage of Command, only Argument Names */
  usage?: string | string[]
  /** Usage Example of Command, only Arguments (without Prefix and Name) */
  examples?: string | string[]
  /** Make arguments optional. Eg: Don't require any args to be present to execute the command. default: false */
  optionalArgs?: boolean
  /** Does the Command take Arguments? Maybe number of required arguments? Or list of arguments? */
  args?: Args[]
  /** Permissions(s) required by both User and Bot in order to use Command */
  permissions?: string | string[]
  /** Permission(s) required for using Command */
  userPermissions?: string | string[]
  /** Permission(s) bot will need in order to execute Command */
  botPermissions?: string | string[]
  /** Role(s) user will require in order to use Command. List or one of ID or name */
  roles?: string | string[]
  /** Whitelisted Guilds. Only these Guild(s) can execute Command. (List or one of IDs) */
  whitelistedGuilds?: string | string[]
  /** Whitelisted Channels. Command can be executed only in these channels. (List or one of IDs) */
  whitelistedChannels?: string | string[]
  /** Whitelisted Users. Command can be executed only by these Users (List or one of IDs) */
  whitelistedUsers?: string | string[]
  /** Whether the Command can only be used in NSFW channel or not */
  nsfw?: boolean
  /** Whether the Command can only be used in Guild (if allowed in DMs) */
  guildOnly?: boolean
  /** Whether the Command can only be used in Bot's DMs (if allowed) */
  dmOnly?: boolean
  /** Whether the Command can only be used by Bot Owners */
  ownerOnly?: boolean
  /** Sub Commands */
  subCommands?: CommandOptions[]
}

export class Command implements CommandOptions {
  static meta?: CommandOptions

  name: string = ''
  description?: string
  category?: string
  aliases?: string | string[]
  extension?: Extension
  usage?: string | string[]
  examples?: string | string[]
  optionalArgs?: boolean
  args?: Args[]
  permissions?: string | string[]
  userPermissions?: string | string[]
  botPermissions?: string | string[]
  roles?: string | string[]
  whitelistedGuilds?: string | string[]
  whitelistedChannels?: string | string[]
  whitelistedUsers?: string | string[]
  nsfw?: boolean
  guildOnly?: boolean
  dmOnly?: boolean
  ownerOnly?: boolean
  subCommands?: Command[]
  /** Cooldown in MS */
  cooldown?: number
  /** Global command cooldown in MS */
  globalCooldown?: number

  declare readonly _decoratedSubCommands?: Command[]

  /** Method called when the command errors */
  onError(ctx: CommandContext, error: Error): unknown | Promise<unknown> {
    return
  }

  /** Method called when there are missing arguments */
  onMissingArgs(ctx: CommandContext): unknown | Promise<unknown> {
    return
  }

  /** Method executed before executing actual command. Returns bool value - whether to continue or not (optional) */
  beforeExecute(
    ctx: CommandContext
  ): boolean | Promise<boolean> | unknown | Promise<unknown> {
    return true
  }

  /** Actual command code, which is executed when all checks have passed. */
  execute(ctx: CommandContext): unknown | Promise<unknown> {
    return
  }

  /** Method executed after executing command, passes on CommandContext and the value returned by execute too. (optional) */
  afterExecute<T>(
    ctx: CommandContext,
    executeResult: T
  ): unknown | Promise<unknown> {
    return
  }

  toString(): string {
    return `Command: ${this.name}${
      this.extension !== undefined && this.extension.name !== ''
        ? ` [${this.extension.name}]`
        : this.category !== undefined
        ? ` [${this.category}]`
        : ''
    }`
  }

  constructor() {
    if (
      this._decoratedSubCommands !== undefined &&
      this._decoratedSubCommands.length > 0
    ) {
      if (this.subCommands === undefined) this.subCommands = []
      const commands = this._decoratedSubCommands
      delete (this as unknown as Record<string, unknown>)._decoratedSubCommands
      Object.defineProperty(this, '_decoratedSubCommands', {
        value: commands,
        enumerable: false
      })
    }
  }

  /** Get an Array of Sub Commands, including decorated ones */
  getSubCommands(): Command[] {
    return [...(this._decoratedSubCommands ?? []), ...(this.subCommands ?? [])]
  }
}

export class CommandCategory {
  /** Name of the Category. */
  name: string = ''
  /** Description of the Category. */
  description: string = ''
  /** Permissions(s) required by both User and Bot in order to use Category Commands */
  permissions?: string | string[]
  /** Permission(s) required for using Category Commands */
  userPermissions?: string | string[]
  /** Permission(s) bot will need in order to execute Category Commands */
  botPermissions?: string | string[]
  /** Role(s) user will require in order to use Category Commands. List or one of ID or name */
  roles?: string | string[]
  /** Whitelisted Guilds. Only these Guild(s) can execute Category Commands. (List or one of IDs) */
  whitelistedGuilds?: string | string[]
  /** Whitelisted Channels. Category Commands can be executed only in these channels. (List or one of IDs) */
  whitelistedChannels?: string | string[]
  /** Whitelisted Users. Category Commands can be executed only by these Users (List or one of IDs) */
  whitelistedUsers?: string | string[]
  /** Whether the Category Commands can only be used in Guild (if allowed in DMs) */
  guildOnly?: boolean
  /** Whether the Category Commands can only be used in Bot's DMs (if allowed) */
  dmOnly?: boolean
  /** Whether the Category Commands can only be used by Bot Owners */
  ownerOnly?: boolean
}

export class CommandBuilder extends Command {
  setName(name: string): CommandBuilder {
    this.name = name
    return this
  }

  setDescription(description?: string): CommandBuilder {
    this.description = description
    return this
  }

  setCategory(category?: string): CommandBuilder {
    this.category = category
    return this
  }

  setAlias(alias: string | string[]): CommandBuilder {
    this.aliases = alias
    return this
  }

  addAlias(alias: string | string[]): CommandBuilder {
    if (this.aliases === undefined) this.aliases = []
    if (typeof this.aliases === 'string') this.aliases = [this.aliases]

    this.aliases = [
      ...new Set(
        ...this.aliases,
        ...(typeof alias === 'string' ? [alias] : alias)
      )
    ]

    return this
  }

  setExtension(extension?: Extension): CommandBuilder {
    this.extension = extension
    return this
  }

  setUsage(usage: string | string[]): CommandBuilder {
    this.usage = usage
    return this
  }

  addUsage(usage: string | string[]): CommandBuilder {
    if (this.usage === undefined) this.usage = []
    if (typeof this.usage === 'string') this.usage = [this.usage]

    this.aliases = [
      ...new Set(
        ...this.usage,
        ...(typeof usage === 'string' ? [usage] : usage)
      )
    ]

    return this
  }

  setExample(examples: string | string[]): CommandBuilder {
    this.examples = examples
    return this
  }

  addExample(examples: string | string[]): CommandBuilder {
    if (this.examples === undefined) this.examples = []
    if (typeof this.examples === 'string') this.examples = [this.examples]

    this.examples = [
      ...new Set(
        ...this.examples,
        ...(typeof examples === 'string' ? [examples] : examples)
      )
    ]

    return this
  }

  setPermissions(perms?: string | string[]): CommandBuilder {
    this.permissions = perms
    return this
  }

  setUserPermissions(perms?: string | string[]): CommandBuilder {
    this.userPermissions = perms
    return this
  }

  setBotPermissions(perms?: string | string[]): CommandBuilder {
    this.botPermissions = perms
    return this
  }

  setRoles(roles: string | string[]): CommandBuilder {
    this.roles = roles
    return this
  }

  setWhitelistedGuilds(list: string | string[]): CommandBuilder {
    this.whitelistedGuilds = list
    return this
  }

  setWhitelistedUsers(list: string | string[]): CommandBuilder {
    this.whitelistedUsers = list
    return this
  }

  setWhitelistedChannels(list: string | string[]): CommandBuilder {
    this.whitelistedChannels = list
    return this
  }

  setGuildOnly(value: boolean = true): CommandBuilder {
    this.guildOnly = value
    return this
  }

  setNSFW(value: boolean = true): CommandBuilder {
    this.nsfw = value
    return this
  }

  setOwnerOnly(value: boolean = true): CommandBuilder {
    this.ownerOnly = value
    return this
  }

  onBeforeExecute<T extends CommandContext = CommandContext>(
    fn: (ctx: T) => boolean | Promise<boolean> | unknown | Promise<unknown>
  ): CommandBuilder {
    this.beforeExecute = fn
    return this
  }

  onExecute<T extends CommandContext = CommandContext>(
    fn: (ctx: T) => unknown | Promise<unknown>
  ): CommandBuilder {
    this.execute = fn
    return this
  }

  onAfterExecute<T extends CommandContext = CommandContext>(
    fn: <T2>(ctx: T, executeResult?: T2) => unknown | Promise<unknown>
  ): CommandBuilder {
    this.afterExecute = fn
    return this
  }

  setSubCommands(subCommands: Command[]): this {
    this.subCommands = subCommands
    return this
  }

  subCommand(command: Command): this {
    if (this.subCommands === undefined) this.subCommands = []
    this.subCommands.push(command)
    return this
  }
}

export class CommandsLoader {
  client: CommandClient
  #importSeq: { [name: string]: number } = {}

  constructor(client: CommandClient) {
    this.client = client
  }

  /**
   * Load a Command from file.
   *
   * NOTE: Relative paths resolve from cwd
   *
   * @param filePath Path of Command file.
   * @param exportName Export name. Default is the "default" export.
   */
  async load(
    filePath: string,
    exportName: string = 'default',
    onlyRead?: boolean
  ): Promise<Command> {
    const stat = await Deno.stat(filePath).catch(() => undefined)
    if (stat === undefined || stat.isFile !== true)
      throw new Error(`File not found on path ${filePath}`)

    let seq: number | undefined

    if (this.#importSeq[filePath] !== undefined) seq = this.#importSeq[filePath]
    const mod = await import(
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      'file:///' +
        join(Deno.cwd(), filePath) +
        (seq === undefined ? '' : `#${seq}`)
    )
    if (this.#importSeq[filePath] === undefined) this.#importSeq[filePath] = 0
    else this.#importSeq[filePath]++

    const Cmd = mod[exportName]
    if (Cmd === undefined)
      throw new Error(`Command not exported as ${exportName} from ${filePath}`)

    let cmd: Command
    try {
      if (Cmd instanceof Command) cmd = Cmd
      else cmd = new Cmd()
      if (!(cmd instanceof Command)) throw new Error('failed')
    } catch (e) {
      throw new Error(`Failed to load Command from ${filePath}`)
    }

    if (onlyRead !== true) this.client.commands.add(cmd)
    return cmd
  }

  /**
   * Load commands from a Directory.
   *
   * NOTE: Relative paths resolve from cwd
   *
   * @param path Path of the directory.
   * @param options Options to configure loading.
   */
  async loadDirectory(
    path: string,
    options?: {
      recursive?: boolean
      exportName?: string
      maxDepth?: number
      exts?: string[]
      onlyRead?: boolean
    }
  ): Promise<Command[]> {
    const commands: Command[] = []

    for await (const entry of walk(path, {
      maxDepth: options?.maxDepth,
      exts: options?.exts,
      includeDirs: false
    })) {
      if (entry.isFile !== true) continue
      const cmd = await this.load(
        entry.path,
        options?.exportName,
        options?.onlyRead
      )
      commands.push(cmd)
    }

    return commands
  }
}

export class CommandsManager {
  client: CommandClient
  list: Collection<string, Command> = new Collection()
  disabled: Set<string> = new Set()
  loader: CommandsLoader

  constructor(client: CommandClient) {
    this.client = client
    this.loader = new CommandsLoader(client)
  }

  /** Number of loaded Commands */
  get count(): number {
    return this.list.size
  }

  /** Filter out Commands by name/alias */
  filter(search: string, subPrefix?: string): Collection<string, Command> {
    if (this.client.caseSensitive === false) search = search.toLowerCase()
    return this.list.filter((cmd: Command): boolean => {
      if (subPrefix !== undefined) {
        if (
          this.client.caseSensitive === true
            ? subPrefix !== cmd.extension?.subPrefix
            : subPrefix.toLowerCase() !==
              cmd.extension?.subPrefix?.toLowerCase()
        ) {
          return false
        }
      } else if (
        subPrefix === undefined &&
        cmd.extension?.subPrefix !== undefined
      ) {
        return false
      }

      const name =
        this.client.caseSensitive === true ? cmd.name : cmd.name.toLowerCase()
      if (name === search) {
        return true
      } else if (cmd.aliases !== undefined) {
        let aliases: string[]
        if (typeof cmd.aliases === 'string') aliases = [cmd.aliases]
        else aliases = cmd.aliases
        if (this.client.caseSensitive === false)
          aliases = aliases.map((e) => e.toLowerCase())

        return aliases.includes(search)
      } else {
        return false
      }
    })
  }

  /** Find a Command by name/alias */
  find(search: string, subPrefix?: string): Command | undefined {
    const filtered = this.filter(search, subPrefix)
    return filtered.first()
  }

  /** Fetch a Command including disable checks, sub commands and subPrefix implementation */
  fetch(parsed: ParsedCommand, bypassDisable?: boolean): Command | undefined {
    let cmd = this.find(parsed.name)
    if (cmd?.extension?.subPrefix !== undefined) cmd = undefined

    if (cmd === undefined && parsed.args.length > 0) {
      cmd = this.find(parsed.args[0], parsed.name)
      if (cmd === undefined || cmd.extension?.subPrefix === undefined) return
      if (
        this.client.caseSensitive === true
          ? cmd.extension.subPrefix !== parsed.name
          : cmd.extension.subPrefix.toLowerCase() !== parsed.name.toLowerCase()
      )
        return

      const shifted = parsed.args.shift()
      if (shifted !== undefined)
        parsed.argString = parsed.argString.slice(shifted.length).trim()
    }

    if (cmd === undefined) return
    if (this.isDisabled(cmd) && bypassDisable !== true) return

    if (parsed.args.length !== 0 && cmd.subCommands !== undefined) {
      const resolveSubCommand = (command: Command = cmd!): Command => {
        let name = parsed.args[0]
        if (name === undefined) return command
        if (this.client.caseSensitive !== true) name = name.toLowerCase()
        const sub = command
          ?.getSubCommands()
          .find(
            (e) =>
              (this.client.caseSensitive === true
                ? e.name
                : e.name.toLowerCase()) === name ||
              (typeof e.aliases === 'string'
                ? [e.aliases]
                : e.aliases ?? []
              ).some(
                (e) =>
                  (this.client.caseSensitive === true ? e : e.toLowerCase()) ===
                  name
              )
          )
        if (sub !== undefined) {
          const shifted = parsed.args.shift()
          if (shifted !== undefined)
            parsed.argString = parsed.argString.slice(shifted.length).trim()
          return resolveSubCommand(sub)
        } else return command
      }

      cmd = resolveSubCommand()
    }

    return cmd
  }

  /** Check whether a Command exists or not */
  exists(search: Command | string, subPrefix?: string): boolean {
    let exists = false

    if (typeof search === 'string')
      return this.find(search, subPrefix) !== undefined
    else {
      exists =
        this.find(
          search.name,
          subPrefix === undefined ? search.extension?.subPrefix : subPrefix
        ) !== undefined

      if (search.aliases !== undefined) {
        const aliases: string[] =
          typeof search.aliases === 'string' ? [search.aliases] : search.aliases
        exists =
          aliases
            .map((alias) => this.find(alias) !== undefined)
            .find((e) => e) ?? false
      }

      return exists
    }
  }

  /** Add a Command */
  add(cmd: Command | typeof Command): boolean {
    let CmdClass: typeof Command | undefined
    if (!(cmd instanceof Command)) {
      CmdClass = cmd
      cmd = new CmdClass()
      Object.assign(cmd, CmdClass.meta ?? {})
    }
    if (this.exists(cmd, cmd.extension?.subPrefix))
      throw new Error(
        `Failed to add Command '${cmd.toString()}' with name/alias already exists.`
      )
    if (cmd.name === '' && CmdClass !== undefined) {
      let name = CmdClass.name
      if (
        name.toLowerCase().endsWith('command') &&
        name.toLowerCase() !== 'command'
      )
        name = name.substr(0, name.length - 'command'.length).trim()
      cmd.name = name
    }
    if (cmd.name === '') throw new Error('Command has no name')
    this.list.set(
      `${cmd.name}-${
        this.list.filter((e) =>
          this.client.caseSensitive === true
            ? e.name === cmd.name
            : e.name.toLowerCase() === cmd.name.toLowerCase()
        ).size
      }`,
      cmd
    )
    return true
  }

  /** Delete a Command */
  delete(cmd: string | Command): boolean {
    const search = this.filter(typeof cmd === 'string' ? cmd : cmd.name)
    if (search.size === 0) return false
    else return this.list.delete([...search.keys()][0])
  }

  /** Check whether a Command is disabled or not */
  isDisabled(name: string | Command): boolean {
    const cmd = typeof name === 'string' ? this.find(name) : name
    if (cmd === undefined) return false
    const exists = this.exists(name)
    if (!exists) return false
    return this.disabled.has(cmd.name)
  }

  /** Disable a Command */
  disable(name: string | Command): boolean {
    const cmd = typeof name === 'string' ? this.find(name) : name
    if (cmd === undefined) return false
    if (this.isDisabled(cmd)) return false
    this.disabled.add(cmd.name)
    return true
  }

  /** Get all commands of a Category */
  category(category: string): Collection<string, Command> {
    return this.list.filter(
      (cmd) => cmd.category !== undefined && cmd.category === category
    )
  }
}

export class CategoriesManager {
  client: CommandClient
  list: Collection<string, CommandCategory> = new Collection()

  constructor(client: CommandClient) {
    this.client = client
  }

  /** Get a Collection of Categories */
  all(): Collection<string, CommandCategory> {
    return this.list
  }

  /** Get a list of names of Categories added */
  names(): string[] {
    return [...this.list.keys()]
  }

  /** Check if a Category exists or not */
  has(category: string | CommandCategory): boolean {
    return this.list.has(
      typeof category === 'string' ? category : category.name
    )
  }

  /** Get a Category by name */
  get(name: string): CommandCategory | undefined {
    return this.list.get(name)
  }

  /** Add a Category to the Manager */
  add(category: CommandCategory): CategoriesManager {
    if (this.has(category))
      throw new Error(`Category ${category.name} already exists`)
    this.list.set(category.name, category)
    return this
  }

  /** Remove a Category from the Manager */
  remove(category: string | CommandCategory): boolean {
    if (!this.has(category)) return false
    this.list.delete(typeof category === 'string' ? category : category.name)
    return true
  }
}

/** Parsed Command object */
export interface ParsedCommand {
  name: string
  args: string[]
  argString: string
}

/** Parses a Command to later look for. */
export const parseCommand = (
  client: CommandClient,
  msg: Message,
  prefix: string
): ParsedCommand | undefined => {
  let content = msg.content.slice(prefix.length)
  if (client.spacesAfterPrefix === true) content = content.trim()
  const args = content.split(/\s/)

  const name = args.shift()
  if (name === undefined) return
  const argString = content.slice(name.length).trim()

  return {
    name,
    args,
    argString
  }
}
