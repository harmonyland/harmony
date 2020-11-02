import { Client } from '../models/client.ts'
import { Message } from '../structures/message.ts'
import { MessageMentions } from '../structures/MessageMentions.ts'
import { User } from '../structures/user.ts'
import { MessagePayload } from '../types/channel.ts'
import { CHANNEL_MESSAGE } from '../types/endpoint.ts'
import { BaseManager } from './BaseManager.ts'

export class MessagesManager extends BaseManager<MessagePayload, Message> {
  constructor (client: Client) {
    super(client, 'messages', Message)
  }

  async fetch (channelID: string, id: string): Promise<Message> {
    return await new Promise((resolve, reject) => {
      this.client.rest
        .get(CHANNEL_MESSAGE(channelID, id))
        .then(async data => {
          this.set(id, data as MessagePayload)
          let channel = await this.client.channels.get(channelID)
          if (channel === undefined)
            channel = await this.client.channels.fetch(channelID)
          const author = new User(this.client, (data as MessagePayload).author)
          await this.client.users.set(
            author.id,
            (data as MessagePayload).author
          )
          // TODO: Make this thing work (MessageMentions)
          const mentions = new MessageMentions()
          resolve(
            new Message(
              this.client,
              data as MessagePayload,
              channel,
              author,
              mentions
            )
          )
        })
        .catch(e => reject(e))
    })
  }
}
