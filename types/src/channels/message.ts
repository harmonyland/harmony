import {
  ApplicationIntegrationType,
  ApplicationPayload,
} from "../applications/application.ts";
import { snowflake } from "../common.ts";
import { EmojiPayload } from "../emojis/emoij.ts";
import { Reasonable } from "../etc/reasonable.ts";
import { GuildMemberPayload } from "../guilds/member.ts";
import { InteractionType } from "../interactions/interaction.ts";
import { ResolvedDataPayload } from "../interactions/interaction.ts";
import {
  ComponentPayload,
  MessageInteractionPayload,
} from "../interactions/mod.ts";
import { PollCreateRequestPayload } from "../poll/poll.ts";
import { StickerItemPayload } from "../stickers/sticker.ts";
import { UserPayload } from "../users/user.ts";
import { ChannelType } from "./base.ts";
import { EmbedPayload } from "./embed.ts";
import { AllowedMentionsPayload } from "./etc.ts";
import { GuildThreadChannelPayload } from "./thread.ts";

/** @link https://discord.com/developers/docs/resources/channel#channel-mention-object-channel-mention-structure */
export interface ChannelMentionPayload {
  id: snowflake;
  guild_id: snowflake;
  type: ChannelType;
  name: string;
}

/** @link https://discord.com/developers/docs/resources/channel#attachment-object-attachment-structure */
export interface AttachmentPayload {
  id: snowflake;
  filename: string;
  description?: string;
  content_type?: string;
  size: number;
  url: string;
  proxy_url: string;
  height?: number;
  width?: number;
  ephemeral?: boolean;
  duration_secs?: number;
  waveform?: string;
  flags?: number;
}

export enum AttachmentFlags {
  IS_REMIX = 1 << 2,
}

/** @link https://discord.com/developers/docs/resources/channel#reaction-object-reaction-structure */
export interface ReactionPayload {
  count: number;
  count_details: ReactionCountDetailsPayload;
  me: boolean;
  me_burst: boolean;
  emoji: EmojiPayload;
  burst_colors: string[];
}

export interface ReactionCountDetailsPayload {
  burst: number;
  normal: number;
}

/** @link https://discord.com/developers/docs/resources/channel#message-object-message-types */
export enum MessageType {
  DEFAULT = 0,
  RECIPIENT_ADD = 1,
  RECIPIENT_REMOVE = 2,
  CALL = 3,
  CHANNEL_NAME_CHANGE = 4,
  CHANNEL_ICON_CHANGE = 5,
  CHANNEL_PINNED_MESSAGE = 6,
  GUILD_MEMBER_JOIN = 7,
  USER_PREMIUM_GUILD_SUBSCRIPTION = 8,
  USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_1 = 9,
  USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_2 = 10,
  USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_3 = 11,
  CHANNEL_FOLLOW_ADD = 12,
  GUILD_DISCOVERY_DISQUALIFIED = 14,
  GUILD_DISCOVERY_REQUALIFIED = 15,
  GUILD_DISCOVERY_GRACE_PERIOD_INITIAL_WARNING = 16,
  GUILD_DISCOVERY_GRACE_PERIOD_FINAL_WARNING = 17,
  THREAD_CREATED = 18,
  REPLY = 19,
  APPLICATION_COMMAND = 20,
  THREAD_STARTER_MESSAGE = 21,
  GUILD_INVITE_REMINDER = 22,
  CONTEXT_MENU_COMMAND = 23,
  AUTO_MODERATION_ACTION = 24,
  ROLE_SUBSCRIPTION_PURCHASE = 25,
  INTERACTION_PREMIUM_UPSELL = 26,
  STAGE_START = 27,
  STAGE_END = 28,
  STAGE_SPEAKER = 29,
  STAGE_TOPIC = 31,
  GUILD_APPLICATION_PREMIUM_SUBSCRIPTION = 32,
}

/** @link https://discord.com/developers/docs/resources/channel#message-object-message-activity-types */
export enum MessageActivityType {
  JOIN = 1,
  SPECTATE = 2,
  LISTEN = 3,
  JOIN_REQUEST = 5,
}

/** @link https://discord.com/developers/docs/resources/channel#message-object-message-activity-structure */
export interface MessageActivityPayload {
  type: MessageActivityType;
  party_id?: string;
}

/** @link https://discord.com/developers/docs/resources/channel#message-reference-object */
export interface MessageReferencePayload {
  message_id?: snowflake;
  channel_id?: snowflake;
  guild_id?: snowflake;
  fail_if_not_exists?: boolean;
}

/** @link https://discord.com/developers/docs/resources/channel#message-object-message-flags */
export enum MessageFlags {
  CROSSPOSTED = 1,
  IS_CROSSPOST = 2,
  SUPPRESS_EMBEDS = 4,
  SOURCE_MESSAGE_DELETED = 8,
  URGENT = 16,
  HAS_THREAD = 32,
  EPHEMERAL = 64,
  LOADING = 128,
  FAILED_TO_MENTION_SOME_ROLES_IN_THREAD = 256,
  SUPPRESS_NOTIFICATIONS = 4096,
  IS_VOICE_MESSAGE = 8192,
}

export interface RoleSubscriptionDataPayload {
  role_subscription_listing_id: snowflake;
  tier_name: string;
  total_months_subscribed: number;
  is_renewal: boolean;
}

// https://discord.com/developers/docs/resources/channel#message-object-message-structure
export interface MessagePayload {
  id: snowflake;
  channel_id: snowflake;
  guild_id?: snowflake;
  author: UserPayload;
  member?: GuildMemberPayload;
  content?: string; // Check second note on https://discord.com/developers/docs/resources/channel#message-object-message-structure
  timestamp: string;
  edited_timestamp: string | null;
  tts: boolean;
  mention_everyone: boolean;
  mentions: UserPayload[];
  mention_roles: string[];
  mention_channels?: ChannelMentionPayload[];
  attachments?: AttachmentPayload[];
  embeds?: EmbedPayload[];
  reactions?: ReactionPayload[];
  nonce?: string | number;
  pinned: boolean;
  webhook_id?: snowflake;
  type: MessageType;
  activity?: MessageActivityPayload;
  application?: ApplicationPayload;
  application_id?: snowflake;
  message_reference?: MessageReferencePayload;
  flags?: number;
  referenced_message?: MessagePayload | null;
  interaction?: MessageInteractionPayload;
  interaction_metadata?: MessageInteractionMetadataPayload;
  thread?: GuildThreadChannelPayload;
  components?: ComponentPayload[];
  sticker_items?: StickerItemPayload[];
  position?: number;
  role_subscription_data?: RoleSubscriptionDataPayload;
  resolved?: ResolvedDataPayload;
  poll?: PollCreateRequestPayload;
}

export interface MessageInteractionMetadataPayload {
  id: snowflake;
  type: InteractionType;
  user: UserPayload;
  authorizing_integration_owners: Record<ApplicationIntegrationType, string[]>;
  original_response_message_id?: snowflake;
  interacted_message_id?: snowflake;
  triggering_interaction_metadata?: MessageInteractionMetadataPayload;
}

export interface GetChannelMessagesParams {
  around?: snowflake;
  before?: snowflake;
  after?: snowflake;
  limit?: number;
}

export interface CreateMessagePayload {
  content: string;
  nonce?: number | string;
  tts?: boolean;
  embeds?: EmbedPayload[];
  allowed_mentions?: AllowedMentionsPayload;
  message_reference?: MessageReferencePayload;
  components: ComponentPayload[];
  sticker_ids?: snowflake[];
  file?: AttachmentPayload;
  attachments?: AttachmentPayload[];
  flags?: number;
  enforce_nonce?: boolean;
  poll?: PollCreateRequestPayload;
}

export interface GetMessageReactionParams {
  after?: snowflake;
  limit?: number;
}

export interface EditMessagePayload {
  content?: string | null;
  embeds?: EmbedPayload[] | null;
  flags?: number | null;
  file?: AttachmentPayload | null;
  allowed_mentions?: AllowedMentionsPayload | null;
  attachments?: AttachmentPayload[] | null;
  components?: ComponentPayload[] | null;
}

export interface BulkDeleteMessagesPayload extends Reasonable {
  messages: snowflake[];
}
