import { User } from '../structures/user.ts'
import { GatewayIntents } from '../types/gateway.ts'
import { Gateway } from '../gateway/index.ts'
import { RESTManager } from './rest.ts'
import EventEmitter from 'https://deno.land/std@0.74.0/node/events.ts'
import { DefaultCacheAdapter, ICacheAdapter } from './cacheAdapter.ts'
import { UserManager } from '../managers/users.ts'
import { GuildManager } from '../managers/guilds.ts'
import { EmojisManager } from '../managers/emojis.ts'
import { ChannelsManager } from '../managers/channels.ts'
import { MessagesManager } from '../managers/messages.ts'
import { ActivityGame, ClientActivity, ClientPresence } from '../structures/presence.ts'

/** Some Client Options to modify behaviour */
export interface ClientOptions {
  /** Token of the Bot/User */
  token?: string
  /** Gateway Intents */
  intents?: GatewayIntents[]
  /** Cache Adapter to use, defaults to Collections one */
  cache?: ICacheAdapter,
  /** Force New Session and don't use cached Session (by persistent caching) */
  forceNewSession?: boolean,
  /** Startup presence of client */
  presence?: ClientPresence | ClientActivity | ActivityGame
  /** Whether it's a bot user or not? Use this if selfbot! */
  bot?: boolean
  /** Force all requests to Canary API */
  canary?: boolean
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

  users: UserManager = new UserManager(this)
  guilds: GuildManager = new GuildManager(this)
  channels: ChannelsManager = new ChannelsManager(this)
  messages: MessagesManager = new MessagesManager(this)
  emojis: EmojisManager = new EmojisManager(this)
  
  /** Whether this client will login as bot user or not */
  bot: boolean = true
  /** Whether the REST Manager will use Canary API or not */
  canary: boolean = false
  /** Client's presence. Startup one if set before connecting */
  presence: ClientPresence = new ClientPresence()

  constructor (options: ClientOptions = {}) {
    super()
    this.token = options.token
    this.intents = options.intents
    this.forceNewSession = options.forceNewSession
    if (options.cache !== undefined) this.cache = options.cache
    if (options.presence !== undefined) this.presence = options.presence instanceof ClientPresence ? options.presence : new ClientPresence(options.presence)
    if (options.bot === false) this.bot = false
    if (options.canary === true) this.canary = true
  }

  /** Set Cache Adapter */
  setAdapter (adapter: ICacheAdapter): Client {
    this.cache = adapter
    return this
  }

  /** Change Presence of Client */
  setPresence (presence: ClientPresence | ClientActivity | ActivityGame): void {
    if (presence instanceof ClientPresence) {
      this.presence = presence
    } else this.presence = new ClientPresence(presence)
    this.gateway?.sendPresence(this.presence.create())
  }

  /** Emit debug event */
  debug (tag: string, msg: string): void {
    this.emit("debug", `[${tag}] ${msg}`)
  }

  /**
   * This function is used for connect to discord.
   * @param token Your token. This is required.
   * @param intents Gateway intents in array. This is required.
   */
  connect (token?: string, intents?: GatewayIntents[]): void {
    if (token === undefined && this.token !== undefined) token = this.token
    else if (this.token === undefined && token !== undefined) {
      this.token = token
    } else throw new Error('No Token Provided')
    if (intents === undefined && this.intents !== undefined)
      intents = this.intents
    else if (intents !== undefined && this.intents === undefined) {
      this.intents = intents
    } else throw new Error('No Gateway Intents were provided')
    this.gateway = new Gateway(this, token, intents)
  }
}
