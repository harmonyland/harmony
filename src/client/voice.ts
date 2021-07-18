import type { VoiceServerUpdateData } from '../gateway/handlers/mod.ts'
import type { VoiceChannel } from '../structures/guildVoiceChannel.ts'
import type { VoiceStateOptions } from '../gateway/mod.ts'
import { VoiceState } from '../structures/voiceState.ts'
import { ChannelTypes } from '../types/channel.ts'
import type { Guild } from '../structures/guild.ts'
import { HarmonyEventEmitter } from '../utils/events.ts'
import type { Client } from './client.ts'

export interface VoiceServerData extends VoiceServerUpdateData {
  userID: string
  sessionID: string
}

export interface VoiceChannelJoinOptions extends VoiceStateOptions {
  timeout?: number
}

export class VoiceManager extends HarmonyEventEmitter<{
  voiceStateUpdate: [VoiceState]
}> {
  #pending = new Map<string, [number, CallableFunction]>()

  readonly client!: Client

  constructor(client: Client) {
    super()
    Object.defineProperty(this, 'client', {
      value: client,
      enumerable: false
    })
  }

  async join(
    channel: string | VoiceChannel,
    options?: VoiceChannelJoinOptions
  ): Promise<VoiceServerData> {
    const id = typeof channel === 'string' ? channel : channel.id
    const chan = await this.client.channels.get<VoiceChannel>(id)
    if (chan === undefined) throw new Error('Voice Channel not cached')
    if (
      chan.type !== ChannelTypes.GUILD_VOICE &&
      chan.type !== ChannelTypes.GUILD_STAGE_VOICE
    )
      throw new Error('Cannot join non-voice channel')

    const pending = this.#pending.get(chan.guild.id)
    if (pending !== undefined) {
      clearTimeout(pending[0])
      pending[1](new Error('Voice Connection timed out'))
      this.#pending.delete(chan.guild.id)
    }

    return await new Promise((resolve, reject) => {
      let vcdata: VoiceServerData
      let done = 0

      const onVoiceStateAdd = (state: VoiceState): void => {
        if (state.user.id !== this.client.user?.id) return
        if (state.channel?.id !== id) return
        this.client.off('voiceStateAdd', onVoiceStateAdd)
        done++
        vcdata = vcdata ?? {}
        vcdata.sessionID = state.sessionID
        vcdata.userID = state.user.id
        if (done >= 2) {
          this.#pending.delete(chan.guild.id)
          resolve(vcdata)
        }
      }

      const onVoiceServerUpdate = (data: VoiceServerUpdateData): void => {
        if (data.guild.id !== chan.guild.id) return
        vcdata = Object.assign(vcdata ?? {}, data)
        this.client.off('voiceServerUpdate', onVoiceServerUpdate)
        done++
        if (done >= 2) {
          this.#pending.delete(chan.guild.id)
          resolve(vcdata)
        }
      }

      this.client.shards
        .get(chan.guild.shardID)!
        .updateVoiceState(chan.guild.id, chan.id, options)

      this.on('voiceStateUpdate', onVoiceStateAdd)
      this.client.on('voiceServerUpdate', onVoiceServerUpdate)

      const timer = setTimeout(() => {
        if (done < 2) {
          this.client.off('voiceServerUpdate', onVoiceServerUpdate)
          this.client.off('voiceStateAdd', onVoiceStateAdd)
          reject(
            new Error(
              "Connection timed out - couldn't connect to Voice Channel"
            )
          )
        }
      }, options?.timeout ?? 1000 * 30)

      this.#pending.set(chan.guild.id, [timer, reject])
    })
  }

  async leave(guildOrID: Guild | string): Promise<void> {
    const id = typeof guildOrID === 'string' ? guildOrID : guildOrID.id
    const guild = await this.client.guilds.get(id)
    if (guild === undefined) throw new Error('Guild not cached')
    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    const vcs = await guild.voiceStates.get(this.client.user?.id!)
    if (vcs === undefined) throw new Error('Not in Voice Channel')

    this.client.shards.get(guild.shardID)!.updateVoiceState(guild, undefined)
  }
}
