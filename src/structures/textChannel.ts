import { Client } from '../models/client.ts'
import { MessageOption, TextChannelPayload } from '../types/channel.ts'
import { CHANNEL_MESSAGE, CHANNEL_MESSAGES } from '../types/endpoint.ts'
import { Channel } from './channel.ts'
import { Message } from './message.ts'
import { MessageMentions } from './MessageMentions.ts'
import { User } from "./user.ts"

export class TextChannel extends Channel {
  lastMessageID?: string
  lastPinTimestamp?: string

  constructor (client: Client, data: TextChannelPayload) {
    super(client, data)
    this.lastMessageID = data.last_message_id
    this.lastPinTimestamp = data.last_pin_timestamp
    // TODO: Cache in Gateway Event Code
    // cache.set('textchannel', this.id, this)
  }

  protected readFromData (data: TextChannelPayload): void {
    super.readFromData(data)
    this.lastMessageID = data.last_message_id ?? this.lastMessageID
    this.lastPinTimestamp = data.last_pin_timestamp ?? this.lastPinTimestamp
  }

  async send (text?: string, option?: MessageOption): Promise<Message> {
    if (text !== undefined && option !== undefined) {
      throw new Error('Either text or option is necessary.')
    }
    const resp = await this.client.rest.post(CHANNEL_MESSAGES(this.id), {
        content: text,
        embed: option?.embed,
        file: option?.file,
        tts: option?.tts,
        allowed_mentions: option?.allowedMention
    })

    return new Message(this.client, resp as any, this, this.client.user as User, new MessageMentions())
  }

  async edit (
    message: Message | string,
    text?: string,
    option?: MessageOption
  ): Promise<Message> {
    if (text === undefined && option === undefined) {
      throw new Error('Either text or option is necessary.')
    }

    if (this.client.user === undefined) {
      throw new Error('Client user has not initialized.')
    }

    const newMsg = await this.client.rest.patch(
      CHANNEL_MESSAGE(
        this.id,
        typeof message === 'string' ? message : message.id
      ),
      {
        content: text,
        embed: option?.embed.toJSON(),
        file: option?.file,
        tts: option?.tts,
        allowed_mentions: option?.allowedMention
      }
    )

    // TODO: Actually construct this object
    const mentions = new MessageMentions()

    return new Message(this.client, newMsg, this, this.client.user, mentions)
  }
}
