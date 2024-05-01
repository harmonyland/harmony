import { ApplicationPayload } from "../applications/application.ts";
import { snowflake } from "../common.ts";
import { InviteTargetType } from "../invites/invite.ts";
import { UserPayload } from "../users/user.ts";

export interface GatewayInviteCreatePayload {
  channel_id: snowflake;
  code: string;
  created_at: string;
  guild_id?: snowflake;
  inviter?: UserPayload;
  max_age: number;
  max_uses: number;
  target_type?: InviteTargetType;
  target_user?: UserPayload;
  target_application?: ApplicationPayload;
  temporary: boolean;
  uses: number;
}

export interface GatewayInviteDeletePayload {
  channel_id: snowflake;
  guild_id?: snowflake;
  code: string;
}
