import type { VoiceServerUpdateData } from '../gateway/handlers/mod.ts'
import type { VoiceStateOptions } from '../gateway/mod.ts'
import type { Client } from '../client/mod.ts'
import type {
  GuildVoiceChannelPayload,
  ModifyVoiceChannelOption,
  ModifyVoiceChannelPayload
} from '../types/channel.ts'
import { CHANNEL } from '../types/endpoint.ts'
import { GuildChannel } from './channel.ts'
import type { Guild } from './guild.ts'
import type { VoiceState } from './voiceState.ts'
import { GuildChannelVoiceStatesManager } from '../managers/guildChannelVoiceStates.ts'
import type { User } from './user.ts'
import type { Member } from './member.ts'

export interface VoiceServerData extends VoiceServerUpdateData {
  sessionID: string
}

export class VoiceChannel extends GuildChannel {
  bitrate: string
  userLimit: number
  voiceStates = new GuildChannelVoiceStatesManager(
    this.client,
    this.guild.voiceStates,
    this
  )

  constructor(client: Client, data: GuildVoiceChannelPayload, guild: Guild) {
    super(client, data, guild)
    this.bitrate = data.bitrate
    this.userLimit = data.user_limit
  }

  /** Join the Voice Channel */
  async join(
    options?: VoiceStateOptions & { onlyJoin?: boolean }
  ): Promise<VoiceServerData> {
    return await new Promise((resolve, reject) => {
      let vcdata: VoiceServerData
      let sessionID: string
      let done = 0

      const onVoiceStateAdd = (state: VoiceState): void => {
        if (state.user.id !== this.client.user?.id) return
        if (state.channel?.id !== this.id) return
        this.client.off('voiceStateAdd', onVoiceStateAdd)
        done++
        sessionID = state.sessionID
        if (done >= 2) {
          vcdata.sessionID = sessionID
          if (options?.onlyJoin !== true) {
          }
          resolve(vcdata)
        }
      }

      const onVoiceServerUpdate = (data: VoiceServerUpdateData): void => {
        if (data.guild.id !== this.guild.id) return
        vcdata = (data as unknown) as VoiceServerData
        this.client.off('voiceServerUpdate', onVoiceServerUpdate)
        done++
        if (done >= 2) {
          vcdata.sessionID = sessionID
          resolve(vcdata)
        }
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

  /** Leave the Voice Channel */
  leave(): void {
    this.client.shards
      .get(this.guild.shardID)
      ?.updateVoiceState(this.guild.id, undefined)
  }

  readFromData(data: GuildVoiceChannelPayload): void {
    super.readFromData(data)
    this.bitrate = data.bitrate ?? this.bitrate
    this.userLimit = data.user_limit ?? this.userLimit
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

  async disconnectMember(
    member: User | Member | string
  ): Promise<Member | undefined> {
    const memberID = typeof member === 'string' ? member : member.id
    const memberVoiceState = await this.voiceStates.get(memberID)

    return memberVoiceState?.disconnect()
  }

  async disconnectAll(): Promise<Member[]> {
    const members: Member[] = []
    for await (const memberVoiceState of this.voiceStates) {
      const member = await memberVoiceState.disconnect()
      if (member !== undefined) {
        members.push(member)
      }
    }

    return members
  }
}
