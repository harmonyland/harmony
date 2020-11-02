import { Client } from "../models/client.ts";
import { Message } from "../structures/message.ts";
import { MessageMentions } from "../structures/MessageMentions.ts";
import { TextChannel } from "../structures/textChannel.ts";
import { User } from "../structures/user.ts";
import { MessagePayload } from "../types/channel.ts";
import { CHANNEL_MESSAGE } from "../types/endpoint.ts";
import { UserPayload } from "../types/user.ts";
import { BaseManager } from "./BaseManager.ts";

export class MessagesManager extends BaseManager<MessagePayload, Message> {
  constructor (client: Client) {
    super(client, 'messages', Message)
  }

  async get(key: string): Promise<Message | void> {
    const raw = await this._get(key)
    if(!raw) return
    let channel = await this.client.channels.get(raw.channel_id)
    if(!channel) channel = await this.client.channels.fetch(raw.channel_id)
    if(!channel) return
    let author = new User(this.client, raw.author)
    let mentions = new MessageMentions()
    return new this.dataType(this.client, raw, channel, author, mentions) as any
  }

  fetch(channelID: string, id: string) {
    return new Promise((res, rej) => {
      this.client.rest.get(CHANNEL_MESSAGE(channelID, id)).then(async data => {
        this.set(id, data as MessagePayload)
        let channel = await this.client.channels.get<TextChannel>(channelID)
        if(!channel) channel = await this.client.channels.fetch(channelID) as TextChannel
        let author = new User(this.client, (data as MessagePayload).author as UserPayload)
        await this.client.users.set(author.id, (data as MessagePayload).author)
        // TODO: Make this thing work (MessageMentions)
        let mentions = new MessageMentions()
        res(new Message(this.client, data as MessagePayload, channel, author, mentions))
      }).catch(e => rej(e))
    })
  }
}
