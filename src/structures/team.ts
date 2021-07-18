import type { Client } from '../client/mod.ts'
import type {
  TeamPayload,
  TeamMemberPayload,
  MembershipState
} from '../types/team.ts'
import { SnowflakeBase } from './base.ts'
import { User } from './user.ts'

export class TeamMember extends User {
  membershipState: MembershipState
  permissions: string[]
  team: Team

  constructor(client: Client, data: TeamMemberPayload, team: Team) {
    super(client, data.user)

    this.permissions = data.permissions
    this.membershipState = data.membership_state
    this.team = team
  }
}

export class Team extends SnowflakeBase {
  id: string
  name: string
  icon: string
  owner: TeamMember
  members: TeamMember[]

  constructor(client: Client, data: TeamPayload) {
    super(client, data)

    this.id = data.id
    this.name = data.name
    this.icon = data.icon
    this.members = data.members.map(
      (member) => new TeamMember(client, member, this)
    )
    this.owner = this.members.find(
      (member) => member.id === data.owner_user_id
    )!
  }
}
