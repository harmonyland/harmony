import { Client } from '../models/client.ts'
import { Message } from '../structures/message.ts'
import { TextChannel } from '../structures/textChannel.ts'
import { User } from '../structures/user.ts'
import { MessagePayload } from '../types/channel.ts'
import { CHANNEL_MESSAGE } from '../types/endpoint.ts'
import { BaseManager } from './base.ts'

export class MessagesManager extends BaseManager<MessagePayload, Message> {
  constructor (client: Client) {
    super(client, 'messages', Message)
  }

  async get (key: string): Promise<Message | undefined> {
    const raw = await this._get(key)
    if (raw === undefined) return

    let channel = await this.client.channels.get(raw.channel_id)
    if (channel === undefined)
      channel = await this.client.channels.fetch(raw.channel_id)

    const author = new User(this.client, raw.author)

    const res = new this.DataType(this.client, raw, channel, author) as any
    await res.mentions.fromPayload(raw)
    return res
  }

  async fetch (channelID: string, id: string): Promise<Message> {
    return await new Promise((resolve, reject) => {
      this.client.rest
        .get(CHANNEL_MESSAGE(channelID, id))
        .then(async data => {
          this.set(id, data as MessagePayload)

          let channel: any = await this.client.channels.get<TextChannel>(
            channelID
          )
          if (channel === undefined)
            channel = await this.client.channels.fetch(channelID)

          const author = new User(this.client, (data as MessagePayload).author)
          await this.client.users.set(
            author.id,
            (data as MessagePayload).author
          )

          const res = new Message(
            this.client,
            data as MessagePayload,
            channel as TextChannel,
            author
          )

          await res.mentions.fromPayload(data)

          resolve(res)
        })
        .catch(e => reject(e))
    })
  }
}
