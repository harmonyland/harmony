import { Client } from '../models/client.ts'
import { TextChannelPayload } from '../types/channelTypes.ts'
import { Base } from "./base.ts"
import { Channel } from './channel.ts'
import { Embed } from './embed.ts'
export class TextChannel extends Channel {
  lastMessageId?: string
  lastPinTimestamp?: string

  constructor (client: Client, data: TextChannelPayload) {
    super(client, data)
    this.lastMessageId = data.last_message_id
    this.lastPinTimestamp = data.last_pin_timestamp
  }

  send (content: string | Embed, option?: {}) {} //TODO: send function
}
