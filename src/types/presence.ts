export interface ClientStatus {
  desktop?: StatusType
  mobile?: StatusType
  web?: StatusType
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

export interface ActivityTimestamps {
  start?: number
  end?: number
}

export interface ActivityEmoji {
  name: string
  id?: string
  animated?: boolean
}

export interface ActivityParty {
  id?: string
  size?: number[]
}

export interface ActivityAssets {
  large_image?: string
  large_text?: string
  small_image?: string
  small_text?: string
}

export interface ActivitySecrets {
  join?: string
  spectate?: string
  match?: string
}

export enum ActivityFlags {
  INSTANCE = 1 << 0,
  JOIN = 1 << 1,
  SPECTATE = 1 << 2,
  JOIN_REQUEST = 1 << 3,
  SYNC = 1 << 4,
  PLAY = 1 << 5
}

export type ActivityType =
  | 'PLAYING'
  | 'STREAMING'
  | 'LISTENING'
  | 'WATCHING'
  | 'CUSTOM_STATUS'
  | 'COMPETING'
export type StatusType = 'online' | 'invisible' | 'offline' | 'idle' | 'dnd'

export interface ActivityGame {
  name: string
  type: 0 | 1 | 2 | 3 | 4 | 5 | ActivityType
  url?: string
}

export interface ClientActivity {
  status?: StatusType
  activity?: ActivityGame | ActivityGame[]
  since?: number | null
  afk?: boolean
}
