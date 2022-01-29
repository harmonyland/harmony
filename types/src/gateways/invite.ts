import { ApplicationPayload } from "../applications/application.ts";
import { InviteTargetType } from "../invites/intive.ts";
import { UserPayload } from "../users/user.ts";

export interface GatewayInviteCreatePayload {
  channel_id: string;
  code: string;
  created_at: string;
  guild_id?: string;
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
  channel_id: string;
  guild_id?: string;
  code: string;
}
