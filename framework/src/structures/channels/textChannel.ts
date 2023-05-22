import type {
  ChannelType,
  CreateMessagePayload,
  MessagePayload,
  TextChannelPayload,
} from "../../../../types/mod.ts";
import type { Client } from "../../client/mod.ts";
import { Message } from "../messages/message.ts";

export class TextChannel {
  client: Client;
  lastPinTimestamp: string | null;
  lastMessageID: string | null;
  id: string;
  type: ChannelType;
  flags: number;

  constructor(client: Client, payload: TextChannelPayload) {
    this.client = client;
    this.lastPinTimestamp = payload.last_pin_timestamp;
    this.lastMessageID = payload.last_message_id;
    this.id = payload.id;
    this.type = payload.type;
    this.flags = payload.flags;
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
