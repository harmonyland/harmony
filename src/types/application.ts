import type { UserPayload } from './user.ts'
import type { TeamPayload } from './team.ts'

export interface ApplicationPayload {
  id: string
  name: string
  icon: string
  description: string
  summary: string
  bot?: UserPayload
  team: TeamPayload | null
  rpc_origins?: string[]
  bot_public: boolean
  bot_require_code_grant: boolean
  terms_of_service_url?: string
  privacy_policy_url?: string
  owner?: UserPayload
  verify_key?: string
  guild_id?: string
  primary_sku_id?: string
  slug?: string
  cover_image?: string
  flags?: number
}

export const ApplicationFlags = {
  GATEWAY_PRESENCE: 1 << 12,
  GATEWAY_PRESENCE_LIMITED: 1 << 13,
  GATEWAY_GUILD_MEMBERS: 1 << 14,
  GATEWAY_GUILD_MEMBERS_LIMITED: 1 << 15,
  VERIFICATION_PENDING_GUILD_LIMIT: 1 << 16,
  EMBEDDED: 1 << 17
} as const
