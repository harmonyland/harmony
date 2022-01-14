export interface GuildBanPayload {
  // user: UserPayload;
  reason: string | null;
}

export interface CreateGuildBanPayload {
  delete_message_days?: number;
}
