import { ChannelPayload } from "../channels/base.ts";
import { EmbedPayload } from "../channels/embed.ts";
import { AllowedMentionsPayload } from "../channels/etc.ts";
import { AttachmentPayload } from "../channels/message.ts";
import { GuildPayload } from "../guilds/guild.ts";
import { ComponentPayload } from "../interactions/components.ts";
import { UserPayload } from "../users/user.ts";

export interface WebhookPayload {
  id: string;
  type: WebhookType;
  guild_id?: string | null;
  channel_id: string | null;
  user?: UserPayload;
  name: string | null;
  avatar: string | null;
  token?: string;
  application_id: string | null;
  source_guild?: GuildPayload;
  source_channel?: ChannelPayload;
  url?: string;
}

export enum WebhookType {
  INCOMING = 1,
  CHANNEL_FOLLOWER = 2,
  APPLICATION = 3,
}

export interface CreateWebhookPayload {
  // Fun fact: name cannot be 'clyde'
  name: string;
  avatar?: string | null;
}

export interface EditWebhookPayload {
  name: string;
  avatar: string | null;
  channel_id: string;
}

export interface ExecuteWebhookParams {
  wait?: boolean;
  thread_id?: string;
}

export interface ExecuteWebhookPayload {
  content?: string;
  username?: string;
  avatar_url?: string;
  tts?: boolean;
  embeds?: EmbedPayload[];
  allowed_mentions?: AllowedMentionsPayload[];
  components?: ComponentPayload[];
  attachments?: AttachmentPayload[];
  flags?: number;
  thread_name?: string;
}

export type ExecuteSlackCompatibleWebhookParams = ExecuteWebhookParams;
export type ExecuteGitHubCompatibleWebhookParams = ExecuteWebhookParams;

export interface GetWebhookMessageParams {
  thread_id?: string;
}

export type EditWebhookMessageParams = GetWebhookMessageParams;
export interface EditWebhookMessagePayload {
  content?: string | null;
  embeds?: EmbedPayload[] | null;
  allowed_mentions?: AllowedMentionsPayload[] | null;
  components?: ComponentPayload[] | null;
  attachments?: AttachmentPayload[] | null;
}

export type DeleteWebhookMessageParams = GetWebhookMessageParams;
