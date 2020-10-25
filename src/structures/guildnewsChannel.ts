import { Client } from '../models/client.ts'
import { Channel } from './channel.ts'
import { GuildNewsChannelPayload } from '../types/channelTypes.ts'
import { Base } from "./base.ts"

export class NewsChannel extends Channel {
  constructor (client: Client, data: GuildNewsChannelPayload) {
    super(client, data)
  }
}
