import { Client } from '../models/client.ts'
import { MemberPayload } from '../types/guildTypes.ts'
import { VoiceStatePayload } from '../types/voiceTypes.ts'
import { Base } from './base.ts'
import { Member } from './member.ts'

export class VoiceState extends Base {
  guildID?: string
  channelID?: string
  userID: string
  member?: MemberPayload
  sessionID: string
  deaf: boolean
  mute: boolean
  selfDeaf: boolean
  selfMute: boolean
  selfStream?: boolean
  selfVideo: boolean
  suppress: boolean

  constructor (client: Client, data: VoiceStatePayload) {
    super(client, data)
    this.channelID = data.channel_id
    this.sessionID = data.session_id
    this.userID = data.user_id
    this.deaf = data.deaf
    this.mute = data.mute
    this.selfDeaf = data.self_deaf
    this.selfMute = data.self_mute
    this.selfStream = data.self_stream
    this.selfVideo = data.self_video
    this.suppress = data.suppress
  }
}
