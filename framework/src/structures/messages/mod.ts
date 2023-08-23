import type {
  MessagePayload,
  TextChannelPayload,
} from "../../../../types/mod.ts";
import type { Client } from "../../client/mod.ts";
import { TextChannel } from "../mod.ts";
import { User } from "../users/mod.ts";

export class Message {
  client: Client;
  payload: MessagePayload;

  constructor(client: Client, payload: MessagePayload) {
    this.client = client;
    this.payload = payload;
  }

  /// TODO: make all time-consuming properties lazy

  get author() {
    return new User(this.client, this.payload.author);
  }

  get channel(): TextChannel<TextChannelPayload> | undefined {
    return this.client.channels.get(this.payload.channel_id) as TextChannel<
      TextChannelPayload
    >;
  }

  // get mentions() {
  //   return this._mentions.map((mention) => {
  //     return new User(this.client, mention);
  //   })
  // }

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
