import { User } from '../structures/user.ts'
import { GatewayIntents } from '../types/gatewayTypes.ts'
import { Gateway } from '../gateway/index.ts'
import { RESTManager } from './rest.ts'
import EventEmitter from 'https://deno.land/std@0.74.0/node/events.ts'
import { DefaultCacheAdapter, ICacheAdapter } from "./CacheAdapter.ts"
import { UserManager } from "../managers/UsersManager.ts"
import { GuildManager } from "../managers/GuildsManager.ts"
import { EmojisManager } from "../managers/EmojisManager.ts"
import { ChannelsManager } from "../managers/ChannelsManager.ts"

/** Some Client Options to modify behaviour */
export interface ClientOptions {
  token?: string
  intents?: GatewayIntents[]
  cache?: ICacheAdapter
}

/**
 * Discord Client.
 */
export class Client extends EventEmitter {
  gateway?: Gateway
  rest: RESTManager = new RESTManager(this)
  user?: User
  ping = 0
  token?: string
  cache: ICacheAdapter = new DefaultCacheAdapter(this)
  intents?: GatewayIntents[]
  users: UserManager = new UserManager(this)
  guilds: GuildManager = new GuildManager(this)
  channels: ChannelsManager = new ChannelsManager(this)
  emojis: EmojisManager = new EmojisManager(this)

  constructor (options: ClientOptions = {}) {
    super()
    this.token = options.token
    this.intents = options.intents
    if(options.cache) this.cache = options.cache
  }

  debug(tag: string, msg: string) {
    this.emit("debug", `[${tag}] ${msg}`)
  }

  /**
   * This function is used for connect to discord.
   * @param token Your token. This is required.
   * @param intents Gateway intents in array. This is required.
   */
  connect (token?: string, intents?: GatewayIntents[]): void {
    if(!token && this.token) token = this.token
    else if(!this.token && token) {
      this.token = token
    }
    else throw new Error("No Token Provided")
    if(!intents && this.intents) intents = this.intents
    else if(intents && !this.intents) {
      this.intents = intents
    }
    else throw new Error("No Gateway Intents were provided")
    this.gateway = new Gateway(this, token, intents)
  }
}
