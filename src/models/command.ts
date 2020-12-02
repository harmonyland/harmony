import { Guild } from '../structures/guild.ts'
import { Message } from '../structures/message.ts'
import { TextChannel } from '../structures/textChannel.ts'
import { User } from '../structures/user.ts'
import { Collection } from '../utils/collection.ts'
import { CommandClient } from './commandClient.ts'
import { Extension } from './extensions.ts'

export interface CommandContext {
  /** The Client object */
  client: CommandClient
  /** Message which was parsed for Command */
  message: Message
  /** The Author of the Message */
  author: User
  /** The Channel in which Command was used */
  channel: TextChannel
  /** Prefix which was used */
  prefix: string
  /** Oject of Command which was used */
  command: Command
  /** Name of Command which was used */
  name: string
  /** Array of Arguments used with Command */
  args: string[]
  /** Complete Raw String of Arguments */
  argString: string
  /** Guild which the command has called */
  guild?: Guild
}

export class Command {
  /** Name of the Command */
  name: string = ''
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
  /** Does the Command take Arguments? Maybe number of required arguments? Or list of arguments? */
  args?: number | boolean | string[]
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
  /** Whether the Command can only be used in Guild (if allowed in DMs) */
  guildOnly?: boolean
  /** Whether the Command can only be used in Bot's DMs (if allowed) */
  dmOnly?: boolean
  /** Whether the Command can only be used by Bot Owners */
  ownerOnly?: boolean

  /** Method executed before executing actual command. Returns bool value - whether to continue or not (optional) */
  beforeExecute(ctx: CommandContext): boolean | Promise<boolean> {
    return true
  }

  /** Actual command code, which is executed when all checks have passed. */
  execute(ctx: CommandContext): any {}
  /** Method executed after executing command, passes on CommandContext and the value returned by execute too. (optional) */
  afterExecute(ctx: CommandContext, executeResult: any): any {}

  toString(): string {
    return `Command: ${this.name}${
      this.extension !== undefined
        ? ` [${this.extension.name}]`
        : this.category !== undefined
        ? ` [${this.category}]`
        : ''
    }`
  }
}

export class CommandCategory {
  /** Name of the Category. */
  name: string = ''
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

  setOwnerOnly(value: boolean = true): CommandBuilder {
    this.ownerOnly = value
    return this
  }

  onBeforeExecute(fn: (ctx: CommandContext) => boolean | any): CommandBuilder {
    this.beforeExecute = fn
    return this
  }

  onExecute(fn: (ctx: CommandContext) => any): CommandBuilder {
    this.execute = fn
    return this
  }

  onAfterExecute(
    fn: (ctx: CommandContext, executeResult?: any) => any
  ): CommandBuilder {
    this.afterExecute = fn
    return this
  }
}

export class CommandsManager {
  client: CommandClient
  list: Collection<string, Command> = new Collection()
  disabled: Set<string> = new Set()

  constructor(client: CommandClient) {
    this.client = client
  }

  /** Number of loaded Commands */
  get count(): number {
    return this.list.size
  }

  /** Find a Command by name/alias */
  find(search: string): Command | undefined {
    if (this.client.caseSensitive === false) search = search.toLowerCase()
    return this.list.find((cmd: Command): boolean => {
      const name =
        this.client.caseSensitive === true ? cmd.name : cmd.name.toLowerCase()
      if (name === search) return true
      else if (cmd.aliases !== undefined) {
        let aliases: string[]
        if (typeof cmd.aliases === 'string') aliases = [cmd.aliases]
        else aliases = cmd.aliases
        if (this.client.caseSensitive === false)
          aliases = aliases.map((e) => e.toLowerCase())
        return aliases.includes(search)
      } else return false
    })
  }

  /** Fetch a Command including disable checks */
  fetch(name: string, bypassDisable?: boolean): Command | undefined {
    const cmd = this.find(name)
    if (cmd === undefined) return
    if (this.isDisabled(cmd) && bypassDisable !== true) return
    return cmd
  }

  /** Check whether a Command exists or not */
  exists(search: Command | string): boolean {
    let exists = false
    if (typeof search === 'string') return this.find(search) !== undefined
    else {
      exists = this.find(search.name) !== undefined
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
    // eslint-disable-next-line new-cap
    if (!(cmd instanceof Command)) cmd = new cmd()
    if (this.exists(cmd))
      throw new Error(
        `Failed to add Command '${cmd.toString()}' with name/alias already exists.`
      )
    this.list.set(cmd.name, cmd)
    return true
  }

  /** Delete a Command */
  delete(cmd: string | Command): boolean {
    const find = typeof cmd === 'string' ? this.find(cmd) : cmd
    if (find === undefined) return false
    else return this.list.delete(find.name)
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

export interface ParsedCommand {
  name: string
  args: string[]
  argString: string
}

export const parseCommand = (
  client: CommandClient,
  msg: Message,
  prefix: string
): ParsedCommand => {
  let content = msg.content.slice(prefix.length)
  if (client.spacesAfterPrefix === true) content = content.trim()
  const args = content.split(client.betterArgs === true ? /[\S\s]*/ : / +/)
  const name = args.shift() as string
  const argString = content.slice(name.length).trim()

  return {
    name,
    args,
    argString
  }
}
