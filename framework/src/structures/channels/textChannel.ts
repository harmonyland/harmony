import type {
  CreateMessagePayload,
  MessagePayload,
  TextChannelPayload,
} from "../../../../types/mod.ts";
import type { Client } from "../../client/mod.ts";
import { Message } from "../messages/message.ts";
import { Channel } from "./channel.ts";

export class TextChannel extends Channel {
  lastPinTimestamp: string | null;
  lastMessageID: string | null;

  constructor(client: Client, payload: TextChannelPayload) {
    super(client, payload);
    this.lastPinTimestamp = payload.last_pin_timestamp;
    this.lastMessageID = payload.last_message_id;
  }

  async send(arg: string | CreateMessagePayload): Promise<Message> {
    const payload = typeof arg === "string" ? { content: arg } : arg;
    const message: MessagePayload = await this.client.rest.post(
      `/channels/${this.id}/messages`,
      {
        body: payload,
      },
    );
    return new Message(this.client, message);
  }
}
