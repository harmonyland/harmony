import type {
  ChannelMentionPayload,
  MessagePayload,
  UserPayload,
} from "../../../types/mod.ts";
import type { Client } from "../client/mod.ts";

export class Message {
  client: Client;
  id: string;
  // author: User;
  channelID: string;
  content?: string;
  timestamp: Date;
  editedTimestamp?: Date;
  tts: boolean;
  mentionEveryone: boolean;
  private _mentions: UserPayload[];
  private _mentionRoles: string[];
  private _mentionChannels?: ChannelMentionPayload[];

  constructor(client: Client, payload: MessagePayload) {
    this.client = client;
    this.id = payload.id;
    this.channelID = payload.channel_id;
    // this.author = new User(client, payload.author);
    this.content = payload.content;
    this.timestamp = new Date(payload.timestamp);
    if (payload.edited_timestamp) {
      this.editedTimestamp = new Date(payload.edited_timestamp);
    }
    this.tts = payload.tts;
    this.mentionEveryone = payload.mention_everyone;
    this._mentions = payload.mentions;
    this._mentionRoles = payload.mention_roles;
    this._mentionChannels = payload.mention_channels;
  }

  /// TODO: make any time-consuming properties lazy
  // get channel() {
  //   return this.client.channels.get(this.channelID);
  // }

  // get mentions() {
  //   return this._mentions.map((mention) => {
  //     return new User(this.client, mention);
  //   })
  // }

  // get mentionRoles() {
  //   return this._mentionRoles.map((roleID) => { /// NOTE: this.channel is always guild channel since role mentions are only allowed in guild channels
  //     return this.channel.roles.get(roleID);
  //   })
  // }
}
