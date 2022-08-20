import { unzlib } from '../../deps.ts'
import type { Client } from '../client/mod.ts'
import { GatewayResponse } from '../types/gatewayResponse.ts'
import {
  GatewayOpcodes,
  GatewayCloseCodes,
  IdentityPayload,
  StatusUpdatePayload,
  GatewayEvents
} from '../types/gateway.ts'
import { gatewayHandlers } from './handlers/mod.ts'
import { GatewayCache } from '../managers/gatewayCache.ts'
import { delay } from '../utils/delay.ts'
import type { VoiceChannel } from '../structures/guildVoiceChannel.ts'
import type { Guild } from '../structures/guild.ts'
import { HarmonyEventEmitter } from '../utils/events.ts'
import { decodeText } from '../utils/encoding.ts'
import { Constants } from '../types/constants.ts'

export interface RequestMembersOptions {
  limit?: number
  presences?: boolean
  query?: string
  users?: string[]
}

export interface VoiceStateOptions {
  mute?: boolean
  deaf?: boolean
}

export const RECONNECT_CODE = 3999
export const DESTROY_REASON = 'harmony-destroy'

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type GatewayTypedEvents = {
  [name in GatewayEvents]: [unknown]
} & {
  connect: []
  ping: [number]
  resume: []
  reconnectRequired: []
  close: [number, string]
  error: [Error, ErrorEvent]
  sentIdentify: []
  sentResume: []
  reconnecting: []
  guildsLoaded: []
  init: []
  hello: []
}

/**
 * Handles Discord Gateway connection.
 *
 * You should not use this and rather use Client class.
 */
export class Gateway extends HarmonyEventEmitter<GatewayTypedEvents> {
  websocket?: WebSocket
  connected = false
  initialized = false
  heartbeatInterval = 0
  heartbeatIntervalID?: number
  sequenceID?: number
  lastPingTimestamp = 0
  sessionID?: string
  private heartbeatServerResponded = false
  client!: Client
  cache: GatewayCache
  shards?: number[]
  ping: number = 0

  _readyReceived: Promise<void>
  _resolveReadyReceived?: () => void
  _guildsToBeLoaded?: number
  _guildsLoaded?: number
  _guildLoadTimeout?: number

  get shardID(): number {
    return this.shards?.[0] ?? 0
  }

  constructor(client: Client, shards?: number[]) {
    super()
    Object.defineProperty(this, 'client', { value: client, enumerable: false })
    this.cache = new GatewayCache(client)
    this.shards = shards
    this._readyReceived = new Promise((resolve) => {
      this._resolveReadyReceived = () => {
        this.debug('Resolving READY')
        this._resolveReadyReceived = undefined
        resolve()
      }
    })
  }

  private onopen(): void {
    this.connected = true
    this.debug('Connected to Gateway!')
    this.emit('connect')
  }

  private async onmessage(event: MessageEvent): Promise<void> {
    let data = event.data
    if (data instanceof ArrayBuffer) {
      data = new Uint8Array(data)
    }
    if (data instanceof Uint8Array) {
      data = unzlib(data, 0, (e: Uint8Array) => decodeText(e))
    }

    const { op, d, s, t }: GatewayResponse = JSON.parse(data)

    switch (op) {
      case GatewayOpcodes.HELLO:
        this.heartbeatInterval = d.heartbeat_interval
        this.debug(
          `Received HELLO. Heartbeat Interval: ${this.heartbeatInterval}`
        )

        this.sendHeartbeat()
        this.heartbeatIntervalID = setInterval(() => {
          this.heartbeat()
        }, this.heartbeatInterval)

        this.emit('hello')
        if (!this.initialized) {
          this.initialized = true
          this.enqueueIdentify(this.client.forceNewSession)
        } else {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          this.sendResume()
        }
        break

      case GatewayOpcodes.HEARTBEAT_ACK:
        this.heartbeatServerResponded = true
        this.ping = Date.now() - this.lastPingTimestamp
        this.emit('ping', this.ping)
        this.debug(`Received Heartbeat Ack. Ping Recognized: ${this.ping}ms`)
        break

      case GatewayOpcodes.INVALID_SESSION:
        // Because we know this gonna be bool
        this.debug(
          `Invalid Session received! Resumeable? ${d === true ? 'Yes' : 'No'}`
        )
        if (d !== true) {
          this.debug(`Session was invalidated, deleting from cache`)
          await this.cache.delete(`session_id_${this.shards?.join('-') ?? '0'}`)
          await this.cache.delete(`seq_${this.shards?.join('-') ?? '0'}`)
          this.sessionID = undefined
          this.sequenceID = undefined
        }
        this.enqueueIdentify(!(d as boolean))
        break

      case GatewayOpcodes.DISPATCH: {
        this.heartbeatServerResponded = true
        if (s !== null) {
          this.sequenceID = s
          await this.cache.set(`seq_${this.shards?.join('-') ?? '0'}`, s)
        }
        if (t !== null && t !== undefined) {
          this.emit(t as keyof GatewayTypedEvents, d)
          this.client.emit('raw', t, d, this.shardID)

          const handler = gatewayHandlers[t]

          if (handler !== undefined && d !== null) {
            try {
              await handler(this, d)
            } catch (e) {
              this.client.emit('error', e as Error)
            }
          }
        }
        break
      }
      case GatewayOpcodes.RESUME: {
        // this.token = d.token
        this.sessionID = d.session_id
        this.sequenceID = d.seq
        await this.cache.set(`seq_${this.shards?.join('-') ?? '0'}`, d.seq)
        await this.cache.set(
          `session_id_${this.shards?.join('-') ?? '0'}`,
          this.sessionID
        )
        this.emit('resume')
        break
      }
      case GatewayOpcodes.RECONNECT: {
        this.emit('reconnectRequired')
        this.debug(`Received OpCode RECONNECT`)
        await this.reconnect(true)
        break
      }
      default:
        break
    }
  }

  _checkGuildsLoaded(timeout = true): void {
    if (
      this._guildsLoaded !== undefined &&
      this._guildsToBeLoaded !== undefined
    ) {
      if (this._guildLoadTimeout !== undefined) {
        clearTimeout(this._guildLoadTimeout)
        this._guildLoadTimeout = undefined
      }
      if (this._guildsLoaded >= this._guildsToBeLoaded) {
        this.debug('Guilds arrived!')
        this.emit('guildsLoaded')
        this._guildsLoaded = undefined
        this._guildsToBeLoaded = undefined
      } else if (timeout) {
        this._guildLoadTimeout = setTimeout(() => {
          this._guildLoadTimeout = undefined
          this.debug(
            `Guild Load Timout, ${
              this._guildsToBeLoaded! - this._guildsLoaded!
            } guilds unavailable`
          )
          this.emit('guildsLoaded')
          this._guildsLoaded = undefined
          this._guildsToBeLoaded = undefined
        }, 15000)
      }
    }
  }

  private async onclose({ reason, code }: CloseEvent): Promise<void> {
    // Likely an async close event from previous websocket object
    // after we reconnect.
    if (!this.connected) return

    this.connected = false
    if (this.destroyed) return
    if (this.#destroyCalled) {
      this.#destroyComplete = true
      this.debug(`Shard destroyed`)
      return
    }

    this.emit('close', code, reason)
    this.debug(`Connection Closed with code: ${code} ${reason}`)

    switch (code) {
      case RECONNECT_CODE:
        return
      case GatewayCloseCodes.UNKNOWN_ERROR:
        this.debug('API has encountered Unknown Error. Reconnecting...')
        await this.reconnect()
        break
      case GatewayCloseCodes.UNKNOWN_OPCODE:
        throw new Error(
          "Invalid OP Code or Payload was sent. This shouldn't happen!"
        )
      case GatewayCloseCodes.DECODE_ERROR:
        throw new Error("Invalid Payload was sent. This shouldn't happen!")
      case GatewayCloseCodes.NOT_AUTHENTICATED:
        throw new Error('Not Authorized: Payload was sent before Identifying.')
      case GatewayCloseCodes.AUTHENTICATION_FAILED:
        throw new Error('Invalid Token provided!')
      case GatewayCloseCodes.INVALID_SEQ:
        this.debug('Invalid Seq was sent. Reconnecting.')
        await this.reconnect()
        break
      case GatewayCloseCodes.RATE_LIMITED:
        throw new Error("You're ratelimited. Calm down.")
      case GatewayCloseCodes.SESSION_TIMED_OUT:
        this.debug('Session Timeout. Reconnecting.')
        await this.reconnect(true)
        break
      case GatewayCloseCodes.INVALID_SHARD:
        this.debug('Invalid Shard was sent. Reconnecting.')
        await this.reconnect()
        break
      case GatewayCloseCodes.SHARDING_REQUIRED:
        throw new Error("Couldn't connect. Sharding is required!")
      case GatewayCloseCodes.INVALID_API_VERSION:
        throw new Error("Invalid API Version was used. This shouldn't happen!")
      case GatewayCloseCodes.INVALID_INTENTS:
        throw new Error('Invalid Intents')
      case GatewayCloseCodes.DISALLOWED_INTENTS:
        throw new Error("Given Intents aren't allowed")
      default:
        this.debug(
          'Unknown Close code, probably connection error. Reconnecting in 5s.'
        )

        await delay(5000)
        await this.reconnect(true)
        break
    }
  }

  private async onerror(event: ErrorEvent): Promise<void> {
    const error = new Error(
      Deno.inspect({
        message: event.message,
        error: event.error,
        type: event.type,
        target: event.target
      })
    )
    error.name = 'ErrorEvent'
    // Do not log errors by default
    // console.error(error)
    this.emit('error', error, event)
    this.client.emit('gatewayError', event, this.shards)
  }

  private enqueueIdentify(forceNew?: boolean): void {
    this.client.shards.enqueueIdentify(
      async () =>
        await this.sendIdentify(forceNew).then(() =>
          this.waitFor(GatewayEvents.Ready)
        )
    )
  }

  private async sendIdentify(forceNewSession?: boolean): Promise<void> {
    if (typeof this.client.token !== 'string')
      throw new Error('Token not specified')
    if (typeof this.client.intents !== 'object')
      throw new Error('Intents not specified')

    if (forceNewSession === undefined || !forceNewSession) {
      const sessionIDCached = await this.cache.get(
        `session_id_${this.shards?.join('-') ?? '0'}`
      )
      if (typeof sessionIDCached === 'string') {
        this.debug(`Found Cached SessionID: ${sessionIDCached}`)
        this.sessionID = sessionIDCached
        return await this.sendResume()
      }
    }

    const payload: IdentityPayload = {
      token: this.client.token,
      properties: {
        $os: this.client.clientProperties.os ?? Deno.build.os,
        $browser: this.client.clientProperties.browser ?? 'harmony',
        $device: this.client.clientProperties.device ?? 'harmony'
      },
      compress: this.client.compress,
      shard:
        this.shards === undefined
          ? [0, 1]
          : [this.shards[0] ?? 0, this.shards[1] ?? 1],
      intents: this.client.intents.reduce(
        (previous, current) => previous | current,
        0
      ),
      presence: this.client.presence.create()
    }

    this.debug('Sending Identify payload...')
    this.emit('sentIdentify')
    this.send({
      op: GatewayOpcodes.IDENTIFY,
      d: payload
    })
  }

  private async sendResume(): Promise<void> {
    if (typeof this.client.token !== 'string')
      throw new Error('Token not specified')

    if (this.sessionID === undefined) {
      this.sessionID = await this.cache.get(
        `session_id_${this.shards?.join('-') ?? '0'}`
      )
      if (this.sessionID === undefined) return this.enqueueIdentify()
    }
    this.debug(`Preparing to resume with Session: ${this.sessionID}`)
    if (this.sequenceID === undefined) {
      const cached = await this.cache.get(
        `seq_${this.shards?.join('-') ?? '0'}`
      )
      if (cached !== undefined)
        this.sequenceID =
          typeof cached === 'string' ? parseInt(cached) : (cached as number)
    }
    const resumePayload = {
      op: GatewayOpcodes.RESUME,
      d: {
        token: this.client.token,
        session_id: this.sessionID,
        seq: this.sequenceID ?? null
      }
    }
    this.emit('sentResume')
    this.debug('Sending Resume payload...')
    this.send(resumePayload)
  }

  requestMembers(guild: string, options: RequestMembersOptions = {}): string {
    if (options.query !== undefined && options.limit === undefined)
      throw new Error(
        'Missing limit property when specifying query for Requesting Members!'
      )
    const nonce = crypto.randomUUID()
    this.send({
      op: GatewayOpcodes.REQUEST_GUILD_MEMBERS,
      d: {
        guild_id: guild,
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        query: options.users?.length ? undefined : options.query ?? '',
        limit: options.limit ?? 0,
        presences: options.presences,
        user_ids: options.users,
        nonce
      }
    })
    return nonce
  }

  updateVoiceState(
    guild: Guild | string,
    channel?: VoiceChannel | string,
    voiceOptions: VoiceStateOptions = {}
  ): void {
    this.send({
      op: GatewayOpcodes.VOICE_STATE_UPDATE,
      d: {
        guild_id: typeof guild === 'string' ? guild : guild.id,
        channel_id:
          channel === undefined
            ? null
            : typeof channel === 'string'
            ? channel
            : channel?.id,
        self_mute:
          channel === undefined
            ? false
            : voiceOptions.mute === undefined
            ? false
            : voiceOptions.mute,
        self_deaf:
          channel === undefined
            ? false
            : voiceOptions.deaf === undefined
            ? false
            : voiceOptions.deaf
      }
    })
  }

  debug(msg: string): void {
    this.client.debug(`Shard ${this.shardID}`, msg)
  }

  async reconnect(forceNew?: boolean): Promise<void> {
    if (this.#destroyCalled) return

    this.emit('reconnecting')
    this.debug('Reconnecting... (force new: ' + String(forceNew) + ')')

    clearInterval(this.heartbeatIntervalID)
    if (forceNew === true) {
      await this.cache.delete(`session_id_${this.shards?.join('-') ?? '0'}`)
      await this.cache.delete(`seq_${this.shards?.join('-') ?? '0'}`)
    }

    this.closeGateway(3999)
    this.initWebsocket()
  }

  initWebsocket(): void {
    if (this.#destroyCalled) return

    this.emit('init')
    this.debug('Initializing WebSocket...')
    this.websocket = new WebSocket(
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      `${Constants.DISCORD_GATEWAY_URL}/?v=${Constants.DISCORD_API_VERSION}&encoding=json`,
      []
    )
    this.websocket.binaryType = 'arraybuffer'
    this.websocket.onopen = this.onopen.bind(this)
    this.websocket.onmessage = this.onmessage.bind(this)
    this.websocket.onclose = this.onclose.bind(this)
    this.websocket.onerror = this.onerror.bind(
      this
    ) as unknown as WebSocket['onerror']
  }

  closeGateway(code: number = 1000, reason?: string): void {
    this.debug(
      `Closing with code ${code}${
        reason !== undefined && reason !== '' ? ` and reason ${reason}` : ''
      }`
    )
    return this.websocket?.close(code, reason)
  }

  // Alias for backward compat, since event@2.0.0 removed close again...
  close(code?: number, reason?: string): void {
    this.closeGateway(code, reason)
  }

  #destroyCalled = false
  #destroyComplete = false

  get destroyed(): boolean {
    return this.#destroyCalled && this.#destroyComplete
  }

  destroy(): void {
    this.debug('Destroying Shard')
    this.#destroyCalled = true

    if (this.heartbeatIntervalID !== undefined) {
      clearInterval(this.heartbeatIntervalID)
      this.heartbeatIntervalID = undefined
    }
    this.closeGateway(1000, DESTROY_REASON)
  }

  send(data: GatewayResponse): boolean {
    if (this.websocket?.readyState !== this.websocket?.OPEN) return false
    const packet = JSON.stringify({
      op: data.op,
      d: data.d,
      s: typeof data.s === 'number' ? data.s : null,
      t: data.t === undefined ? null : data.t
    })
    this.websocket?.send(packet)
    return true
  }

  sendPresence(data: StatusUpdatePayload): void {
    this.send({
      op: GatewayOpcodes.PRESENCE_UPDATE,
      d: data
    })
  }

  sendHeartbeat(): void {
    const payload = {
      op: GatewayOpcodes.HEARTBEAT,
      d: this.sequenceID ?? null
    }

    this.send(payload)
    this.lastPingTimestamp = Date.now()
  }

  heartbeat(): void {
    if (this.destroyed) return

    if (this.heartbeatServerResponded) {
      this.heartbeatServerResponded = false
    } else {
      this.debug('Found dead connection, reconnecting...')
      clearInterval(this.heartbeatIntervalID)
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.reconnect(false)
      return
    }

    this.sendHeartbeat()
  }
}

// There's a lot of not assignable errors and all when using unknown,
// so I'll stick with any here.
export type GatewayEventHandler = (gateway: Gateway, d: any) => void
