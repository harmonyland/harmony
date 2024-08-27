import { snowflake } from "../common.ts";
import { Reasonable } from "../etc/reasonable.ts";
import { UserPayload } from "../users/user.ts";

export interface GuildBanPayload {
  reason: null | string;
  user: UserPayload;
}

export interface CreateGuildBanPayload extends Reasonable {
  delete_message_seconds?: number;
}

export interface GetGuildBansParams {
  after?: snowflake;
  before?: snowflake;
  limit?: number;
}

export interface CreateBulkGuildBanPayload extends Reasonable {
  delete_message_seconds?: number;
  user_ids: snowflake[];
}

export interface BulkGuildBanResponsePayload {
  banned_users: snowflake[];
  failed_users: snowflake[];
}
