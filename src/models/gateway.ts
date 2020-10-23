import { unzlib } from 'https://deno.land/x/denoflate/mod.ts'
import { Client } from './client.ts'
import {
  DISCORD_GATEWAY_URL,
  DISCORD_API_VERSION
} from '../consts/urlsAndVersions.ts'
import { GatewayResponse } from '../types/gatewayResponse.ts'
import {
  GatewayOpcodes,
  GatewayIntents,
  GatewayEvents
} from '../types/gatewayTypes.ts'
import { GuildPayload } from '../types/guildTypes.ts'
import { User } from '../structures/user.ts'
import * as cache from './cache.ts'
import { Guild } from '../structures/guild.ts'

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
  heartbeatCheckerIntervalID?: number
  sequenceID?: number
  sessionID?: string
  lastPingTimestemp = 0
  heartbeatServerResponded = false
  client: Client

  constructor (client: Client, token: string, intents: GatewayIntents[]) {
    this.token = token
    this.intents = intents
    this.client = client
    this.websocket = new WebSocket(
      `${DISCORD_GATEWAY_URL}/?v=${DISCORD_API_VERSION}&encoding=json`,
      []
    )
    this.websocket.binaryType = 'arraybuffer'
    this.websocket.onopen = this.onopen.bind(this)
    this.websocket.onmessage = this.onmessage.bind(this)
    this.websocket.onclose = this.onclose.bind(this)
    this.websocket.onerror = this.onerror.bind(this)
  }

  private onopen () {
    this.connected = true
  }

  private onmessage (event: MessageEvent) {
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
        this.heartbeatIntervalID = setInterval(() => {
          if (this.heartbeatServerResponded) {
            this.heartbeatServerResponded = false
          } else {
            clearInterval(this.heartbeatIntervalID)
            clearInterval(this.heartbeatCheckerIntervalID)
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
          this.lastPingTimestemp = Date.now()
        }, this.heartbeatInterval)

        if (!this.initialized) {
          this.sendIdentify()
          this.initialized = true
        } else {
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
        break

      case GatewayOpcodes.HEARTBEAT_ACK:
        this.heartbeatServerResponded = true
        this.client.ping = Date.now() - this.lastPingTimestemp
        break

      case GatewayOpcodes.INVALID_SESSION:
        setTimeout(this.sendIdentify, 3000)
        break

      case GatewayOpcodes.DISPATCH:
        this.heartbeatServerResponded = true
        if (s !== null) {
          this.sequenceID = s
        }
        switch (t) {
          case GatewayEvents.Ready:
            this.client.user = new User(this.client, d.user)
            this.sessionID = d.session_id
            d.guilds.forEach((guild: GuildPayload) => {
              cache.set('guilds', guild.id, new Guild(this.client, guild))
            })
            break
          default:
            break
        }
        break
      default:
        break
    }
  }

  private onclose (event: CloseEvent) {
    // TODO: Handle close event codes.
  }

  private onerror (event: Event | ErrorEvent) {
    const eventError = event as ErrorEvent

    console.log(eventError)
  }

  private sendIdentify () {
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

  initWebsocket () {
    this.websocket = new WebSocket(
      `${DISCORD_GATEWAY_URL}/?v=${DISCORD_API_VERSION}&encoding=json`,
      []
    )
    this.websocket.binaryType = 'arraybuffer'
    this.websocket.onopen = this.onopen.bind(this)
    this.websocket.onmessage = this.onmessage.bind(this)
    this.websocket.onclose = this.onclose.bind(this)
    this.websocket.onerror = this.onerror.bind(this)
  }

  close () {
    this.websocket.close(1000)
  }
}

export { Gateway }
