import { UserPayload } from './user.ts'

export interface PresenceUpdatePayload {
  user: UserPayload
  guild_id: string
  status: string
  activities: ActivityPayload
  client_status: ClientStatus
}

interface ClientStatus {
  desktop?: string
  mobile?: string
  web?: string
}

export interface ActivityPayload {
  name: string
  type: 0 | 1 | 2 | 3 | 4 | 5
  url?: string | undefined
  created_at: number
  timestamps?: ActivityTimestamps
  application_id?: string
  details?: string | undefined
  state?: string | undefined
  emoji?: ActivityEmoji
  party?: ActivityParty
  assets?: ActivityAssets
  secrets?: ActivitySecrets
  instance?: boolean
  flags?: number
}

interface ActivityTimestamps {
  start?: number
  end?: number
}

interface ActivityEmoji {
  name: string
  id?: string
  animated?: boolean
}

interface ActivityParty {
  id?: string
  size?: number[]
}

interface ActivityAssets {
  large_image?: string
  large_text?: string
  small_image?: string
  small_text?: string
}

interface ActivitySecrets {
  join?: string
  spectate?: string
  match?: string
}

enum ActivityFlags {
  INSTANCE = 1 << 0,
  JOIN = 1 << 1,
  SPECTATE = 1 << 2,
  JOIN_REQUEST = 1 << 3,
  SYNC = 1 << 4,
  PLAY = 1 << 5
}
