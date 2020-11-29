import { Client } from "../models/client.ts";
import { MemberPayload } from "../types/guild.ts";
import { VoiceStatePayload } from "../types/voice.ts";
import { Base } from "./base.ts";

export class VoiceState extends Base {
  guildID?: string;
  channelID?: string;
  userID: string;
  member?: MemberPayload;
  sessionID: string;
  deaf: boolean;
  mute: boolean;
  selfDeaf: boolean;
  selfMute: boolean;
  selfStream?: boolean;
  selfVideo: boolean;
  suppress: boolean;

  constructor(client: Client, data: VoiceStatePayload) {
    super(client, data);
    this.channelID = data.channel_id;
    this.sessionID = data.session_id;
    this.userID = data.user_id;
    this.deaf = data.deaf;
    this.mute = data.mute;
    this.selfDeaf = data.self_deaf;
    this.selfMute = data.self_mute;
    this.selfStream = data.self_stream;
    this.selfVideo = data.self_video;
    this.suppress = data.suppress;
    // TODO: Cache in Gateway Event Code
    // cache.set('voiceState', `${this.guildID}:${this.userID}`, this)
  }

  protected readFromData(data: VoiceStatePayload): void {
    super.readFromData(data);
    this.channelID = data.channel_id ?? this.channelID;
    this.sessionID = data.session_id ?? this.sessionID;
    this.userID = data.user_id ?? this.userID;
    this.deaf = data.deaf ?? this.deaf;
    this.mute = data.mute ?? this.mute;
    this.selfDeaf = data.self_deaf ?? this.selfDeaf;
    this.selfMute = data.self_mute ?? this.selfMute;
    this.selfStream = data.self_stream ?? this.selfStream;
    this.selfVideo = data.self_video ?? this.selfVideo;
    this.suppress = data.suppress ?? this.suppress;
  }
}
