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
  permissions: ["*"];
  team_id: string;
  user: UserPayload;
}

export enum MembershipState {
  INVITED = 1,
  ACCEPTED = 2,
}
