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
import { Channel } from '../structures/channel.ts'
import { ChannelTypes } from '../types/channelTypes.ts'
import { DMChannel } from '../structures/dmChannel.ts'
import { GroupDMChannel } from '../structures/groupChannel.ts'
import { GuildTextChannel } from '../structures/guildTextChannel.ts'
import { VoiceChannel } from '../structures/guildVoiceChannel.ts'
import { CategoryChannel } from '../structures/guildCategoryChannel.ts'
import { NewsChannel } from '../structures/guildNewsChannel.ts'

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
  private heartbeatInterval = 0
  private heartbeatIntervalID?: number
  private sequenceID?: number
  private sessionID?: string
  lastPingTimestemp = 0
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
          this.lastPingTimestemp = Date.now()
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
        this.client.ping = Date.now() - this.lastPingTimestemp
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
              Guild.autoInit(this.client, {
                endpoint: 'guild',
                restURLfuncArgs: [guild.id]
              })
            })
            this.client.emit('ready')
            break
          case GatewayEvents.Channel_Create: {
            let channel: Channel | undefined
            switch (d.type) {
              case ChannelTypes.DM:
                channel = new DMChannel(this.client, d)
                break
              case ChannelTypes.GROUP_DM:
                channel = new GroupDMChannel(this.client, d)
                break
              case ChannelTypes.GUILD_TEXT:
                channel = new GuildTextChannel(this.client, d)
                break
              case ChannelTypes.GUILD_VOICE:
                channel = new VoiceChannel(this.client, d)
                break
              case ChannelTypes.GUILD_CATEGORY:
                channel = new CategoryChannel(this.client, d)
                break
              case ChannelTypes.GUILD_NEWS:
                channel = new NewsChannel(this.client, d)
                break
              default:
                break
            }

            if (channel !== undefined) {
              cache.set('channel', channel.id, channel)
              this.client.emit('channelCreate', channel)
            }
            break
          }
          case GatewayEvents.Channel_Update: {
            const oldChannel: Channel = cache.get('channel', d.id)

            if (oldChannel.type !== d.type) {
              let channel: Channel = oldChannel
              switch (d.type) {
                case ChannelTypes.DM:
                  channel = new DMChannel(this.client, d)
                  break
                case ChannelTypes.GROUP_DM:
                  channel = new GroupDMChannel(this.client, d)
                  break
                case ChannelTypes.GUILD_TEXT:
                  channel = new GuildTextChannel(this.client, d)
                  break
                case ChannelTypes.GUILD_VOICE:
                  channel = new VoiceChannel(this.client, d)
                  break
                case ChannelTypes.GUILD_CATEGORY:
                  channel = new CategoryChannel(this.client, d)
                  break
                case ChannelTypes.GUILD_NEWS:
                  channel = new NewsChannel(this.client, d)
                  break
                default:
                  break
              }
              cache.set('channel', channel.id, channel)
              this.client.emit('channelUpdate', oldChannel, channel)
            } else {
              const before = oldChannel.refreshFromData(d)
              this.client.emit('channelUpdate', before, oldChannel)
            }
            break
          }
          case GatewayEvents.Channel_Delete: {
            const channel: Channel = cache.get('channel', d.id)
            cache.del('channel', d.id)

            this.client.emit('channelDelete', channel)
            break
          }
          default:
            break
        }
        break
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

  private sendIdentify (): void {
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

export { Gateway }
