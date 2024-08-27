import { ChannelPayload } from "../channels/base.ts";
import { EmbedPayload } from "../channels/embed.ts";
import { AllowedMentionsPayload } from "../channels/etc.ts";
import { AttachmentPayload } from "../channels/message.ts";
import { snowflake } from "../common.ts";
import { GuildPayload } from "../guilds/guild.ts";
import { ComponentPayload } from "../interactions/components.ts";
import { PollPayload } from "../poll/poll.ts";
import { UserPayload } from "../users/user.ts";

export interface WebhookPayload {
  application_id: null | snowflake;
  avatar: null | string;
  channel_id: null | snowflake;
  guild_id?: null | snowflake;
  id: snowflake;
  name: null | string;
  source_channel?: ChannelPayload;
  source_guild?: GuildPayload;
  token?: string;
  type: WebhookType;
  url?: string;
  user?: UserPayload;
}

export enum WebhookType {
  INCOMING = 1,
  CHANNEL_FOLLOWER = 2,
  APPLICATION = 3,
}

export interface CreateWebhookPayload {
  avatar?: null | string;
  // Fun fact: name cannot include 'clyde' or 'discord' in it
  name: string;
}

export interface EditWebhookPayload {
  avatar: null | string;
  channel_id: snowflake;
  name: string;
}

export interface ExecuteWebhookParams {
  thread_id?: snowflake;
  wait?: boolean;
}

export interface ExecuteWebhookPayload {
  allowed_mentions?: AllowedMentionsPayload[];
  applied_tags?: snowflake[];
  attachments?: AttachmentPayload[];
  avatar_url?: string;
  components?: ComponentPayload[];
  content?: string;
  embeds?: EmbedPayload[];
  flags?: number;
  poll?: PollPayload;
  thread_name?: string;
  tts?: boolean;
  username?: string;
}

export type ExecuteSlackCompatibleWebhookParams = ExecuteWebhookParams;
export type ExecuteGitHubCompatibleWebhookParams = ExecuteWebhookParams;

export interface GetWebhookMessageParams {
  thread_id?: snowflake;
}

export type EditWebhookMessageParams = GetWebhookMessageParams;
export interface EditWebhookMessagePayload {
  allowed_mentions?: AllowedMentionsPayload[] | null;
  attachments?: AttachmentPayload[] | null;
  components?: ComponentPayload[] | null;
  content?: null | string;
  embeds?: EmbedPayload[] | null;
}

export type DeleteWebhookMessageParams = GetWebhookMessageParams;
