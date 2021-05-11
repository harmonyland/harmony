import type { UserPayload } from './user.ts'

export interface WebhookPayload {
  id: string
  type: 1 | 2
  guild_id?: string
  channel_id: string
  user?: UserPayload
  name?: string
  avatar?: string
  token?: string
  application_id?: string
}
