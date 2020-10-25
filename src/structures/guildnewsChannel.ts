import { Client } from '../models/client.ts'
import { Channel } from './channel.ts'
import { GuildNewsChannelPayload } from '../types/channelTypes.ts'

export class NewsChannel extends Channel {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor (client: Client, data: GuildNewsChannelPayload) {
    super(client, data)
  }
}
