import cache from '../models/cache.ts'
import { Client } from '../models/client.ts'
import { DMChannelPayload } from '../types/channel.ts'
import { UserPayload } from '../types/user.ts'
import { TextChannel } from './textChannel.ts'

export class DMChannel extends TextChannel {
  recipients: UserPayload[]

  constructor (client: Client, data: DMChannelPayload) {
    super(client, data)
    this.recipients = data.recipients
  }

  protected readFromData (data: DMChannelPayload): void {
    super.readFromData(data)
    this.recipients = data.recipients ?? this.recipients
  }
}
