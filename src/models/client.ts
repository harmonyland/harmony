/* eslint-disable @typescript-eslint/method-signature-style */
import { User } from '../structures/user.ts'
import { GatewayIntents } from '../types/gateway.ts'
import { Gateway } from '../gateway/index.ts'
import { RESTManager } from './rest.ts'
import { EventEmitter } from '../../deps.ts'
import { DefaultCacheAdapter, ICacheAdapter } from './cacheAdapter.ts'
import { UsersManager } from '../managers/users.ts'
import { GuildManager } from '../managers/guilds.ts'
import { ChannelsManager } from '../managers/channels.ts'
import { ClientPresence } from '../structures/presence.ts'
import { EmojisManager } from '../managers/emojis.ts'
import { ActivityGame, ClientActivity } from '../types/presence.ts'
import { Extension } from './extensions.ts'
import { SlashClient } from './slashClient.ts'
import { Interaction } from '../structures/slash.ts'
import { SlashModule } from './slashModule.ts'
import type { ShardManager } from './shard.ts'
import { Application } from '../structures/application.ts'
import { Invite } from '../structures/invite.ts'
import { INVITE } from '../types/endpoint.ts'
import { ClientEvents } from '../gateway/handlers/index.ts'

/** OS related properties sent with Gateway Identify */
export interface ClientProperties {
  os?: 'darwin' | 'windows' | 'linux' | 'custom_os' | string
  browser?: 'harmony' | string
  device?: 'harmony' | string
}

/** Some Client Options to modify behaviour */
export interface ClientOptions {
  /** ID of the Client/Application to initialize Slash Client REST */
  id?: string
  /** Token of the Bot/User */
  token?: string
  /** Gateway Intents */
  intents?: GatewayIntents[]
  /** Cache Adapter to use, defaults to Collections one */
  cache?: ICacheAdapter
  /** Force New Session and don't use cached Session (by persistent caching) */
  forceNewSession?: boolean
  /** Startup presence of client */
  presence?: ClientPresence | ClientActivity | ActivityGame
  /** Force all requests to Canary API */
  canary?: boolean
  /** Time till which Messages are to be cached, in MS. Default is 3600000 */
  messageCacheLifetime?: number
  /** Time till which Message Reactions are to be cached, in MS. Default is 3600000 */
  reactionCacheLifetime?: number
  /** Whether to fetch Uncached Message of Reaction or not? */
  fetchUncachedReactions?: boolean
  /** Client Properties */
  clientProperties?: ClientProperties
  /** Enable/Disable Slash Commands Integration (enabled by default) */
  enableSlash?: boolean
}

export declare interface Client {
  on<K extends keyof ClientEvents>(
    event: K,
    listener: (...args: ClientEvents[K]) => void
  ): this
  on(event: string | symbol, listener: (...args: any[]) => void): this

  once<K extends keyof ClientEvents>(
    event: K,
    listener: (...args: ClientEvents[K]) => void
  ): this
  once(event: string | symbol, listener: (...args: any[]) => void): this

  emit<K extends keyof ClientEvents>(
    event: K,
    ...args: ClientEvents[K]
  ): boolean
  emit(event: string | symbol, ...args: any[]): boolean

  off<K extends keyof ClientEvents>(
    event: K,
    listener: (...args: ClientEvents[K]) => void
  ): this
  off(event: string | symbol, listener: (...args: any[]) => void): this
}

/**
 * Discord Client.
 */
export class Client extends EventEmitter {
  /** Gateway object */
  gateway?: Gateway
  /** REST Manager - used to make all requests */
  rest: RESTManager = new RESTManager(this)
  /** User which Client logs in to, undefined until logs in */
  user?: User
  /** WebSocket ping of Client */
  ping = 0
  /** Token of the Bot/User */
  token?: string
  /** Cache Adapter */
  cache: ICacheAdapter = new DefaultCacheAdapter()
  /** Gateway Intents */
  intents?: GatewayIntents[]
  /** Whether to force new session or not */
  forceNewSession?: boolean
  /** Time till messages to stay cached, in MS. */
  messageCacheLifetime: number = 3600000
  /** Time till messages to stay cached, in MS. */
  reactionCacheLifetime: number = 3600000
  /** Whether to fetch Uncached Message of Reaction or not? */
  fetchUncachedReactions: boolean = false
  /** Client Properties */
  clientProperties: ClientProperties
  /** Slash-Commands Management client */
  slash: SlashClient

  users: UsersManager = new UsersManager(this)
  guilds: GuildManager = new GuildManager(this)
  channels: ChannelsManager = new ChannelsManager(this)
  emojis: EmojisManager = new EmojisManager(this)

  /** Whether the REST Manager will use Canary API or not */
  canary: boolean = false
  /** Client's presence. Startup one if set before connecting */
  presence: ClientPresence = new ClientPresence()
  _decoratedEvents?: {
    [name: string]: (...args: any[]) => void
  }

  _decoratedSlash?: Array<{
    name: string
    guild?: string
    parent?: string
    group?: string
    handler: (interaction: Interaction) => any
  }>

  _decoratedSlashModules?: SlashModule[]
  _id?: string

  /** Shard on which this Client is */
  shard: number = 0
  /** Shard Manager of this Client if Sharded */
  shardManager?: ShardManager

  constructor(options: ClientOptions = {}) {
    super()
    this._id = options.id
    this.token = options.token
    this.intents = options.intents
    this.forceNewSession = options.forceNewSession
    if (options.cache !== undefined) this.cache = options.cache
    if (options.presence !== undefined)
      this.presence =
        options.presence instanceof ClientPresence
          ? options.presence
          : new ClientPresence(options.presence)
    if (options.canary === true) this.canary = true
    if (options.messageCacheLifetime !== undefined)
      this.messageCacheLifetime = options.messageCacheLifetime
    if (options.reactionCacheLifetime !== undefined)
      this.reactionCacheLifetime = options.reactionCacheLifetime
    if (options.fetchUncachedReactions === true)
      this.fetchUncachedReactions = true

    if (
      this._decoratedEvents !== undefined &&
      Object.keys(this._decoratedEvents).length !== 0
    ) {
      Object.entries(this._decoratedEvents).forEach((entry) => {
        this.on(entry[0], entry[1])
      })
      this._decoratedEvents = undefined
    }

    this.clientProperties =
      options.clientProperties === undefined
        ? {
            os: Deno.build.os,
            browser: 'harmony',
            device: 'harmony'
          }
        : options.clientProperties

    this.slash = new SlashClient({
      id: () => this.getEstimatedID(),
      client: this,
      enabled: options.enableSlash
    })
  }

  /**
   * Sets Cache Adapter
   *
   * Should NOT be set after bot is already logged in or using current cache.
   * Please look into using `cache` option.
   */
  setAdapter(adapter: ICacheAdapter): Client {
    this.cache = adapter
    return this
  }

  /** Changes Presence of Client */
  setPresence(presence: ClientPresence | ClientActivity | ActivityGame): void {
    if (presence instanceof ClientPresence) {
      this.presence = presence
    } else this.presence = new ClientPresence(presence)
    this.gateway?.sendPresence(this.presence.create())
  }

  /** Emits debug event */
  debug(tag: string, msg: string): void {
    this.emit('debug', `[${tag}] ${msg}`)
  }

  getEstimatedID(): string {
    if (this.user !== undefined) return this.user.id
    else if (this.token !== undefined) {
      try {
        return atob(this.token.split('.')[0])
      } catch (e) {
        return this._id ?? 'unknown'
      }
    } else {
      return this._id ?? 'unknown'
    }
  }

  /** Fetch Application of the Client */
  async fetchApplication(): Promise<Application> {
    const app = await this.rest.api.oauth2.applications['@me'].get()
    return new Application(this, app)
  }

  /** Fetch an Invite */
  async fetchInvite(id: string): Promise<Invite> {
    return await new Promise((resolve, reject) => {
      this.rest
        .get(INVITE(id))
        .then((data) => {
          resolve(new Invite(this, data))
        })
        .catch((e) => reject(e))
    })
  }

  /**
   * This function is used for connecting to discord.
   * @param token Your token. This is required.
   * @param intents Gateway intents in array. This is required.
   */
  connect(token?: string, intents?: GatewayIntents[]): void {
    if (token === undefined && this.token !== undefined) token = this.token
    else if (this.token === undefined && token !== undefined) {
      this.token = token
    } else throw new Error('No Token Provided')
    if (intents !== undefined && this.intents !== undefined) {
      this.debug(
        'client',
        'Intents were set in both client and connect function. Using the one in the connect function...'
      )
    } else if (intents === undefined && this.intents !== undefined) {
      intents = this.intents
    } else if (intents !== undefined && this.intents === undefined) {
      this.intents = intents
    } else throw new Error('No Gateway Intents were provided')
    this.gateway = new Gateway(this, token, intents)
  }

  async waitFor<K extends keyof ClientEvents>(
    event: K,
    checkFunction: (...args: ClientEvents[K]) => boolean,
    timeout?: number
  ): Promise<ClientEvents[K] | []> {
    return await new Promise((resolve) => {
      let timeoutID: number | undefined
      if (timeout !== undefined) {
        timeoutID = setTimeout(() => {
          this.off(event, eventFunc)
          resolve([])
        }, timeout)
      }
      const eventFunc = (...args: ClientEvents[K]): void => {
        if (checkFunction(...args)) {
          resolve(args)
          this.off(event, eventFunc)
          if (timeoutID !== undefined) clearTimeout(timeoutID)
        }
      }
      this.on(event, eventFunc)
    })
  }
}

export function event(name?: keyof ClientEvents) {
  return function (client: Client | Extension, prop: keyof ClientEvents) {
    const listener = ((client as unknown) as {
      [name in keyof ClientEvents]: (...args: ClientEvents[name]) => any
    })[prop]
    if (typeof listener !== 'function')
      throw new Error('@event decorator requires a function')
    if (client._decoratedEvents === undefined) client._decoratedEvents = {}
    const key = name === undefined ? prop : name

    client._decoratedEvents[key] = listener
  }
}

/** Decorator to create a Slash Command handler */
export function slash(name?: string, guild?: string) {
  return function (client: Client | SlashModule, prop: string) {
    if (client._decoratedSlash === undefined) client._decoratedSlash = []
    const item = (client as { [name: string]: any })[prop]
    if (typeof item !== 'function') {
      client._decoratedSlash.push(item)
    } else
      client._decoratedSlash.push({
        name: name ?? prop,
        guild,
        handler: item
      })
  }
}

/** Decorator to create a Sub-Slash Command handler */
export function subslash(parent: string, name?: string, guild?: string) {
  return function (client: Client | SlashModule, prop: string) {
    if (client._decoratedSlash === undefined) client._decoratedSlash = []
    const item = (client as { [name: string]: any })[prop]
    if (typeof item !== 'function') {
      item.parent = parent
      client._decoratedSlash.push(item)
    } else
      client._decoratedSlash.push({
        parent,
        name: name ?? prop,
        guild,
        handler: item
      })
  }
}

/** Decorator to create a Grouped Slash Command handler */
export function groupslash(
  parent: string,
  group: string,
  name?: string,
  guild?: string
) {
  return function (client: Client | SlashModule | SlashClient, prop: string) {
    if (client._decoratedSlash === undefined) client._decoratedSlash = []
    const item = (client as { [name: string]: any })[prop]
    if (typeof item !== 'function') {
      item.parent = parent
      item.group = group
      client._decoratedSlash.push(item)
    } else
      client._decoratedSlash.push({
        group,
        parent,
        name: name ?? prop,
        guild,
        handler: item
      })
  }
}

/** Decorator to add a Slash Module to Client */
export function slashModule() {
  return function (client: Client, prop: string) {
    if (client._decoratedSlashModules === undefined)
      client._decoratedSlashModules = []

    const mod = ((client as unknown) as { [key: string]: any })[prop]
    client._decoratedSlashModules.push(mod)
  }
}
