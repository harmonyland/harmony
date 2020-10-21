import { inflate } from 'https://deno.land/x/denoflate/mod.ts'
import {
  DISCORD_GATEWAY_URL,
  DISCORD_API_VERSION
} from '../consts/urlsAndVersions.ts'
import { GatewayResponse } from '../types/gatewayResponse.ts'
import { GatewayOpcodes, GatewayIntents } from '../types/gatewayTypes.ts'

/**
 * Handles Discord gateway connection.
 * You should not use this and rather use Client class.
 *
 * @beta
 */
class Gateway {
  websocket: WebSocket
  token: string
  intents: [GatewayIntents]
  connected = false
  initialized = false
  heartbeatInterval = 0
  heartbeatIntervalID?: number
  sequenceID?: number
  heartbeatServerResponded = false

  constructor (token: string, intents: [GatewayIntents]) {
    this.websocket = new WebSocket(
      `${DISCORD_GATEWAY_URL}/?v=${DISCORD_API_VERSION}&encoding=json`
    )
    this.token = token
    this.intents = intents
  }

  onopen () {
    this.connected = true
  }

  onmessage (event: MessageEvent) {
    let data = event.data
    if (data instanceof ArrayBuffer) {
      data = new Uint8Array(data)
    }
    if (data instanceof Uint8Array) {
      const dataSuffix = data.slice(-4)

      if (
        dataSuffix[0] === 0 &&
        dataSuffix[1] === 0 &&
        dataSuffix[2] === 0xff &&
        dataSuffix[3] === 0xff
      ) {
        data = inflate(data)
      }
    }

    const { op, d, s, t }: GatewayResponse = JSON.parse(data)

    switch (op) {
      case GatewayOpcodes.HELLO:
        this.heartbeatInterval = d.heartbeat_interval
        this.heartbeatIntervalID = setInterval(() => {
          this.websocket.send(
            JSON.stringify({
              op: GatewayOpcodes.HEARTBEAT,
              d: this.sequenceID ?? null
            })
          )

          if (this.heartbeatServerResponded) {
            this.heartbeatServerResponded = false
          } else {
            // TODO: Add heartbeat failed error
          }
        }, this.heartbeatInterval)

        this.websocket.send(
          JSON.stringify({
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
          })
        )
        break

      case GatewayOpcodes.HEARTBEAT_ACK:
        this.heartbeatServerResponded = true
        break

      case GatewayOpcodes.DISPATCH:
        switch (t) {
        }

      default:
        return
    }
  }
}

export { Gateway }
