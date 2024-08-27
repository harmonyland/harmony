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
  guild_id: snowflake;
  id: snowflake;
  name: string;
  type: ChannelType;
}

/** @link https://discord.com/developers/docs/resources/channel#attachment-object-attachment-structure */
export interface AttachmentPayload {
  content_type?: string;
  description?: string;
  duration_secs?: number;
  ephemeral?: boolean;
  filename: string;
  flags?: number;
  height?: number;
  id: snowflake;
  proxy_url: string;
  size: number;
  url: string;
  waveform?: string;
  width?: number;
}

export enum AttachmentFlags {
  IS_REMIX = 1 << 2,
}

/** @link https://discord.com/developers/docs/resources/channel#reaction-object-reaction-structure */
export interface ReactionPayload {
  burst_colors: string[];
  count: number;
  count_details: ReactionCountDetailsPayload;
  emoji: EmojiPayload;
  me: boolean;
  me_burst: boolean;
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
  party_id?: string;
  type: MessageActivityType;
}

/** @link https://discord.com/developers/docs/resources/channel#message-reference-object */
export interface MessageReferencePayload {
  channel_id?: snowflake;
  fail_if_not_exists?: boolean;
  guild_id?: snowflake;
  message_id?: snowflake;
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
  is_renewal: boolean;
  role_subscription_listing_id: snowflake;
  tier_name: string;
  total_months_subscribed: number;
}

// https://discord.com/developers/docs/resources/channel#message-object-message-structure
export interface MessagePayload {
  activity?: MessageActivityPayload;
  application?: ApplicationPayload;
  application_id?: snowflake;
  attachments?: AttachmentPayload[];
  author: UserPayload;
  channel_id: snowflake;
  components?: ComponentPayload[];
  content?: string; // Check second note on https://discord.com/developers/docs/resources/channel#message-object-message-structure
  edited_timestamp: null | string;
  embeds?: EmbedPayload[];
  flags?: number;
  guild_id?: snowflake;
  id: snowflake;
  interaction?: MessageInteractionPayload;
  interaction_metadata?: MessageInteractionMetadataPayload;
  member?: GuildMemberPayload;
  mention_channels?: ChannelMentionPayload[];
  mention_everyone: boolean;
  mention_roles: string[];
  mentions: UserPayload[];
  message_reference?: MessageReferencePayload;
  nonce?: number | string;
  pinned: boolean;
  poll?: PollCreateRequestPayload;
  position?: number;
  reactions?: ReactionPayload[];
  referenced_message?: MessagePayload | null;
  resolved?: ResolvedDataPayload;
  role_subscription_data?: RoleSubscriptionDataPayload;
  sticker_items?: StickerItemPayload[];
  thread?: GuildThreadChannelPayload;
  timestamp: string;
  tts: boolean;
  type: MessageType;
  webhook_id?: snowflake;
}

export interface MessageInteractionMetadataPayload {
  authorizing_integration_owners: Record<ApplicationIntegrationType, string[]>;
  id: snowflake;
  interacted_message_id?: snowflake;
  original_response_message_id?: snowflake;
  triggering_interaction_metadata?: MessageInteractionMetadataPayload;
  type: InteractionType;
  user: UserPayload;
}

export interface GetChannelMessagesParams {
  after?: snowflake;
  around?: snowflake;
  before?: snowflake;
  limit?: number;
}

export interface CreateMessagePayload {
  allowed_mentions?: AllowedMentionsPayload;
  attachments?: AttachmentPayload[];
  components: ComponentPayload[];
  content: string;
  embeds?: EmbedPayload[];
  enforce_nonce?: boolean;
  file?: AttachmentPayload;
  flags?: number;
  message_reference?: MessageReferencePayload;
  nonce?: number | string;
  poll?: PollCreateRequestPayload;
  sticker_ids?: snowflake[];
  tts?: boolean;
}

export interface GetMessageReactionParams {
  after?: snowflake;
  limit?: number;
}

export interface EditMessagePayload {
  allowed_mentions?: AllowedMentionsPayload | null;
  attachments?: AttachmentPayload[] | null;
  components?: ComponentPayload[] | null;
  content?: null | string;
  embeds?: EmbedPayload[] | null;
  file?: AttachmentPayload | null;
  flags?: null | number;
}

export interface BulkDeleteMessagesPayload extends Reasonable {
  messages: snowflake[];
}
