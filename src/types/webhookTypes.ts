import { User } from '../structures/user.ts'

export interface WebhookPayload {
  id: string
  type: 1 | 2
  guild_id?: string
  channel_id: string
  user?: User
  name: string | undefined
  avatar: string | undefined
  token?: string
  application_id: string | undefined
}
