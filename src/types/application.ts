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
}
