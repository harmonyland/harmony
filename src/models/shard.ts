import { Collection } from '../utils/collection.ts'
import { Client } from './client.ts'
import { RESTManager } from './rest.ts'
import { Gateway } from '../gateway/index.ts'
import { HarmonyEventEmitter } from '../utils/events.ts'
import { GatewayEvents } from '../types/gateway.ts'

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type ShardManagerEvents = {
  launch: [number]
  shardReady: [number]
  shardDisconnect: [number, number | undefined, string | undefined]
  shardError: [number, Error, ErrorEvent]
  shardResume: [number]
}

export class ShardManager extends HarmonyEventEmitter<ShardManagerEvents> {
  list: Collection<string, Gateway> = new Collection()
  client: Client
  cachedShardCount?: number

  get rest(): RESTManager {
    return this.client.rest
  }

  constructor(client: Client) {
    super()
    this.client = client
  }

  async getShardCount(): Promise<number> {
    let shardCount: number
    if (this.cachedShardCount !== undefined) shardCount = this.cachedShardCount
    else {
      if (this.client.shardCount === 'auto') {
        const info = await this.client.rest.api.gateway.bot.get()
        shardCount = info.shards as number
      } else shardCount = this.client.shardCount ?? 1
    }
    this.cachedShardCount = shardCount
    return this.cachedShardCount
  }

  /** Launches a new Shard */
  async launch(id: number): Promise<ShardManager> {
    if (this.list.has(id.toString()) === true)
      throw new Error(`Shard ${id} already launched`)

    const shardCount = await this.getShardCount()

    const gw = new Gateway(this.client, [Number(id), shardCount])
    this.list.set(id.toString(), gw)
    gw.initWebsocket()
    this.emit('launch', id)

    gw.on(GatewayEvents.Ready, () => this.emit('shardReady', id))
    gw.on('error', (err: Error, evt: ErrorEvent) =>
      this.emit('shardError', id, err, evt)
    )
    gw.on(GatewayEvents.Resumed, () => this.emit('shardResume', id))
    gw.on('close', (code: number, reason: string) =>
      this.emit('shardDisconnect', id, code, reason)
    )

    return gw.waitFor(GatewayEvents.Ready, () => true).then(() => this)
  }

  async start(): Promise<ShardManager> {
    const shardCount = await this.getShardCount()
    for (let i = 0; i <= shardCount; i++) {
      await this.launch(i)
    }
    return this
  }
}
