import { VoiceServerUpdateData } from '../gateway/handlers/index.ts'
import { VoiceStateOptions } from '../gateway/index.ts'
import { Client } from '../models/client.ts'
import {
  GuildVoiceChannelPayload,
  ModifyVoiceChannelOption,
  ModifyVoiceChannelPayload,
  Overwrite
} from '../types/channel.ts'
import { CHANNEL } from '../types/endpoint.ts'
import { Channel } from './channel.ts'
import { Guild } from './guild.ts'
import { VoiceState } from './voiceState.ts'

export class VoiceChannel extends Channel {
  bitrate: string
  userLimit: number
  guildID: string
  name: string
  guild: Guild
  position: number
  permissionOverwrites: Overwrite[]
  parentID?: string

  constructor(client: Client, data: GuildVoiceChannelPayload, guild: Guild) {
    super(client, data)
    this.bitrate = data.bitrate
    this.userLimit = data.user_limit
    this.guildID = data.guild_id
    this.name = data.name
    this.position = data.position
    this.guild = guild
    this.permissionOverwrites = data.permission_overwrites
    this.parentID = data.parent_id
    // TODO: Cache in Gateway Event Code
    // cache.set('guildvoicechannel', this.id, this)
  }

  async join(options?: VoiceStateOptions): Promise<VoiceServerUpdateData> {
    return await new Promise((resolve, reject) => {
      let vcdata: VoiceServerUpdateData | undefined
      let done = 0

      const onVoiceStateAdd = (state: VoiceState): void => {
        if (state.user.id !== this.client.user?.id) return
        if (state.channel?.id !== this.id) return
        this.client.off('voiceStateAdd', onVoiceStateAdd)
        done++
        if (done >= 2) resolve((vcdata as unknown) as VoiceServerUpdateData)
      }

      const onVoiceServerUpdate = (data: VoiceServerUpdateData): void => {
        if (data.guild.id !== this.guild.id) return
        vcdata = data
        this.client.off('voiceServerUpdate', onVoiceServerUpdate)
        done++
        if (done >= 2) resolve(vcdata)
      }

      this.client.shards
        .get(this.guild.shardID)
        ?.updateVoiceState(this.guild.id, this.id, options)

      this.client.on('voiceStateAdd', onVoiceStateAdd)
      this.client.on('voiceServerUpdate', onVoiceServerUpdate)

      setTimeout(() => {
        if (done < 2) {
          this.client.off('voiceServerUpdate', onVoiceServerUpdate)
          this.client.off('voiceStateAdd', onVoiceStateAdd)
          reject(
            new Error(
              "Connection timed out - couldn't connect to Voice Channel"
            )
          )
        }
      }, 1000 * 60)
    })
  }

  leave(): void {
    this.client.shards
      .get(this.guild.shardID)
      ?.updateVoiceState(this.guild.id, undefined)
  }

  readFromData(data: GuildVoiceChannelPayload): void {
    super.readFromData(data)
    this.bitrate = data.bitrate ?? this.bitrate
    this.userLimit = data.user_limit ?? this.userLimit
    this.guildID = data.guild_id ?? this.guildID
    this.name = data.name ?? this.name
    this.position = data.position ?? this.position
    this.permissionOverwrites =
      data.permission_overwrites ?? this.permissionOverwrites
    this.parentID = data.parent_id ?? this.parentID
  }

  async edit(options?: ModifyVoiceChannelOption): Promise<VoiceChannel> {
    const body: ModifyVoiceChannelPayload = {
      name: options?.name,
      position: options?.position,
      permission_overwrites: options?.permissionOverwrites,
      parent_id: options?.parentID,
      bitrate: options?.bitrate,
      user_limit: options?.userLimit
    }

    const resp = await this.client.rest.patch(CHANNEL(this.id), body)

    return new VoiceChannel(this.client, resp, this.guild)
  }
}
