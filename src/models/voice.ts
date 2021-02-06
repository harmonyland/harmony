import { Guild } from '../structures/guild.ts'
import {
  VoiceChannel,
  VoiceServerData
} from '../structures/guildVoiceChannel.ts'
import { VoiceOpcodes } from '../types/voice.ts'
import { Collection } from '../utils/collection.ts'
import { HarmonyEventEmitter } from '../utils/events.ts'
import { Client } from './client.ts'

export interface VoiceOptions {
  channel: VoiceChannel
  data: VoiceServerData
  manager: VoiceConnectionsManager
}

export class VoiceConnectionsManager {
  client: Client
  connections: Collection<string, VoiceConnection> = new Collection()

  constructor(client: Client) {
    this.client = client
  }

  async establish(options: VoiceOptions): Promise<VoiceConnection> {
    if (this.connections.has(options.channel.guild.id) === true)
      throw new Error('Voice Connection already established')
    const conn = new VoiceConnection(this, options)
    this.connections.set(options.channel.guild.id, conn)
    await conn.connect()
    return conn
  }
}

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type VoiceConnectionEvents = {
  ready: []
}

/** Represents a Voice Connection made through a Voice Channel */
export class VoiceConnection extends HarmonyEventEmitter<VoiceConnectionEvents> {
  client: Client
  ws?: WebSocket
  guild: Guild
  channel: VoiceChannel
  data: VoiceServerData
  manager: VoiceConnectionsManager
  ssrc?: number
  ip?: string
  port?: number

  constructor(manager: VoiceConnectionsManager, options: VoiceOptions) {
    super()
    this.client = manager.client
    this.manager = manager
    this.channel = options.channel
    this.guild = options.channel.guild
    this.data = options.data
  }

  /** Connect to Voice Server */
  async connect(): Promise<VoiceConnection> {
    this.ws = new WebSocket(`wss://${this.data.endpoint}`)
    this.ws.binaryType = 'arraybuffer'
    this.ws.onopen = this.onopen.bind(this)
    this.ws.onclose = this.onclose.bind(this)
    this.ws.onmessage = this.onmessage.bind(this)
    this.ws.onerror = this.onerror.bind(this)
    return this
  }

  private send(data: { op: VoiceOpcodes; d: any }): void {
    this.ws?.send(JSON.stringify(data))
  }

  private sendIdentify(): void {
    this.send({
      op: VoiceOpcodes.IDENTIFY,
      d: {
        server_id: this.guild.id,
        user_id: this.client.user?.id,
        session_id: this.data.sessionID,
        token: this.data.token
      }
    })
  }

  private onopen(): void {
    this.sendIdentify()
  }

  private onclose(): void {}

  private onmessage(e: MessageEvent): void {
    const data = JSON.parse(e.data)
    if (typeof data !== 'object') return

    switch (data.op) {
      case VoiceOpcodes.READY:
        this.ssrc = data.d.ssrc
        this.ip = data.d.ip
        this.port = data.d.port
        this.emit('ready')
        break

      default:
        break
    }
  }

  private onerror(): void {}
}
