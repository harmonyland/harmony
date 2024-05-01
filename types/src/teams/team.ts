import { snowflake } from "../common.ts";
import { UserPayload } from "../users/user.ts";

export interface TeamPayload {
  icon: string | null;
  id: snowflake;
  members: TeamMemberPayload[];
  name: string;
  owner_user_id: snowflake;
}

export interface TeamMemberPayload {
  membership_state: MembershipState;
  team_id: snowflake;
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
