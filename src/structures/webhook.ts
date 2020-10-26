import { Client } from '../models/client.ts'
import { UserPayload } from '../types/userTypes.ts'
import { WebhookPayload } from '../types/webhookTypes.ts'
import { Base } from './base.ts'

export class Webhook extends Base {
  id: string
  type: 1 | 2
  guildID?: string
  channelID: string
  user?: UserPayload
  name?: string
  avatar?: string
  token?: string
  applicationID?: string

  constructor (client: Client, data: WebhookPayload) {
    super(client)
    this.id = data.id
    this.type = data.type
    this.channelID = data.channel_id
  }
}
