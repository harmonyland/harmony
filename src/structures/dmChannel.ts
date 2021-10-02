import type { Client } from '../client/mod.ts'
import type { DMChannelPayload } from '../types/channel.ts'
import type { UserPayload } from '../types/user.ts'
import { TextChannel } from './textChannel.ts'

export class DMChannel extends TextChannel {
  recipients: UserPayload[] = []

  constructor(client: Client, data: DMChannelPayload) {
    super(client, data)
    this.readFromData(data)
  }

  readFromData(data: DMChannelPayload): void {
    super.readFromData(data)
    this.recipients = data.recipients ?? this.recipients
  }
}
