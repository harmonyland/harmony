import { Message } from "../../mod.ts"
import { awaitSync } from "../utils/mixedPromise.ts"
import { Client, ClientOptions } from './client.ts'
import { CommandContext, CommandsManager, parseCommand } from './command.ts'
import { ExtensionsManager } from "./extensions.ts"

type PrefixReturnType = string | string[] | Promise<string | string[]>

export interface CommandClientOptions extends ClientOptions {
  prefix: string | string[]
  mentionPrefix?: boolean
  getGuildPrefix?: (guildID: string) => PrefixReturnType
  getUserPrefix?: (userID: string) => PrefixReturnType
  isGuildBlacklisted?: (guildID: string) => boolean | Promise<boolean>
  isUserBlacklisted?: (guildID: string) => boolean | Promise<boolean>
  isChannelBlacklisted?: (guildID: string) => boolean | Promise<boolean>
  spacesAfterPrefix?: boolean
  betterArgs?: boolean
  owners?: string[]
  allowBots?: boolean
  allowDMs?: boolean
  caseSensitive?: boolean
}

export class CommandClient extends Client implements CommandClientOptions {
  prefix: string | string[]
  mentionPrefix: boolean
  getGuildPrefix: (guildID: string) => PrefixReturnType
  getUserPrefix: (userID: string) => PrefixReturnType
  isGuildBlacklisted: (guildID: string) => boolean | Promise<boolean>
  isUserBlacklisted: (guildID: string) => boolean | Promise<boolean>
  isChannelBlacklisted: (guildID: string) => boolean | Promise<boolean>
  spacesAfterPrefix: boolean
  betterArgs: boolean
  owners: string[]
  allowBots: boolean
  allowDMs: boolean
  caseSensitive: boolean
  extensions: ExtensionsManager = new ExtensionsManager(this)
  commands: CommandsManager = new CommandsManager(this)

  constructor(options: CommandClientOptions) {
    super(options)
    this.prefix = options.prefix
    this.mentionPrefix =
      options.mentionPrefix === undefined ? false : options.mentionPrefix
    this.getGuildPrefix =
      options.getGuildPrefix === undefined
        ? (id: string) => this.prefix
        : options.getGuildPrefix
    this.getUserPrefix =
      options.getUserPrefix === undefined
        ? (id: string) => this.prefix
        : options.getUserPrefix
    this.isUserBlacklisted =
      options.isUserBlacklisted === undefined
        ? (id: string) => false
        : options.isUserBlacklisted
    this.isGuildBlacklisted =
      options.isGuildBlacklisted === undefined
        ? (id: string) => false
        : options.isGuildBlacklisted
    this.isChannelBlacklisted =
      options.isChannelBlacklisted === undefined
        ? (id: string) => false
        : options.isChannelBlacklisted
    this.spacesAfterPrefix =
      options.spacesAfterPrefix === undefined
        ? false
        : options.spacesAfterPrefix
    this.betterArgs =
      options.betterArgs === undefined ? false : options.betterArgs
    this.owners = options.owners === undefined ? [] : options.owners
    this.allowBots = options.allowBots === undefined ? false : options.allowBots
    this.allowDMs = options.allowDMs === undefined ? true : options.allowDMs
    this.caseSensitive =
      options.caseSensitive === undefined ? false : options.caseSensitive

    this.on(
      'messageCreate',
      async (msg: Message) => await this.processMessage(msg)
    )
  }

  async processMessage(msg: Message): Promise<any> {
    if (!this.allowBots && msg.author.bot === true) return

    const isUserBlacklisted = await awaitSync(this.isUserBlacklisted(msg.author.id))
    if (isUserBlacklisted === true) return

    const isChannelBlacklisted = await awaitSync(this.isChannelBlacklisted(msg.channel.id))
    if (isChannelBlacklisted === true) return

    if (msg.guild !== undefined) {
      const isGuildBlacklisted = await awaitSync(this.isGuildBlacklisted(msg.guild.id))
      if (isGuildBlacklisted === true) return
    }

    let prefix: string | string[] = this.prefix

    if (msg.guild !== undefined) {
      prefix = await awaitSync(this.getGuildPrefix(msg.guild.id))
    } else {
      prefix = await awaitSync(this.getUserPrefix(msg.author.id))
    }

    let mentionPrefix = false

    if (typeof prefix === 'string') {
      if (msg.content.startsWith(prefix) === false) {
        if (this.mentionPrefix) mentionPrefix = true
        else return
      }
    } else {
      const usedPrefix = prefix.find(v => msg.content.startsWith(v))
      if (usedPrefix === undefined) {
        if (this.mentionPrefix) mentionPrefix = true
        else return
      }
      else prefix = usedPrefix
    }

    if (mentionPrefix) {
      if (msg.content.startsWith(this.user?.mention as string) === true) prefix = this.user?.mention as string
      else if (msg.content.startsWith(this.user?.nickMention as string) === true) prefix = this.user?.nickMention as string
      else return
    }

    if (typeof prefix !== 'string') return

    const parsed = parseCommand(this, msg, prefix)
    const command = this.commands.find(parsed.name)

    if (command === undefined) return

    if (command.whitelistedGuilds !== undefined && msg.guild !== undefined && command.whitelistedGuilds.includes(msg.guild.id) === false) return;
    if (command.whitelistedChannels !== undefined && command.whitelistedChannels.includes(msg.channel.id) === false) return;
    if (command.whitelistedUsers !== undefined && command.whitelistedUsers.includes(msg.author.id) === false) return;

    const ctx: CommandContext = {
      client: this,
      name: parsed.name,
      prefix,
      args: parsed.args,
      argString: parsed.argString,
      message: msg,
      author: msg.author,
      command,
      channel: msg.channel,
      guild: msg.guild
    }

    if (command.guildOnly === true && msg.guild === undefined) return this.emit('commandGuildOnly', ctx, command)
    if (command.dmOnly === true && msg.guild !== undefined) return this.emit('commandDmOnly', ctx, command)
    if (command.ownerOnly === true && !this.owners.includes(msg.author.id)) return this.emit('commandOwnerOnly', ctx, command)
    
    if (command.botPermissions !== undefined && msg.guild !== undefined) {
      const me = await msg.guild.me()
      const missing: string[] = []
      
      for (const perm of command.botPermissions) {
        if (me.permissions.has(perm) === false) missing.push(perm)
      }

      if (missing.length !== 0) return this.emit('commandBotMissingPermissions', ctx, command, missing)
    }

    if (command.permissions !== undefined && msg.guild !== undefined) {
      const missing: string[] = []
      let perms: string[] = []
      if (typeof command.permissions === 'string') perms = [command.permissions]
      else perms = command.permissions
      for (const perm of perms) {
        const has = msg.member?.permissions.has(perm)
        if (has !== true) missing.push(perm)
      } 
      if (missing.length !== 0) return this.emit('commandMissingPermissions', command, missing, ctx)
    }

    try {
      this.emit('commandUsed', ctx, command)

      const beforeExecute = await awaitSync(command.beforeExecute(ctx))
      if (beforeExecute === false) return

      const result = await awaitSync(command.execute(ctx))
      command.afterExecute(ctx, result)
    } catch (e) {
      this.emit('commandError', command, ctx, e)
    }
  }
}
