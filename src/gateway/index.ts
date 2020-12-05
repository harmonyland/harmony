import { unzlib } from 'https://deno.land/x/denoflate@1.1/mod.ts'
import { Client } from '../models/client.ts'
import {
  DISCORD_GATEWAY_URL,
  DISCORD_API_VERSION
} from '../consts/urlsAndVersions.ts'
import { GatewayResponse } from '../types/gatewayResponse.ts'
import {
  GatewayOpcodes,
  GatewayIntents,
  GatewayCloseCodes,
  IdentityPayload,
  StatusUpdatePayload
} from '../types/gateway.ts'
import { gatewayHandlers } from './handlers/index.ts'
import { GATEWAY_BOT } from '../types/endpoint.ts'
import { GatewayCache } from '../managers/gatewayCache.ts'
import { delay } from '../utils/delay.ts'
import { VoiceChannel } from '../structures/guildVoiceChannel.ts'
import { Guild } from '../structures/guild.ts'

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

export const RECONNECT_REASON = 'harmony-reconnect'

/**
 * Handles Discord gateway connection.
 *
 * You should not use this and rather use Client class.
 */
class Gateway {
  websocket: WebSocket
  token: string
  intents: GatewayIntents[]
  connected = false
  initialized = false
  heartbeatInterval = 0
  heartbeatIntervalID?: number
  sequenceID?: number
  lastPingTimestamp = 0
  sessionID?: string
  private heartbeatServerResponded = false
  client: Client
  cache: GatewayCache
  private timedIdentify: number | null = null

  constructor(client: Client, token: string, intents: GatewayIntents[]) {
    this.token = token
    this.intents = intents
    this.client = client
    this.cache = new GatewayCache(client)
    this.websocket = new WebSocket(
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      `${DISCORD_GATEWAY_URL}/?v=${DISCORD_API_VERSION}&encoding=json`,
      []
    )
    this.websocket.binaryType = 'arraybuffer'
    this.websocket.onopen = this.onopen.bind(this)
    this.websocket.onmessage = this.onmessage.bind(this)
    this.websocket.onclose = this.onclose.bind(this)
    this.websocket.onerror = this.onerror.bind(this)
  }

  private onopen(): void {
    this.connected = true
    this.debug('Connected to Gateway!')
  }

  private async onmessage(event: MessageEvent): Promise<void> {
    let data = event.data
    if (data instanceof ArrayBuffer) {
      data = new Uint8Array(data)
    }
    if (data instanceof Uint8Array) {
      data = unzlib(data)
      data = new TextDecoder('utf-8').decode(data)
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

        if (!this.initialized) {
          this.initialized = true
          await this.sendIdentify(this.client.forceNewSession)
        } else {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          this.sendResume()
        }
        break

      case GatewayOpcodes.HEARTBEAT_ACK:
        this.heartbeatServerResponded = true
        this.client.ping = Date.now() - this.lastPingTimestamp
        this.debug(
          `Received Heartbeat Ack. Ping Recognized: ${this.client.ping}ms`
        )
        break

      case GatewayOpcodes.INVALID_SESSION:
        // Because we know this gonna be bool
        this.debug(
          `Invalid Session received! Resumeable? ${d === true ? 'Yes' : 'No'}`
        )
        if (d !== true) {
          this.debug(`Session was invalidated, deleting from cache`)
          await this.cache.delete('session_id')
          await this.cache.delete('seq')
          this.sessionID = undefined
          this.sequenceID = undefined
        }
        this.timedIdentify = setTimeout(async () => {
          this.timedIdentify = null
          await this.sendIdentify(!(d as boolean))
        }, 5000)
        break

      case GatewayOpcodes.DISPATCH: {
        this.heartbeatServerResponded = true
        if (s !== null) {
          this.sequenceID = s
          await this.cache.set('seq', s)
        }
        if (t !== null && t !== undefined) {
          this.client.emit('raw', t, d)

          const handler = gatewayHandlers[t]

          if (handler !== undefined) {
            handler(this, d)
          }
        }
        break
      }
      case GatewayOpcodes.RESUME: {
        // this.token = d.token
        this.sessionID = d.session_id
        this.sequenceID = d.seq
        await this.cache.set('seq', d.seq)
        await this.cache.set('session_id', this.sessionID)
        break
      }
      case GatewayOpcodes.RECONNECT: {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.reconnect()
        break
      }
      default:
        break
    }
  }

  private async onclose(event: CloseEvent): Promise<void> {
    if (event.reason === RECONNECT_REASON) return
    this.debug(`Connection Closed with code: ${event.code}`)

    if (event.code === GatewayCloseCodes.UNKNOWN_ERROR) {
      this.debug('API has encountered Unknown Error. Reconnecting...')
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.reconnect()
    } else if (event.code === GatewayCloseCodes.UNKNOWN_OPCODE) {
      throw new Error("Unknown OP Code was sent. This shouldn't happen!")
    } else if (event.code === GatewayCloseCodes.DECODE_ERROR) {
      throw new Error("Invalid Payload was sent. This shouldn't happen!")
    } else if (event.code === GatewayCloseCodes.NOT_AUTHENTICATED) {
      throw new Error('Not Authorized: Payload was sent before Identifying.')
    } else if (event.code === GatewayCloseCodes.AUTHENTICATION_FAILED) {
      throw new Error('Invalid Token provided!')
    } else if (event.code === GatewayCloseCodes.INVALID_SEQ) {
      this.debug('Invalid Seq was sent. Reconnecting.')
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.reconnect()
    } else if (event.code === GatewayCloseCodes.RATE_LIMITED) {
      throw new Error("You're ratelimited. Calm down.")
    } else if (event.code === GatewayCloseCodes.SESSION_TIMED_OUT) {
      this.debug('Session Timeout. Reconnecting.')
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.reconnect(true)
    } else if (event.code === GatewayCloseCodes.INVALID_SHARD) {
      this.debug('Invalid Shard was sent. Reconnecting.')
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.reconnect()
    } else if (event.code === GatewayCloseCodes.SHARDING_REQUIRED) {
      throw new Error("Couldn't connect. Sharding is required!")
    } else if (event.code === GatewayCloseCodes.INVALID_API_VERSION) {
      throw new Error("Invalid API Version was used. This shouldn't happen!")
    } else if (event.code === GatewayCloseCodes.INVALID_INTENTS) {
      throw new Error('Invalid Intents')
    } else if (event.code === GatewayCloseCodes.DISALLOWED_INTENTS) {
      throw new Error("Given Intents aren't allowed")
    } else {
      this.debug(
        'Unknown Close code, probably connection error. Reconnecting in 5s.'
      )
      if (this.timedIdentify !== null) {
        clearTimeout(this.timedIdentify)
        this.debug('Timed Identify found. Cleared timeout.')
      }
      await delay(5000)
      await this.reconnect(true)
    }
  }

  private onerror(event: Event | ErrorEvent): void {
    const eventError = event as ErrorEvent
    console.log(eventError)
  }

  private async sendIdentify(forceNewSession?: boolean): Promise<void> {
    this.debug('Fetching /gateway/bot...')
    const info = await this.client.rest.get(GATEWAY_BOT())
    if (info.session_start_limit.remaining === 0)
      throw new Error(
        `Session Limit Reached. Retry After ${info.session_start_limit.reset_after}ms`
      )
    this.debug(`Recommended Shards: ${info.shards}`)
    this.debug('=== Session Limit Info ===')
    this.debug(
      `Remaining: ${info.session_start_limit.remaining}/${info.session_start_limit.total}`
    )
    this.debug(`Reset After: ${info.session_start_limit.reset_after}ms`)

    if (forceNewSession === undefined || !forceNewSession) {
      const sessionIDCached = await this.cache.get('session_id')
      if (sessionIDCached !== undefined) {
        this.debug(`Found Cached SessionID: ${sessionIDCached}`)
        this.sessionID = sessionIDCached
        return await this.sendResume()
      }
    }

    const payload: IdentityPayload = {
      token: this.token,
      properties: {
        $os: Deno.build.os,
        $browser: 'harmony',
        $device: 'harmony'
      },
      compress: true,
      shard: [0, 1], // TODO: Make sharding possible
      intents: this.intents.reduce(
        (previous, current) => previous | current,
        0
      ),
      presence: this.client.presence.create()
    }

    this.debug('Sending Identify payload...')
    this.send({
      op: GatewayOpcodes.IDENTIFY,
      d: payload
    })
  }

  private async sendResume(): Promise<void> {
    if (this.sessionID === undefined) {
      this.sessionID = await this.cache.get('session_id')
      if (this.sessionID === undefined) return await this.sendIdentify()
    }
    this.debug(`Preparing to resume with Session: ${this.sessionID}`)
    if (this.sequenceID === undefined) {
      const cached = await this.cache.get('seq')
      if (cached !== undefined)
        this.sequenceID = typeof cached === 'string' ? parseInt(cached) : cached
    }
    const resumePayload = {
      op: GatewayOpcodes.RESUME,
      d: {
        token: this.token,
        session_id: this.sessionID,
        seq: this.sequenceID ?? null
      }
    }
    this.debug('Sending Resume payload...')
    this.send(resumePayload)
  }

  requestMembers(guild: string, options: RequestMembersOptions = {}): string {
    if (options.query !== undefined && options.limit === undefined)
      throw new Error(
        'Missing limit property when specifying query for Requesting Members!'
      )
    const nonce = `${guild}_${new Date().getTime()}`
    this.send({
      op: GatewayOpcodes.REQUEST_GUILD_MEMBERS,
      d: {
        guild_id: guild,
        query: options.query,
        limit: options.limit,
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
        self_mute: voiceOptions.mute === undefined ? false : voiceOptions.mute,
        self_deaf: voiceOptions.deaf === undefined ? false : voiceOptions.deaf
      }
    })
  }

  debug(msg: string): void {
    this.client.debug('Gateway', msg)
  }

  async reconnect(forceNew?: boolean): Promise<void> {
    clearInterval(this.heartbeatIntervalID)
    if (forceNew === true) {
      await this.cache.delete('session_id')
      await this.cache.delete('seq')
    }
    this.close(1000, RECONNECT_REASON)
    this.initWebsocket()
  }

  initWebsocket(): void {
    this.debug('Initializing WebSocket...')
    this.websocket = new WebSocket(
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      `${DISCORD_GATEWAY_URL}/?v=${DISCORD_API_VERSION}&encoding=json`,
      []
    )
    this.websocket.binaryType = 'arraybuffer'
    this.websocket.onopen = this.onopen.bind(this)
    this.websocket.onmessage = this.onmessage.bind(this)
    this.websocket.onclose = this.onclose.bind(this)
    this.websocket.onerror = this.onerror.bind(this)
  }

  close(code: number = 1000, reason?: string): void {
    return this.websocket.close(code, reason)
  }

  send(data: GatewayResponse): boolean {
    if (this.websocket.readyState !== this.websocket.OPEN) return false
    this.websocket.send(
      JSON.stringify({
        op: data.op,
        d: data.d,
        s: typeof data.s === 'number' ? data.s : null,
        t: data.t === undefined ? null : data.t
      })
    )
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
    if (this.heartbeatServerResponded) {
      this.heartbeatServerResponded = false
    } else {
      this.debug('Found dead connection, reconnecting...')
      clearInterval(this.heartbeatIntervalID)
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.reconnect()
      return
    }

    this.sendHeartbeat()
  }
}

export type GatewayEventHandler = (gateway: Gateway, d: any) => void

export { Gateway }
