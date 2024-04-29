import { UserPayload } from "../users/user.ts";

export interface TeamPayload {
  icon: string | null;
  id: string;
  members: TeamMemberPayload[];
  name: string;
  owner_user_id: string;
}

export interface TeamMemberPayload {
  membership_state: MembershipState;
  team_id: string;
  user: UserPayload;
  role: string;
}

export enum MembershipState {
  INVITED = 1,
  ACCEPTED = 2,
}

export enum TeamMemberRole {
  OWNER = "",
  ADMIN = "admin",
  DEVELOPER = "developer",
  READ_ONLY = "read_only",
}
