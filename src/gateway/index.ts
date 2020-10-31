import { unzlib } from 'https://deno.land/x/denoflate/mod.ts'
import { Client } from '../models/client.ts'
import {
  DISCORD_GATEWAY_URL,
  DISCORD_API_VERSION
} from '../consts/urlsAndVersions.ts'
import { GatewayResponse } from '../types/gatewayResponse.ts'
import { GatewayOpcodes, GatewayIntents } from '../types/gatewayTypes.ts'
import { gatewayHandlers } from './handlers/index.ts'
import { GATEWAY_BOT } from '../types/endpoint.ts'
import { GatewayBotPayload } from "../types/gatewayBot.ts"

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
  sessionID?: string
  lastPingTimestamp = 0
  private heartbeatServerResponded = false
  client: Client

  constructor (client: Client, token: string, intents: GatewayIntents[]) {
    this.token = token
    this.intents = intents
    this.client = client
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

  private onopen (): void {
    this.connected = true
    this.debug("Connected to Gateway!")
  }

  private onmessage (event: MessageEvent): void {
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
        this.debug(`Received HELLO. Heartbeat Interval: ${this.heartbeatInterval}`)
        this.heartbeatIntervalID = setInterval(() => {
          if (this.heartbeatServerResponded) {
            this.heartbeatServerResponded = false
          } else {
            clearInterval(this.heartbeatIntervalID)
            this.websocket.close()
            this.initWebsocket()
            return
          }

          this.websocket.send(
            JSON.stringify({
              op: GatewayOpcodes.HEARTBEAT,
              d: this.sequenceID ?? null
            })
          )
          this.lastPingTimestamp = Date.now()
        }, this.heartbeatInterval)

        if (!this.initialized) {
          this.sendIdentify()
          this.initialized = true
        } else {
          this.sendResume()
        }
        break

      case GatewayOpcodes.HEARTBEAT_ACK:
        this.heartbeatServerResponded = true
        this.client.ping = Date.now() - this.lastPingTimestamp
        this.debug(`Received Heartbeat Ack. Ping Recognized: ${this.client.ping}ms`)
        break

      case GatewayOpcodes.INVALID_SESSION:
        // Because we know this gonna be bool
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (!d) {
          setTimeout(this.sendResume, 3000)
        } else {
          setTimeout(this.sendIdentify, 3000)
        }
        break

      case GatewayOpcodes.DISPATCH: {
        this.heartbeatServerResponded = true
        if (s !== null) {
          this.sequenceID = s
        }
        if (t !== null && t !== undefined) {
          const handler = gatewayHandlers[t]

          if (handler !== undefined) {
            handler(this, d)
          }
        }
        break
      }
      default:
        break
    }
  }

  private onclose (event: CloseEvent): void {
    console.log(event.code)
    // TODO: Handle close event codes.
  }

  private onerror (event: Event | ErrorEvent): void {
    const eventError = event as ErrorEvent

    console.log(eventError)
  }

  private async sendIdentify () {
    this.debug("Fetching /gateway/bot...")
    let info = await this.client.rest.get(GATEWAY_BOT()) as GatewayBotPayload
    if(info.session_start_limit.remaining == 0) throw new Error("Session Limit Reached. Retry After " + info.session_start_limit.reset_after + "ms")
    this.debug("Recommended Shards: " + info.shards)
    this.debug("=== Session Limit Info ===")
    this.debug(`Remaining: ${info.session_start_limit.remaining}/${info.session_start_limit.total}`)
    this.debug(`Reset After: ${info.session_start_limit.reset_after}ms`)
    this.websocket.send(
      JSON.stringify({
        op: GatewayOpcodes.IDENTIFY,
        d: {
          token: this.token,
          properties: {
            $os: Deno.build.os,
            $browser: 'discord.deno',
            $device: 'discord.deno'
          },
          compress: true,
          shard: [0, 1], // TODO: Make sharding possible
          intents: this.intents.reduce(
            (previous, current) => previous | current,
            0
          ),
          presence: {
            // TODO: User should can customize this
            status: 'online',
            since: null,
            afk: false
          }
        }
      })
    )
  }

  private sendResume (): void {
    this.debug(`Preparing to resume with Session: ${this.sessionID}`)
    this.websocket.send(
      JSON.stringify({
        op: GatewayOpcodes.RESUME,
        d: {
          token: this.token,
          session_id: this.sessionID,
          seq: this.sequenceID
        }
      })
    )
  }

  debug(msg: string) {
    this.client.debug("Gateway", msg)
  }

  initWebsocket (): void {
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

  close (): void {
    this.websocket.close(1000)
  }
}

export type GatewayEventHandler = (gateway: Gateway, d: any) => void

export { Gateway }
