/* eslint-disable @typescript-eslint/method-signature-style */
import type { User } from '../structures/user.ts'
import { GatewayIntents } from '../types/gateway.ts'
import { Gateway } from '../gateway/mod.ts'
import { RESTManager, RESTOptions, TokenType } from '../rest/mod.ts'
import { DefaultCacheAdapter, ICacheAdapter } from '../cache/mod.ts'
import { UsersManager } from '../managers/users.ts'
import { GuildManager } from '../managers/guilds.ts'
import { ChannelsManager } from '../managers/channels.ts'
import { ClientPresence } from '../structures/presence.ts'
import { EmojisManager } from '../managers/emojis.ts'
import { ActivityGame, ClientActivity } from '../types/presence.ts'
import type { Extension } from '../commands/extension.ts'
import { InteractionsClient } from '../interactions/client.ts'
import { ShardManager } from './shard.ts'
import { Application } from '../structures/application.ts'
import { Invite } from '../structures/invite.ts'
import { INVITE } from '../types/endpoint.ts'
import type { ClientEvents } from '../gateway/handlers/mod.ts'
import type { Collector } from './collectors.ts'
import { HarmonyEventEmitter } from '../utils/events.ts'
import type { VoiceRegion } from '../types/voice.ts'
import { fetchAuto } from '../../deps.ts'
import type { DMChannel } from '../structures/dmChannel.ts'
import { Template } from '../structures/template.ts'
import { VoiceManager } from './voice.ts'
import { StickersManager } from '../managers/stickers.ts'
import { createOAuthURL, OAuthURLOptions } from '../utils/oauthURL.ts'
import type { AllowedMentionsPayload } from '../types/channel.ts'

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
  intents?: Array<GatewayIntents | keyof typeof GatewayIntents>
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
  /** Disable taking token from env if not provided (token is taken from env if present by default) */
  disableEnvToken?: boolean
  /** Override REST Options */
  restOptions?: RESTOptions
  /** Whether to fetch Gateway info or not */
  fetchGatewayInfo?: boolean
  /** ADVANCED: Shard ID to launch on */
  shard?: number
  /** ADVANCED: Shard count. */
  shardCount?: number | 'auto'
  /** Whether to enable Zlib Compression (for Gateway) or not (enabled by default) */
  compress?: boolean
  /** Max number of messages to cache per channel. Default 100 */
  messageCacheMax?: number
  /** Default Allowed Mentions */
  defaultAllowedMentions?: AllowedMentionsPayload
}

/**
 * Harmony Client. Provides high-level interface over the REST and WebSocket API.
 */
export class Client extends HarmonyEventEmitter<ClientEvents> {
  /** REST Manager - used to make all requests */
  rest: RESTManager
  /** User which Client logs in to, undefined until logs in */
  user?: User

  #token?: string

  /** Token of the Bot/User */
  get token(): string | undefined {
    return this.#token
  }

  set token(val: string | undefined) {
    this.#token = val
  }

  /** Cache Adapter */
  get cache(): ICacheAdapter {
    return this.#cache
  }

  set cache(val: ICacheAdapter) {
    this.#cache = val
  }

  #cache: ICacheAdapter = new DefaultCacheAdapter()

  /** Gateway Intents */
  intents?: GatewayIntents[]
  /** Whether to force new session or not */
  forceNewSession?: boolean
  /** Time till messages to stay cached, in MS. */
  messageCacheLifetime: number = 3600000
  /** Max number of messages to cache per channel. Default 100 */
  messageCacheMax: number = 100
  /** Time till messages to stay cached, in MS. */
  reactionCacheLifetime: number = 3600000
  /** Whether to fetch Uncached Message of Reaction or not? */
  fetchUncachedReactions: boolean = false

  /** Client Properties */
  readonly clientProperties!: ClientProperties
  /** Default mention settings */
  defaultAllowedMentions: AllowedMentionsPayload = {}

  /** Interactions Client */
  interactions: InteractionsClient
  /** @deprecated Alias to Interactions client in `client.interactions`, use original property instead */
  slash: InteractionsClient
  /** Whether to fetch Gateway info or not */
  fetchGatewayInfo: boolean = true

  /** Voice Connections Manager */
  readonly voice = new VoiceManager(this)

  /** Users Manager, containing all Users cached */
  readonly users: UsersManager = new UsersManager(this)
  /** Guilds Manager, providing cache & API interface to Guilds */
  readonly guilds: GuildManager = new GuildManager(this)
  /** Channels Manager, providing cache interface to Channels */
  readonly channels: ChannelsManager = new ChannelsManager(this)
  /** Channels Manager, providing cache interface to Channels */
  readonly emojis: EmojisManager = new EmojisManager(this)
  /** Stickers Manager, providing cache interface to (Guild) Stickers and API interfacing */
  readonly stickers: StickersManager = new StickersManager(this)

  /** Last READY timestamp */
  upSince?: Date

  /** Client's presence. Startup one if set before connecting */
  presence: ClientPresence = new ClientPresence()

  _id?: string

  /** Shard on which this Client is */
  shard?: number
  /** Shard Count */
  shardCount: number | 'auto' = 'auto'
  /** Shard Manager of this Client if Sharded */
  shards: ShardManager
  /** Collectors set */
  collectors: Set<Collector> = new Set()

  /** Whether Zlib compression (for Gateway) is enabled or not */
  compress = true

  /** Since when is Client online (ready). */
  get uptime(): number {
    if (this.upSince === undefined) return 0
    else {
      const dif = Date.now() - this.upSince.getTime()
      if (dif < 0) return 0
      else return dif
    }
  }

  /** Get Shard 0's Gateway */
  get gateway(): Gateway {
    return this.shards.list.get('0')!
  }

  applicationID?: string
  applicationFlags?: number

  constructor(options: ClientOptions = {}) {
    super()
    this._id = options.id
    this.token = options.token
    this.intents = options.intents?.map((e) =>
      typeof e === 'string' ? GatewayIntents[e] : e
    )
    this.shards = new ShardManager(this)
    this.forceNewSession = options.forceNewSession
    if (options.cache !== undefined) this.cache = options.cache
    if (options.presence !== undefined) {
      this.presence =
        options.presence instanceof ClientPresence
          ? options.presence
          : new ClientPresence(options.presence)
    }
    if (options.messageCacheLifetime !== undefined) {
      this.messageCacheLifetime = options.messageCacheLifetime
    }
    if (options.reactionCacheLifetime !== undefined) {
      this.reactionCacheLifetime = options.reactionCacheLifetime
    }
    if (options.fetchUncachedReactions === true) {
      this.fetchUncachedReactions = true
    }
    if (options.messageCacheMax !== undefined) {
      this.messageCacheMax = options.messageCacheMax
    }
    if (options.compress !== undefined) this.compress = options.compress

    if (
      (this as any)._decoratedEvents !== undefined &&
      Object.keys((this as any)._decoratedEvents).length !== 0
    ) {
      Object.entries((this as any)._decoratedEvents).forEach((entry) => {
        this.on(entry[0] as keyof ClientEvents, (entry as any)[1].bind(this))
      })
      ;(this as any)._decoratedEvents = undefined
    }

    Object.defineProperty(this, 'clientProperties', {
      value:
        options.clientProperties === undefined
          ? {
              os: Deno.build.os,
              browser: 'harmony',
              device: 'harmony'
            }
          : options.clientProperties,
      enumerable: false
    })

    if (options.shard !== undefined) this.shard = options.shard
    if (options.shardCount !== undefined) this.shardCount = options.shardCount

    this.fetchGatewayInfo = options.fetchGatewayInfo ?? true

    if (this.token === undefined) {
      try {
        const token = Deno.env.get('DISCORD_TOKEN')
        if (token !== undefined) {
          this.token = token
          this.debug('Info', 'Found token in ENV')
        }
      } catch (e) {}
    }

    const restOptions: RESTOptions = {
      token: () => this.token,
      tokenType: TokenType.Bot,
      canary: options.canary,
      client: this
    }

    if (options.restOptions !== undefined) {
      Object.assign(restOptions, options.restOptions)
    }
    this.rest = new RESTManager(restOptions)

    this.slash = this.interactions = new InteractionsClient({
      id: () => this.getEstimatedID(),
      client: this,
      enabled: options.enableSlash
    })

    this.defaultAllowedMentions = options.defaultAllowedMentions ?? {}
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
  setPresence(
    presence: ClientPresence | ClientActivity | ActivityGame,
    onlyInShards: number[] = []
  ): void {
    if (presence instanceof ClientPresence) {
      this.presence = presence
    } else this.presence = new ClientPresence(presence)
    this.shards.list.forEach((shard) => {
      if (onlyInShards.length !== 0 && onlyInShards.includes(shard.shardID)) {
        return
      }
      shard.sendPresence(this.presence.create())
    })
  }

  /** Emits debug event */
  debug(tag: string, msg: string): void {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
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
   * @param token Your token. This is required if not given in ClientOptions.
   * @param intents Gateway intents in array. This is required if not given in ClientOptions.
   */
  async connect(
    token?: string,
    intents?: Array<GatewayIntents | keyof typeof GatewayIntents>
  ): Promise<Client> {
    const readyPromise = this.waitFor('ready', () => true)
    await this.guilds.flush()
    token ??= this.token
    if (token === undefined) throw new Error('No Token Provided')
    this.token = token
    if (intents !== undefined && this.intents !== undefined) {
      this.debug(
        'client',
        'Intents were set in both client and connect function. Using the one in the connect function...'
      )
    } else if (intents === undefined && this.intents !== undefined) {
      intents = this.intents
    } else if (intents !== undefined && this.intents === undefined) {
      this.intents = intents.map((e) =>
        typeof e === 'string' ? GatewayIntents[e] : e
      )
    } else throw new Error('No Gateway Intents were provided')

    this.rest.token = token
    if (this.shard !== undefined) {
      if (typeof this.shardCount === 'number') {
        this.shards.cachedShardCount = this.shardCount
      }
      await this.shards.launch(this.shard)
    } else await this.shards.connect()
    await readyPromise
    return this
  }

  /** Destroy the Gateway connection */
  async destroy(): Promise<Client> {
    this.gateway.initialized = false
    this.gateway.sequenceID = undefined
    this.gateway.sessionID = undefined
    await this.gateway.cache.delete('seq')
    await this.gateway.cache.delete('session_id')
    this.shards.destroy()
    this.user = undefined
    this.upSince = undefined
    return this
  }

  /** Attempt to Close current Gateway connection and Resume */
  async reconnect(): Promise<Client> {
    this.gateway.closeGateway()
    this.gateway.initWebsocket()
    return this.waitFor('ready', () => true).then(() => this)
  }

  /** Add a new Collector */
  addCollector(collector: Collector): boolean {
    if (this.collectors.has(collector)) return false
    else {
      this.collectors.add(collector)
      return true
    }
  }

  /** Remove a Collector */
  removeCollector(collector: Collector): boolean {
    if (!this.collectors.has(collector)) return false
    else {
      this.collectors.delete(collector)
      return true
    }
  }

  async emit(event: keyof ClientEvents, ...args: any[]): Promise<void> {
    const collectors: Array<Collector<unknown[]>> = []
    for (const collector of this.collectors.values()) {
      if (collector.event === event) collectors.push(collector)
    }
    if (collectors.length !== 0) {
      collectors.forEach((collector) => collector._fire(...args))
    }
    // TODO(DjDeveloperr): Fix this ts-ignore
    // eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error
    // @ts-ignore
    return super.emit(event, ...args)
  }

  /** Returns an array of voice region objects that can be used when creating servers. */
  async fetchVoiceRegions(): Promise<VoiceRegion[]> {
    return this.rest.api.voice.regions.get()
  }

  /** Modify current (Client) User. */
  async editUser(data: {
    username?: string
    avatar?: string
  }): Promise<Client> {
    if (data.username === undefined && data.avatar === undefined) {
      throw new Error(
        'Either username or avatar or both must be specified to edit'
      )
    }

    if (data.avatar?.startsWith('http') === true) {
      data.avatar = await fetchAuto(data.avatar)
    }

    await this.rest.api.users['@me'].patch({
      username: data.username,
      avatar: data.avatar
    })
    return this
  }

  /** Change Username of the Client User */
  async setUsername(username: string): Promise<Client> {
    return await this.editUser({ username })
  }

  /** Change Avatar of the Client User */
  async setAvatar(avatar: string): Promise<Client> {
    return await this.editUser({ avatar })
  }

  /** Create a DM Channel with a User */
  async createDM(user: User | string): Promise<DMChannel> {
    const id = typeof user === 'object' ? user.id : user
    const dmPayload = await this.rest.api.users['@me'].channels.post({
      recipient_id: id
    })
    await this.channels.set(dmPayload.id, dmPayload)
    return this.channels.get<DMChannel>(dmPayload.id) as unknown as DMChannel
  }

  /** Returns a template object for the given code. */
  async fetchTemplate(code: string): Promise<Template> {
    const payload = await this.rest.api.guilds.templates[code].get()
    return new Template(this, payload)
  }

  /** Creates an OAuth2 URL */
  createOAuthURL(options: Omit<OAuthURLOptions, 'clientID'>): string {
    return createOAuthURL(
      Object.assign(
        {
          clientID: this.getEstimatedID()
        },
        options
      )
    )
  }
}

/** Event decorator to create an Event handler from function */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function event(name?: keyof ClientEvents) {
  return function (
    client: Client | Extension,
    prop: keyof ClientEvents | string
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const c = client as any
    const listener = (
      client as unknown as {
        [name in keyof ClientEvents]: (...args: ClientEvents[name]) => any
      }
    )[prop as unknown as keyof ClientEvents]
    if (typeof listener !== 'function') {
      throw new Error('@event decorator requires a function')
    }

    if (c._decoratedEvents === undefined) c._decoratedEvents = {}
    const key = name === undefined ? prop : name

    c._decoratedEvents[key] = listener
  }
}
