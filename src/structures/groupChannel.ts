import type { Client } from '../client/mod.ts'
import type { GroupDMChannelPayload } from '../types/channel.ts'
import { Channel } from './channel.ts'

export class GroupDMChannel extends Channel {
  name!: string
  icon?: string
  ownerID!: string

  constructor(client: Client, data: GroupDMChannelPayload) {
    super(client, data)
    this.readFromData(data)
  }

  readFromData(data: GroupDMChannelPayload): void {
    super.readFromData(data)
    this.name = data.name ?? this.name
    this.icon = data.icon ?? this.icon
    this.ownerID = data.owner_id ?? this.ownerID
  }
}
