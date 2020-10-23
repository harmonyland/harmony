import { Client } from "../models/client.ts"
import { VoiceStatePayload } from "../types/voiceTypes.ts"
import { Base } from "./base.ts"
import { Member } from "./member.ts"

export class VoiceState extends Base implements VoiceStatePayload {
    guild_id?: string
    channel_id: string | undefined
    user_id: string
    member?: Member
    session_id: string
    deaf: boolean
    mute: boolean
    self_deaf: boolean
    self_mute: boolean
    self_stream?: boolean
    self_video: boolean
    suppress: boolean

    constructor (client: Client, data: VoiceStatePayload) {
        super(client)
        this.channel_id = data.channel_id
        this.session_id = data.session_id
        this.user_id = data.user_id
        this.deaf = data.deaf
        this.mute = data.mute
        this.self_deaf = data.self_deaf
        this.self_mute = data.self_mute
        this.self_stream = data.self_stream
        this.self_video = data.self_video
        this.suppress = data.suppress
    }
}