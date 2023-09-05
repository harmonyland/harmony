import type { MessagePayload } from "../../../../types/mod.ts";
import type { Client } from "../../client/mod.ts";
import type { TextChannel } from "../channels/textChannel.ts";
import { User } from "../users/mod.ts";

export class Message {
  client: Client;
  payload: MessagePayload;

  constructor(client: Client, payload: MessagePayload) {
    this.client = client;
    this.payload = payload;
  }

  /// TODO: make all time-consuming properties lazy

  get id() {
    return this.payload.id;
  }
  get content() {
    return this.payload.content;
  }
  get timestamp() {
    return this.payload.timestamp;
  }
  get editedTimestamp() {
    return this.payload.edited_timestamp;
  }
  get tts() {
    return this.payload.tts;
  }
  get mentionEveryone() {
    return this.payload.mention_everyone;
  }
  get nonce() {
    return this.payload.nonce;
  }
  get pinned() {
    return this.payload.pinned;
  }
  get webhookID() {
    return this.payload.webhook_id;
  }
  get type() {
    return this.payload.type;
  }
  get flags() {
    return this.payload.flags;
  }
  get position() {
    return this.payload.position;
  }

  get author() {
    return new User(this.client, this.payload.author);
  }

  get channel(): TextChannel | undefined {
    // this.channel is always TextChannel since Message is only allowed in TextChannel
    return this.client.channels.get(this.payload.channel_id) as
      | TextChannel
      | undefined;
  }

  get mentions() {
    return this.payload.mentions.map((mention) => {
      return new User(this.client, mention);
    });
  }

  // get mentionRoles() {
  //   return this._mentionRoles.map((roleID) => {
  //     return this.channel.roles.get(roleID); /// NOTE: this.channel is always guild channel since role mentions are only allowed in guild channels
  //   })
  // }

  // get mentionChannels() {
  //   return this._mentionChannels.map((channel) => {
  //     return this.client.channels.get(channel.id);
  //   })
  // }
}
