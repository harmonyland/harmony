export interface RolePayload {
  id: string
  name: string
  color: number
  hoist: boolean
  icon?: string
  unicode_emoji?: string
  position: number
  permissions: string
  managed: boolean
  mentionable: boolean
  tags?: RoleTagsPayload
}

export interface RoleTagsPayload {
  /** The id of the bot who has this role */
  bot_id?: string
  /** Whether this is the premium subscriber role for this guild */
  premium_subscriber?: null
  /** The id of the integration this role belongs to */
  integration_id?: string
}

export interface RoleModifyPayload {
  name?: string | null
  permissions?: string | null
  color?: number | null
  hoist?: boolean | null
  icon?: string | null
  unicodeEmoji?: string | null
  mentionable?: boolean | null
}
