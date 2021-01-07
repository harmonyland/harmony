import { Collection } from '../utils/collection.ts'
import { Client, ClientOptions } from './client.ts'
import {EventEmitter} from '../../deps.ts'
import { RESTManager } from './rest.ts'
// import { GATEWAY_BOT } from '../types/endpoint.ts'
// import { GatewayBotPayload } from '../types/gatewayBot.ts'

// TODO(DjDeveloperr)
// I'm kinda confused; will continue on this later once
// Deno namespace in Web Worker is stable!
export interface ShardManagerOptions {
  client: Client | typeof Client
  token?: string
  intents?: number[]
  options?: ClientOptions
  shards: number
}

export interface ShardManagerInitOptions {
  file: string
  token?: string
  intents?: number[]
  options?: ClientOptions
  shards?: number
}

export class ShardManager extends EventEmitter {
  workers: Collection<string, Worker> = new Collection()
  token: string
  intents: number[]
  shardCount: number
  private readonly __client: Client

  get rest(): RESTManager {
    return this.__client.rest
  }

  constructor(options: ShardManagerOptions) {
    super()
    this.__client =
      options.client instanceof Client
        ? options.client
        : // eslint-disable-next-line new-cap
          new options.client(options.options)

    if (this.__client.token === undefined || options.token === undefined)
      throw new Error('Token should be provided when constructing ShardManager')
    if (this.__client.intents === undefined || options.intents === undefined)
      throw new Error(
        'Intents should be provided when constructing ShardManager'
      )

    this.token = this.__client.token ?? options.token
    this.intents = this.__client.intents ?? options.intents
    this.shardCount = options.shards
  }

  // static async init(): Promise<ShardManager> {}

  // async start(): Promise<ShardManager> {
  //   const info = ((await this.rest.get(
  //     GATEWAY_BOT()
  //   )) as unknown) as GatewayBotPayload

  //   const totalShards = this.__shardCount ?? info.shards

  //   return this
  // }
}
