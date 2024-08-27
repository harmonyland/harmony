import type {
  GetChannelMessagesParams,
  MessagePayload,
} from "../../../types/mod.ts";
import type { Client } from "../client/mod.ts";
import { Message } from "../structures/messages/mod.ts";
import { BaseManager } from "./base.ts";

export class MessagesManager extends BaseManager<MessagePayload, Message> {
  constructor(client: Client) {
    super(client);
  }

  _fill(messages: MessagePayload[]) {
    for (const message of messages) {
      this.set(message.id!, message);
    }
  }

  async _fetch(
    channelID: string,
    id: string,
  ): Promise<MessagePayload | undefined> {
    try {
      const resp: MessagePayload | undefined = await this.client.rest.get(
        `/channels/${channelID}/messages/${id}`,
      );
      if (!resp) return;
      this.set(id, resp);
      return resp;
    } catch (_err) {
      return;
    }
  }
  async _fetchBulk(
    channelID: string,
    options: GetChannelMessagesParams,
  ): Promise<MessagePayload[] | undefined> {
    try {
      const query: Record<string, string> = {
        ...options,
        limit: "",
      };
      if (options.limit) {
        if (options.limit > 100 || options.limit < 1) {
          throw new Error("Limit must be in range 1-100");
        }
        query.limit = options.limit.toString();
      } else {
        delete query.limit;
      }
      const resp: MessagePayload[] | undefined = await this.client.rest.get(
        `/channels/${channelID}/messages`,
        {
          query,
        },
      );
      if (!resp) return;
      return resp.map((message) => {
        this.set(message.id!, message);
        return message;
      });
    } catch (_err) {
      return;
    }
  }

  get(
    id: string,
  ) {
    const cached = this._get(id);
    if (!cached) return;
    return new Message(this.client, cached);
  }
  async fetch(
    channelID: string,
    id: string,
  ) {
    try {
      const payload = await this._fetch(channelID, id);
      if (!payload) return;
      return new Message(this.client, payload);
    } catch (_err) {
      return;
    }
  }
}
