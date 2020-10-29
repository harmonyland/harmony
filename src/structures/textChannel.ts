import cache from '../models/cache.ts'
import { Client } from '../models/client.ts'
import { MessageOption, TextChannelPayload } from '../types/channelTypes.ts'
import { CHANNEL_MESSAGE, CHANNEL_MESSAGES } from '../types/endpoint.ts'
import { Channel } from './channel.ts'
import { Message } from './message.ts'

export class TextChannel extends Channel {
  lastMessageID?: string
  lastPinTimestamp?: string

  constructor (client: Client, data: TextChannelPayload) {
    super(client, data)
    this.lastMessageID = data.last_message_id
    this.lastPinTimestamp = data.last_pin_timestamp
    cache.set('textchannel', this.id, this)
  }

  readFromData (data: TextChannelPayload): void {
    super.readFromData(data)
    this.lastMessageID = data.last_message_id ?? this.lastMessageID
    this.lastPinTimestamp = data.last_pin_timestamp ?? this.lastPinTimestamp
  }

  async send (text?: string, option?: MessageOption): Promise<Message> {
    if (text !== undefined && option !== undefined) {
      throw new Error('Either text or option is necessary.')
    }
    const resp = await fetch(CHANNEL_MESSAGES(this.id), {
      headers: {
        Authorization: `Bot ${this.client.token}`,
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        content: text,
        embed: option?.embed,
        file: option?.file,
        tts: option?.tts,
        allowed_mentions: option?.allowedMention
      })
    })

    return new Message(this.client, await resp.json())
  }

  async editMessage (
    messageID: string,
    text?: string,
    option?: MessageOption
  ): Promise<Message> {
    if (text !== undefined && option !== undefined) {
      throw new Error('Either text or option is necessary.')
    }
    const resp = await fetch(CHANNEL_MESSAGE(this.id, messageID), {
      headers: {
        Authorization: `Bot ${this.client.token}`,
        'Content-Type': 'application/json'
      },
      method: 'PATCH',
      body: JSON.stringify({
        content: text,
        embed: option?.embed,
        file: option?.file,
        tts: option?.tts,
        allowed_mentions: option?.allowedMention
      })
    })

    return new Message(this.client, await resp.json())
  }
}
