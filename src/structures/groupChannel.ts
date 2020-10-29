import cache from '../models/cache.ts'
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
    cache.set('groupchannel', this.id, this)
  }

  readFromData (data: GroupDMChannelPayload): void {
    super.readFromData(data)
    this.name = data.name ?? this.name
    this.icon = data.icon ?? this.icon
    this.ownerID = data.owner_id ?? this.ownerID
  }
}
