import { UserPayload } from "../users/user.ts";

export interface GuildBanPayload {
  user: UserPayload;
  reason: string | null;
}

export interface CreateGuildBanPayload {
  delete_message_seconds?: number;
}

export interface GetGuildBansParams {
  limit?: number;
  before?: string;
  after?: string;
}
