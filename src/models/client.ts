import { User } from '../structures/user.ts'
import { GatewayIntents } from '../types/gateway.ts'
import { Gateway } from '../gateway/index.ts'
import { RESTManager } from './rest.ts'
import EventEmitter from 'https://deno.land/std@0.74.0/node/events.ts'
import { DefaultCacheAdapter, ICacheAdapter } from './cacheAdapter.ts'
import { UsersManager } from '../managers/users.ts'
import { GuildManager } from '../managers/guilds.ts'
import { ChannelsManager } from '../managers/channels.ts'
import { ClientPresence } from '../structures/presence.ts'
import { EmojisManager } from '../managers/emojis.ts'
import { ActivityGame, ClientActivity } from '../types/presence.ts'
import { ClientEvents } from '../gateway/handlers/index.ts'

/** Some Client Options to modify behaviour */
export interface ClientOptions {
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

  users: UsersManager = new UsersManager(this)
  guilds: GuildManager = new GuildManager(this)
  channels: ChannelsManager = new ChannelsManager(this)
  emojis: EmojisManager = new EmojisManager(this)

  /** Whether the REST Manager will use Canary API or not */
  canary: boolean = false
  /** Client's presence. Startup one if set before connecting */
  presence: ClientPresence = new ClientPresence()

  private readonly _untypedOn = this.on

  private readonly _untypedEmit = this.emit

  public on = <K extends string>(event: K, listener: ClientEvents[K]): this =>
    this._untypedOn(event, listener)

  public emit = <K extends string>(
    event: K,
    ...args: Parameters<ClientEvents[K]>
  ): boolean => this._untypedEmit(event, ...args)

  constructor(options: ClientOptions = {}) {
    super()
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

  // TODO(DjDeveloperr): Implement this
  // fetchApplication(): Promise<Application>

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
}
