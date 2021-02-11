import { Collection } from '../utils/collection.ts'
import type { Client } from './client.ts'
import { RESTManager } from './rest.ts'
import { Gateway } from '../gateway/index.ts'
import { HarmonyEventEmitter } from '../utils/events.ts'
import { GatewayEvents } from '../types/gateway.ts'
import { delay } from '../utils/delay.ts'

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
  queueProcessing: boolean = false
  queue: CallableFunction[] = []

  get rest(): RESTManager {
    return this.client.rest
  }

  constructor(client: Client) {
    super()
    this.client = client
  }

  debug(msg: string): void {
    this.client.debug('Shards', msg)
  }

  enqueueIdentify(fn: CallableFunction): ShardManager {
    this.queue.push(fn)
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    if (!this.queueProcessing) this.processQueue()
    return this
  }

  private async processQueue(): Promise<void> {
    if (this.queueProcessing || this.queue.length === 0) return
    this.queueProcessing = true
    const item = this.queue[0]
    await item()
    this.queue.shift()
    await delay(5000)
    this.queueProcessing = false
    if (this.queue.length === 0) {
      this.queueProcessing = false
    } else {
      await this.processQueue()
    }
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

    this.debug(`Launching Shard: ${id}`)
    const shardCount = await this.getShardCount()

    const gw = new Gateway(this.client, [Number(id), shardCount])
    gw.token = this.client.token
    gw.intents = this.client.intents
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

  /** Launches all Shards */
  async connect(): Promise<ShardManager> {
    const shardCount = await this.getShardCount()
    this.client.shardCount = shardCount
    this.debug(`Launching ${shardCount} shard${shardCount === 1 ? '' : 's'}...`)
    const startTime = Date.now()
    for (let i = 0; i < shardCount; i++) {
      await this.launch(i)
    }
    const endTime = Date.now()
    const diff = endTime - startTime
    this.debug(
      `Launched ${shardCount} shards! Time taken: ${Math.floor(diff / 1000)}s`
    )
    return this
  }

  get(id: number): Gateway | undefined {
    return this.list.get(id.toString())
  }
}
