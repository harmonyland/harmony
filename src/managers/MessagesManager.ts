import { Client } from "../models/client.ts";
import { Message } from "../structures/message.ts";
import { MessagePayload } from "../types/channelTypes.ts";
import { CHANNEL_MESSAGE } from "../types/endpoint.ts";
import { BaseManager } from "./BaseManager.ts";

export class MessagesManager extends BaseManager<MessagePayload, Message> {
  constructor(client: Client) {
    super(client, "messages", Message)
  }

  fetch(channelID: string, id: string) {
    return new Promise((res, rej) => {
      this.client.rest.get(CHANNEL_MESSAGE(channelID, id)).then(data => {
        this.set(id, data as MessagePayload)
        res(new Message(this.client, data as MessagePayload))
      }).catch(e => rej(e))
    })
  }
}