import type {
  CreateMessagePayload,
  MessagePayload,
  TextChannelPayload,
} from "../../../../types/mod.ts";
import type { Client } from "../../client/mod.ts";
import { Message } from "../messages/message.ts";
import { Channel } from "./channel.ts";

export class TextChannel<T extends TextChannelPayload> extends Channel<T> {
  constructor(client: Client, payload: T) {
    super(client, payload);
  }

  get lastPinTimestamp(): string | null {
    return this.payload.last_pin_timestamp;
  }
  get lastMessageID(): string | null {
    return this.payload.last_message_id;
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
