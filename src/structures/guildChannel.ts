import { Client } from '../models/client.ts'
import { ChannelPayload } from '../types/channelTypes.ts'
import { Channel } from './channel.ts'

export class GuildChannel extends Channel {
  constructor (client: Client, data: ChannelPayload) {
    super(client, data)
  }
}
