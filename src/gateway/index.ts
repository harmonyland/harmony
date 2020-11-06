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
  GatewayCloseCodes
} from '../types/gateway.ts'
import { gatewayHandlers } from './handlers/index.ts'
import { GATEWAY_BOT } from '../types/endpoint.ts'
import { GatewayCache } from "../managers/gatewayCache.ts"
import { ClientActivityPayload } from "../structures/presence.ts"

/**
 * Handles Discord gateway connection.
 * You should not use this and rather use Client class.
 *
 * @beta
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
        this.debug(`Invalid Session! Identifying with forced new session`)
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        // eslint-disable-next-line @typescript-eslint/promise-function-async
        setTimeout(() => this.sendIdentify(true), 3000)
        break

      case GatewayOpcodes.DISPATCH: {
        this.heartbeatServerResponded = true
        if (s !== null) {
          this.sequenceID = s
          await this.cache.set('seq', s)
        }
        if (t !== null && t !== undefined) {
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

  private onclose(event: CloseEvent): void {
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
      throw new Error("Couldn't connect. Sharding is requried!")
    } else if (event.code === GatewayCloseCodes.INVALID_API_VERSION) {
      throw new Error("Invalid API Version was used. This shouldn't happen!")
    } else if (event.code === GatewayCloseCodes.INVALID_INTENTS) {
      throw new Error('Invalid Intents')
    } else if (event.code === GatewayCloseCodes.DISALLOWED_INTENTS) {
      throw new Error("Given Intents aren't allowed")
    } else {
      this.debug('Unknown Close code, probably connection error. Reconnecting.')
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.reconnect()
    }
  }

  private onerror(event: Event | ErrorEvent): void {
    const eventError = event as ErrorEvent
    console.log(eventError)
  }

  private async sendIdentify(forceNewSession?: boolean): Promise<void> {
    if (this.client.bot === true) {
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
    }

    let payload: any = {
      op: GatewayOpcodes.IDENTIFY,
      d: {
        token: this.token,
        properties: {
          $os: Deno.build.os,
          $browser: 'discord.deno', // TODO: Change lib name
          $device: 'discord.deno'
        },
        compress: true,
        shard: [0, 1], // TODO: Make sharding possible
        intents: this.intents.reduce(
          (previous, current) => previous | current,
          0
        ),
        presence: this.client.presence.create()
      }
    }

    if(this.client.bot === false) {
      // TODO: Complete Selfbot support
      this.debug("Modify Identify Payload for Self-bot..")
      // delete payload.d['intents']
      // payload.d.intents = Intents.None
      payload.d.presence = null
      payload.d.properties = {
        $os: "Windows",
        $browser: "Firefox",
        $device: ""
      }

      this.debug("Warn: Support for selfbots is incomplete")
    }

    this.send(payload)
  }

  private async sendResume(): Promise<void> {
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
    this.send(resumePayload)
  }

  debug(msg: string): void {
    this.client.debug('Gateway', msg)
  }

  async reconnect(forceNew?: boolean): Promise<void> {
    clearInterval(this.heartbeatIntervalID)
    if (forceNew === undefined || !forceNew)
      await this.cache.delete('session_id')
    this.close()
    this.initWebsocket()
  }

  initWebsocket(): void {
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

  close(): void {
    this.websocket.close(1000)
  }

  send(data: GatewayResponse): boolean {
    if (this.websocket.readyState !== this.websocket.OPEN) return false
    this.websocket.send(JSON.stringify({
      op: data.op,
      d: data.d,
      s: typeof data.s === "number" ? data.s : null,
      t: data.t === undefined ? null : data.t,
    }))
    return true
  }

  sendPresence(data: ClientActivityPayload): void {
    this.send({
      op: GatewayOpcodes.PRESENCE_UPDATE,
      d: data
    })
  }

  sendHeartbeat() {
    const payload = {
      op: GatewayOpcodes.HEARTBEAT,
      d: this.sequenceID ?? null
    };

    this.send(payload)
    this.lastPingTimestamp = Date.now()
  }

  heartbeat() {
    if (this.heartbeatServerResponded) {
      this.heartbeatServerResponded = false
    } else {
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
