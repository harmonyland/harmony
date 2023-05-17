import type { Message } from '../structures/message.ts'
import type { GuildTextBasedChannel } from '../structures/guildTextChannel.ts'
import { Client, ClientOptions } from '../client/mod.ts'
import {
  CategoriesManager,
  Command,
  CommandContext,
  CommandOptions,
  CommandsManager,
  parseCommand
} from './command.ts'
import { parseArgs } from '../utils/command.ts'
import { Extension, ExtensionsManager } from './extension.ts'

type PrefixType = string | RegExp | Array<string | RegExp>
type PrefixReturnType = PrefixType | Promise<PrefixType>

/** Command Client options extending Client Options to provide a lot of Commands-related customizations */
export interface CommandClientOptions extends ClientOptions {
  /** Global prefix(s) of the bot. Can be a string, a regular expression, or an array including either. */
  prefix: PrefixType
  /** Whether to enable mention prefix or not. */
  mentionPrefix?: boolean
  /** Method to get a Guild's custom prefix(s). */
  getGuildPrefix?: (guildID: string) => PrefixReturnType
  /** Method to get a User's custom prefix(s). */
  getUserPrefix?: (userID: string) => PrefixReturnType
  /** Method to get a Channel's custom prefix(s). */
  getChannelPrefix?: (channelID: string) => PrefixReturnType
  /** Method to check if certain Guild is blacklisted from using Commands. */
  isGuildBlacklisted?: (guildID: string) => boolean | Promise<boolean>
  /** Method to check if certain User is blacklisted from using Commands. */
  isUserBlacklisted?: (userID: string) => boolean | Promise<boolean>
  /** Method to check if certain Channel is blacklisted from using Commands. */
  isChannelBlacklisted?: (channelID: string) => boolean | Promise<boolean>
  /** Allow spaces after prefix? Recommended with Mention Prefix ON. */
  spacesAfterPrefix?: boolean
  /** List of Bot's Owner IDs whom can access `ownerOnly` commands. */
  owners?: string[]
  /** Whether to allow Bots to use Commands or not, not allowed by default. */
  allowBots?: boolean
  /** Whether to allow Commands in DMs or not, allowed by default. */
  allowDMs?: boolean
  /** Whether Commands should be case-sensitive or not, not by default. */
  caseSensitive?: boolean
  /** Global command cooldown in MS */
  globalCommandCooldown?: number
  /** Global cooldown in MS */
  globalCooldown?: number
}

export enum CommandCooldownType {
  /** Cooldown for command for user */
  USER_COMMAND,
  /** Cooldown for any command for bot */
  USER_GLOBAL,
  /** Cooldown for command for bot */
  BOT_COMMAND,
  /** Cooldown for any command for bot */
  BOT_GLOBAL
}

export type CommandContextMiddleware<T extends CommandContext> = (
  ctx: T,
  next: () => unknown | Promise<unknown>
) => unknown | Promise<unknown>

export type CommandContextMiddlewareNext = () => unknown | Promise<unknown>

/**
 * Harmony Client with extended functionality for Message based Commands parsing and handling.
 *
 * See InteractionsClient (`Client#slash`) for more info about Slash Commands.
 */
export class CommandClient extends Client implements CommandClientOptions {
  prefix: PrefixType
  mentionPrefix: boolean

  getGuildPrefix: (guildID: string) => PrefixReturnType
  getUserPrefix: (userID: string) => PrefixReturnType
  getChannelPrefix: (channelID: string) => PrefixReturnType

  isGuildBlacklisted: (guildID: string) => boolean | Promise<boolean>
  isUserBlacklisted: (userID: string) => boolean | Promise<boolean>
  isChannelBlacklisted: (channelID: string) => boolean | Promise<boolean>

  spacesAfterPrefix: boolean
  owners: string[]
  allowBots: boolean
  allowDMs: boolean
  caseSensitive: boolean

  extensions: ExtensionsManager = new ExtensionsManager(this)
  commands: CommandsManager = new CommandsManager(this)
  categories: CategoriesManager = new CategoriesManager(this)

  middlewares = new Array<CommandContextMiddleware<CommandContext>>()

  globalCommandCooldown = 0
  globalCooldown = 0

  private readonly lastUsed = new Map<
    string,
    { global: number; commands: { [key: string]: number } }
  >()

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

    this.getChannelPrefix =
      options.getChannelPrefix === undefined
        ? (id: string) => this.prefix
        : options.getChannelPrefix

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

    this.owners = options.owners === undefined ? [] : options.owners
    this.allowBots = options.allowBots === undefined ? false : options.allowBots
    this.allowDMs = options.allowDMs === undefined ? true : options.allowDMs
    this.caseSensitive =
      options.caseSensitive === undefined ? false : options.caseSensitive

    this.globalCommandCooldown = options.globalCommandCooldown ?? 0
    this.globalCooldown = options.globalCooldown ?? 0

    const self = this as any
    if (self._decoratedCommands !== undefined) {
      Object.values(self._decoratedCommands).forEach((entry: any) => {
        this.commands.add(entry)
      })
      self._decoratedCommands = undefined
    }

    this.on(
      'messageCreate',
      async (msg: Message) => await this.processMessage(msg)
    )
  }

  /**
   * Adds a Middleware Function to Command Client to pre-process all Commands,
   * and can even modify the Context to include additional properties, methods, etc.
   *
   * @param middleware Middleware function
   * @returns Command Client
   */
  use<T extends CommandContext>(middleware: CommandContextMiddleware<T>): this {
    this.middlewares.push(
      middleware as CommandContextMiddleware<CommandContext>
    )
    return this
  }

  /** Processes a Message to Execute Command. */
  async processMessage(msg: Message): Promise<any> {
    if (!this.allowBots && msg.author.bot === true) return

    let prefix: PrefixType = []
    if (typeof this.prefix === 'string' || this.prefix instanceof RegExp)
      prefix = [...prefix, this.prefix]
    else prefix = [...prefix, ...this.prefix]

    const userPrefix = await this.getUserPrefix(msg.author.id)
    if (userPrefix !== undefined) {
      if (typeof userPrefix === 'string' || userPrefix instanceof RegExp)
        prefix = [...prefix, userPrefix]
      else prefix = [...prefix, ...userPrefix]
    }

    if (msg.guild !== undefined) {
      const guildPrefix = await this.getGuildPrefix(msg.guild.id)
      if (guildPrefix !== undefined) {
        if (typeof guildPrefix === 'string' || guildPrefix instanceof RegExp)
          prefix = [...prefix, guildPrefix]
        else prefix = [...prefix, ...guildPrefix]
      }
    }

    prefix = [...new Set(prefix)]

    let mentionPrefix = false

    const usedPrefixes = []
    for (const p of prefix) {
      if (typeof p === 'string') {
        if (msg.content.startsWith(p) as boolean) {
          usedPrefixes.push(p)
        }
      } else {
        const match = msg.content.match(p)
        // The regex matches and is at the start of the message
        if (match !== null && match.index === 0) {
          usedPrefixes.push(match[0])
        }
      }
    }

    let usedPrefix = usedPrefixes.sort((b, a) => a.length - b.length)[0]
    if (usedPrefix === undefined && this.mentionPrefix) mentionPrefix = true

    if (mentionPrefix) {
      if (msg.content.startsWith(this.user?.mention as string) === true)
        usedPrefix = this.user?.mention as string
      else if (
        msg.content.startsWith(this.user?.nickMention as string) === true
      )
        usedPrefix = this.user?.nickMention as string
      else return
    }

    if (typeof usedPrefix !== 'string') return
    prefix = usedPrefix

    const parsed = parseCommand(this, msg, prefix)
    if (parsed === undefined) return
    const command = this.commands.fetch(parsed)

    if (command === undefined) return this.emit('commandNotFound', msg, parsed)
    const category =
      command.category !== undefined
        ? this.categories.get(command.category)
        : undefined

    // Guild whitelist exists, and if does and Command used in a Guild, is this Guild allowed?
    // This is a bit confusing here, if these settings on a Command exist, and also do on Category, Command overrides them
    if (
      command.whitelistedGuilds === undefined &&
      category?.whitelistedGuilds !== undefined &&
      msg.guild !== undefined &&
      category.whitelistedGuilds.includes(msg.guild.id) === false
    )
      return
    if (
      command.whitelistedGuilds !== undefined &&
      msg.guild !== undefined &&
      command.whitelistedGuilds.includes(msg.guild.id) === false
    )
      return

    // Checks for Channel Whitelist
    if (
      command.whitelistedChannels === undefined &&
      category?.whitelistedChannels !== undefined &&
      category.whitelistedChannels.includes(msg.channel.id) === false
    )
      return
    if (
      command.whitelistedChannels !== undefined &&
      command.whitelistedChannels.includes(msg.channel.id) === false
    )
      return

    // Checks for Users Whitelist
    if (
      command.whitelistedUsers === undefined &&
      category?.whitelistedUsers !== undefined &&
      category.whitelistedUsers.includes(msg.author.id) === false
    )
      return
    if (
      command.whitelistedUsers !== undefined &&
      command.whitelistedUsers.includes(msg.author.id) === false
    )
      return

    const ctx: CommandContext = {
      client: this,
      name: parsed.name,
      prefix,
      rawArgs: parsed.args,
      args: await parseArgs(command.args, parsed.args, msg),
      argString: parsed.argString,
      message: msg,
      author: msg.author,
      member: msg.member,
      command,
      channel: msg.channel,
      guild: msg.guild
    }

    const isUserBlacklisted = await this.isUserBlacklisted(msg.author.id)
    if (isUserBlacklisted) return this.emit('commandBlockedUser', ctx)

    const isChannelBlacklisted = await this.isChannelBlacklisted(msg.channel.id)
    if (isChannelBlacklisted) return this.emit('commandBlockedChannel', ctx)

    if (msg.guild !== undefined) {
      const isGuildBlacklisted = await this.isGuildBlacklisted(msg.guild.id)
      if (isGuildBlacklisted) return this.emit('commandBlockedGuild', ctx)
    }

    // In these checks too, Command overrides Category if present
    // Checks if Command is only for Owners
    if (
      (command.ownerOnly !== undefined || category === undefined
        ? command.ownerOnly
        : category.ownerOnly) === true &&
      !this.owners.includes(msg.author.id)
    )
      return this.emit('commandOwnerOnly', ctx)

    // Checks if Command is only for Guild
    if (
      (command.guildOnly !== undefined || category === undefined
        ? command.guildOnly
        : category.guildOnly) === true &&
      msg.guild === undefined
    )
      return this.emit('commandGuildOnly', ctx)

    // Checks if Command is only for DMs
    if (
      (command.dmOnly !== undefined || category === undefined
        ? command.dmOnly
        : category.dmOnly) === true &&
      msg.guild !== undefined
    )
      return this.emit('commandDmOnly', ctx)

    if (
      command.nsfw === true &&
      (msg.guild === undefined ||
        (msg.channel as unknown as GuildTextBasedChannel).nsfw !== true)
    )
      return this.emit('commandNSFW', ctx)

    const allPermissions =
      command.permissions !== undefined
        ? command.permissions
        : category?.permissions

    if (
      (command.botPermissions !== undefined ||
        category?.botPermissions !== undefined ||
        allPermissions !== undefined) &&
      msg.guild !== undefined
    ) {
      // TODO: Check Overwrites too
      const me = await msg.guild.me()
      const missing: string[] = []

      let permissions =
        command.botPermissions === undefined
          ? category?.permissions
          : command.botPermissions

      if (permissions !== undefined) {
        if (typeof permissions === 'string') permissions = [permissions]

        if (allPermissions !== undefined)
          permissions = [...new Set(...permissions, ...allPermissions)]

        for (const perm of permissions) {
          if (me.permissions.has(perm) === false) missing.push(perm)
        }

        if (missing.length !== 0)
          return this.emit('commandBotMissingPermissions', ctx, missing)
      }
    }

    if (
      (command.userPermissions !== undefined ||
        category?.userPermissions !== undefined ||
        allPermissions !== undefined) &&
      msg.guild !== undefined
    ) {
      let permissions =
        command.userPermissions !== undefined
          ? command.userPermissions
          : category?.userPermissions

      if (permissions !== undefined) {
        if (typeof permissions === 'string') permissions = [permissions]

        if (allPermissions !== undefined)
          permissions = [...new Set(...permissions, ...allPermissions)]

        const missing: string[] = []

        for (const perm of permissions) {
          const has =
            msg.guild.ownerID === msg.author.id ||
            msg.member?.permissions.has(perm)
          if (has !== true) missing.push(perm)
        }

        if (missing.length !== 0)
          return this.emit('commandUserMissingPermissions', ctx, missing)
      }
    }

    if (
      command.args !== undefined &&
      parsed.args.length === 0 &&
      command.optionalArgs !== true
    ) {
      try {
        return command.onMissingArgs(ctx)
      } catch (e) {
        return this.emit('commandMissingArgs', ctx)
      }
    }

    const userCooldowns = this.lastUsed.get(msg.author.id) ?? {
      global: 0,
      commands: {}
    }
    const botCooldowns = this.lastUsed.get('bot') ?? {
      global: 0,
      commands: {}
    }

    const userCanUseCommandAt =
      (userCooldowns.commands[command.name] ?? 0) +
      ((command.cooldown ?? 0) as number)
    const userCanUseAnyCommandAt =
      userCooldowns.global + this.globalCommandCooldown

    const anyoneCanUseCommandAt =
      (botCooldowns.commands[command.name] ?? 0) +
      ((command.globalCooldown ?? 0) as number)
    const anyoneCanUseAnyCommandAt = botCooldowns.global + this.globalCooldown

    if (
      Date.now() < anyoneCanUseCommandAt ||
      Date.now() < anyoneCanUseAnyCommandAt
    ) {
      const forCommand = anyoneCanUseCommandAt > anyoneCanUseAnyCommandAt
      return this.emit(
        'commandOnCooldown',
        ctx,
        (forCommand ? anyoneCanUseCommandAt : anyoneCanUseAnyCommandAt) -
          Date.now(),
        forCommand
          ? CommandCooldownType.BOT_COMMAND
          : CommandCooldownType.BOT_GLOBAL
      )
    }

    if (
      Date.now() < userCanUseCommandAt ||
      Date.now() < userCanUseAnyCommandAt
    ) {
      const forCommand = userCanUseCommandAt > userCanUseAnyCommandAt
      return this.emit(
        'commandOnCooldown',
        ctx,
        (forCommand ? userCanUseCommandAt : userCanUseAnyCommandAt) -
          Date.now(),
        forCommand
          ? CommandCooldownType.USER_COMMAND
          : CommandCooldownType.USER_GLOBAL
      )
    }

    const lastNext = async (): Promise<void> => {
      try {
        this.emit('commandUsed', ctx)
        const beforeExecute = await command.beforeExecute(ctx)
        if (beforeExecute === false) return

        const result = await command.execute(ctx)
        await command.afterExecute(ctx, result)

        userCooldowns.commands[command.name] = Date.now()
        userCooldowns.global = Date.now()
        botCooldowns.commands[command.name] = Date.now()
        botCooldowns.global = Date.now()

        this.lastUsed.set(msg.author.id, userCooldowns)
        this.lastUsed.set('bot', botCooldowns)
      } catch (e) {
        try {
          await command.onError(ctx, e as Error)
        } catch (e) {
          this.emit('commandError', ctx, e as Error)
        }
        this.emit('commandError', ctx, e as Error)
      }
    }

    if (this.middlewares.length === 0) await lastNext()
    else {
      const createNext = (index: number): CommandContextMiddlewareNext => {
        const fn = this.middlewares[index + 1] ?? lastNext
        return () => fn(ctx, createNext(index + 1))
      }

      const middleware = this.middlewares[0]
      const next = createNext(0)

      await middleware(ctx, next)
    }
  }
}

/**
 * Command decorator. Decorates the function with optional metadata as a Command registered upon constructing class.
 */
export function command(options?: CommandOptions) {
  return function (target: CommandClient | Extension, name: string) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const c = target as any
    if (c._decoratedCommands === undefined) c._decoratedCommands = {}

    const prop = c[name]

    if (typeof prop !== 'function')
      throw new Error('@command decorator can only be used on class methods')

    const command = new Command()

    command.name = name
    command.execute = prop

    if (options !== undefined) Object.assign(command, options)

    if (target instanceof Extension) command.extension = target

    c._decoratedCommands[command.name] = command
  }
}

/**
 * Sub Command decorator. Decorates the function with optional metadata as a Sub Command registered upon constructing class.
 */
export function subcommand(options?: CommandOptions) {
  return function (target: Command, name: string) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const c = target as any
    if (c._decoratedSubCommands === undefined) c._decoratedSubCommands = []

    const prop = c[name]

    if (typeof prop !== 'function')
      throw new Error('@command decorator can only be used on class methods')

    const command = new Command()

    command.name = name
    command.execute = prop

    if (options !== undefined) Object.assign(command, options)
    c._decoratedSubCommands.push(command)
  }
}
