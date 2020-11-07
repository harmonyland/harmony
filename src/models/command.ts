import { Message } from "../structures/message.ts"
import { TextChannel } from "../structures/textChannel.ts"
import { User } from "../structures/user.ts"
import { Collection } from "../utils/collection.ts"
import { CommandClient } from "./commandClient.ts"

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
}

export class Command {
  /** Name of the Command */
  name: string = ""
  /** Description of the Command */
  description?: string
  /** Array of Aliases of Command, or only string */
  aliases?: string | string[]
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

  execute(ctx?: CommandContext): any { }
}

export class CommandsManager {
  client: CommandClient
  list: Collection<string, Command> = new Collection()

  constructor(client: CommandClient) {
    this.client = client
  }

  /** Find a Command by name/alias */
  find(search: string): Command | undefined {
    if (this.client.caseSensitive === false) search = search.toLowerCase()
    return this.list.find((cmd: Command): boolean => {
      const name = this.client.caseSensitive === true ? cmd.name : cmd.name.toLowerCase()
      if (name === search) return true
      else if (cmd.aliases !== undefined) {
        let aliases: string[]
        if (typeof cmd.aliases === "string") aliases = [cmd.aliases]
        else aliases = cmd.aliases
        if (this.client.caseSensitive === false) aliases = aliases.map(e => e.toLowerCase())
        return aliases.includes(search)
      } else return false
    })
  }

  /** Check whether a Command exists or not */
  exists(search: Command | string): boolean {
    let exists = false
    if (typeof search === "string") return this.find(search) !== undefined
    else {
      exists = this.find(search.name) !== undefined
      if (search.aliases !== undefined) {
        const aliases: string[] = typeof search.aliases === "string" ? [search.aliases] : search.aliases
        exists = aliases.map(alias => this.find(alias) !== undefined).find(e => e) ?? false
      }
      return exists
    }
  }

  /** Add a Command */
  add(cmd: Command | typeof Command): boolean {
    // eslint-disable-next-line new-cap
    if (!(cmd instanceof Command)) cmd = new cmd()
    if (this.exists(cmd)) return false
    this.list.set(cmd.name, cmd)
    return true
  }

  /** Delete a Command */
  delete(cmd: string | Command): boolean {
    const find = typeof cmd === "string" ? this.find(cmd) : cmd
    if (find === undefined) return false
    else return this.list.delete(find.name)
  }
}

export interface ParsedCommand {
  name: string
  args: string[]
  argString: string
}

export const parseCommand = (client: CommandClient, msg: Message, prefix: string): ParsedCommand => {
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