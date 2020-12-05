import { Client } from '../models/client.ts'
import { VoiceStatePayload } from '../types/voice.ts'
import { Base } from './base.ts'
import { Guild } from './guild.ts'
import { VoiceChannel } from './guildVoiceChannel.ts'
import { Member } from './member.ts'
import { User } from './user.ts'

export class VoiceState extends Base {
  guild?: Guild
  channelID: string | null
  channel: VoiceChannel | null
  user: User
  member?: Member
  sessionID: string
  deaf: boolean
  mute: boolean
  stream?: boolean
  video: boolean
  suppress: boolean

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
    this.channelID = data.channel_id
    this.channel = _data.channel
    this.sessionID = data.session_id
    this.user = _data.user
    this.member = _data.member
    this.guild = _data.guild
    this.deaf = data.deaf
    this.mute = data.mute
    this.deaf = data.self_deaf
    this.mute = data.self_mute
    this.stream = data.self_stream
    this.video = data.self_video
    this.suppress = data.suppress
  }

  readFromData(data: VoiceStatePayload): void {
    this.sessionID = data.session_id ?? this.sessionID
    this.deaf = data.deaf ?? this.deaf
    this.channelID = data.channel_id ?? this.channelID
    this.mute = data.mute ?? this.mute
    this.deaf = data.self_deaf ?? this.deaf
    this.mute = data.self_mute ?? this.mute
    this.stream = data.self_stream ?? this.stream
    this.video = data.self_video ?? this.video
    this.suppress = data.suppress ?? this.suppress
  }
}
