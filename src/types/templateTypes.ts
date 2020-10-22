import { Guild } from '../structures/guild.ts'
import { User } from '../structures/user.ts'

export interface TemplatePayload {
  code: string
  name: string
  description: string | undefined
  usage_count: number
  creator_id: string
  creator: User
  created_at: string
  updated_at: string
  source_guild_id: string
  serialized_source_guild: Guild
  is_dirty: boolean | undefined
}
