import { Client } from '../models/client.ts'
import { GroupDMChannelPayload } from '../types/channelTypes.ts'
import { Channel } from './channel.ts'

export class GroupDMChannel extends Channel {
  name: string
  icon?: string
  ownerID: string

  constructor (client: Client, data: GroupDMChannelPayload) {
    super(client, data)

    this.name = data.name
    this.icon = data.icon
    this.ownerID = data.owner_id
  }
}
