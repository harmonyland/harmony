import { snowflake } from "../common.ts";
import { Reasonable } from "../etc/reasonable.ts";
import { UserPayload } from "../users/user.ts";

export interface GuildBanPayload {
  user: UserPayload;
  reason: string | null;
}

export interface CreateGuildBanPayload extends Reasonable {
  delete_message_seconds?: number;
}

export interface GetGuildBansParams {
  limit?: number;
  before?: snowflake;
  after?: snowflake;
}

export interface CreateBulkGuildBanPayload extends Reasonable {
  user_ids: snowflake[];
  delete_message_seconds?: number;
}

export interface BulkGuildBanResponsePayload {
  banned_users: snowflake[];
  failed_users: snowflake[];
}
