import { Guild } from '../structures/guild.ts'
import { Message } from '../structures/message.ts'
import { TextChannel } from '../structures/textChannel.ts'
import { User } from '../structures/user.ts'
import { Collection } from '../utils/collection.ts'
import { CommandClient } from './commandClient.ts'
import { Extension } from "./extensions.ts"

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
  /** Array of Aliases of Command, or only string */
  aliases?: string | string[]
  /** Extension (Parent) of the Command */
  extension?: Extension
  /** Usage of Command, only Argument Names */
  usage?: string | string[]
  /** Usage Example of Command, only Arguments (without Prefix and Name) */
  examples?: string | string[]
  /** Does the Command take Arguments? Maybe number of required arguments? */
  args?: number | boolean
  /** Permission(s) required for using Command */
  permissions?: string | string[]
  /** Whether the Command can only be used in Guild (if allowed in DMs) */
  guildOnly?: boolean
  /** Whether the Command can only be used in Bot's DMs (if allowed) */
  dmOnly?: boolean
  /** Whether the Command can only be used by Bot Owners */
  ownerOnly?: boolean

  /** Method executed before executing actual command. Returns bool value - whether to continue or not (optional) */
  beforeExecute(ctx: CommandContext): boolean | Promise<boolean> { return true }
  /** Actual command code, which is executed when all checks have passed. */
  execute(ctx: CommandContext): any { }
  /** Method executed after executing command, passes on CommandContext and the value returned by execute too. (optional) */
  afterExecute(ctx: CommandContext, executeResult: any): any { }

  toString(): string {
    return `Command: ${this.name}${this.extension !== undefined ? ` [${this.extension.name}]` : ''}`
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
  get count(): number { return this.list.size }

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
          aliases = aliases.map(e => e.toLowerCase())
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
          aliases.map(alias => this.find(alias) !== undefined).find(e => e) ??
          false
      }
      return exists
    }
  }

  /** Add a Command */
  add(cmd: Command | typeof Command): boolean {
    // eslint-disable-next-line new-cap
    if (!(cmd instanceof Command)) cmd = new cmd()
    if (this.exists(cmd)) throw new Error(`Failed to add Command '${cmd.toString()}' with name/alias already exists.`)
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
    const cmd = typeof name === "string" ? this.find(name) : name
    if (cmd === undefined) return false
    const exists = this.exists(name)
    if (!exists) return false
    return this.disabled.has(cmd.name)
  }

  /** Disable a Command */
  disable(name: string | Command): boolean {
    const cmd = typeof name === "string" ? this.find(name) : name
    if (cmd === undefined) return false
    if (this.isDisabled(cmd)) return false
    this.disabled.add(cmd.name)
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
