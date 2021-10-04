import type { Client } from '../client/mod.ts'
import { ChannelTypes } from '../types/channel.ts'
import type { VoiceStatePayload } from '../types/voice.ts'
import { Base } from './base.ts'
import type { Guild } from './guild.ts'
import type { VoiceChannel } from './guildVoiceChannel.ts'
import type { Member } from './member.ts'
import type { User } from './user.ts'

export class VoiceState extends Base {
  guild?: Guild
  channelID!: string | null
  channel: VoiceChannel | null
  user: User
  member?: Member
  sessionID!: string
  deaf!: boolean
  mute!: boolean
  selfDeaf!: boolean
  selfMute!: boolean
  stream?: boolean
  video!: boolean
  suppress!: boolean

  constructor(
    client: Client,
    data: VoiceStatePayload,
    _data: {
      user: User
      channel: VoiceChannel | null
      member?: Member
      guild?: Guild
    }
  ) {
    super(client, data)
    this.channel = _data.channel
    this.user = _data.user
    this.member = _data.member
    this.guild = _data.guild
    this.readFromData(data)
  }

  readFromData(data: VoiceStatePayload): void {
    this.sessionID = data.session_id ?? this.sessionID
    this.deaf = data.deaf ?? this.deaf
    this.channelID = data.channel_id ?? this.channelID
    this.mute = data.mute ?? this.mute
    this.selfDeaf = data.self_deaf ?? this.selfDeaf
    this.selfMute = data.self_mute ?? this.selfMute
    this.stream = data.self_stream ?? this.stream
    this.video = data.self_video ?? this.video
    this.suppress = data.suppress ?? this.suppress
  }

  /**
   * Disconnects a Member from connected VC
   */
  async disconnect(): Promise<Member | undefined> {
    const result = this.member?.disconnectVoice()
    if (result !== undefined) {
      this.channelID = null
      this.channel = null
    }
    return result
  }

  /**
   * Moves a Member to another VC
   * @param channel Channel to move(null or undefined to disconnect)
   */
  async moveChannel(
    channel?: string | VoiceChannel | null
  ): Promise<Member | undefined> {
    const result = this.member?.moveVoiceChannel(channel)
    if (result !== undefined) {
      let channelFetched: VoiceChannel | null
      let channelID: string | null
      if (typeof channel === 'string') {
        channelID = channel
        const channelCached = await this.guild?.channels.fetch(channel)
        if (channelCached?.type === ChannelTypes.GUILD_VOICE) {
          channelFetched = channelCached as VoiceChannel
        } else {
          throw new Error(`Channel ${channel} is not a VoiceChannel.`)
        }
      } else {
        channelID = channel?.id ?? null
        channelFetched = channel ?? null
      }
      this.channelID = channelID
      this.channel = channelFetched
    }
    return result
  }

  /**
   * Sets a Member mute in VC
   * @param mute Value to set
   */
  async setMute(mute?: boolean): Promise<Member | undefined> {
    return this.member?.setMute(mute)
  }

  /**
   * Sets a Member deaf in VC
   * @param deaf Value to set
   */
  async setDeaf(deaf?: boolean): Promise<Member | undefined> {
    return this.member?.setDeaf(deaf)
  }

  /**
   * Unmutes the Member from VC.
   */
  async unmute(): Promise<Member | undefined> {
    return await this.setMute(false)
  }

  /**
   * Undeafs the Member from VC.
   */
  async undeaf(): Promise<Member | undefined> {
    return await this.setDeaf(false)
  }
}
