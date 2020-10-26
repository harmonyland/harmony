import { Client } from '../models/client.ts'
import { DMChannelPayload } from '../types/channelTypes.ts'
import { UserPayload } from '../types/userTypes.ts'
import { TextChannel } from './textChannel.ts'

export class DMChannel extends TextChannel {
  recipients: UserPayload[]

  constructor (client: Client, data: DMChannelPayload) {
    super(client, data)
    this.recipients = data.recipients
  }
}
