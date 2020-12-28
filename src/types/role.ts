export interface RolePayload {
  id: string
  name: string
  color: number
  hoist: boolean
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
