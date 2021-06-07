import type { UserPayload } from './user.ts'

export interface TeamPayload {
  id: string
  name: string
  icon: string
  owner_user_id: string
  members: TeamMemberPayload[]
}

export interface TeamMemberPayload {
  membership_state: MembershipState
  permissions: string[]
  team_id: string
  user: UserPayload
}

export enum MembershipState {
  INVITED = 1,
  ACCEPTED = 2
}
