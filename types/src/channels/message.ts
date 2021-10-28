import { ChannelType } from "./base.ts";
import { EmbedPayload } from "./embed.ts";
import { GuildThreadChannelPayload } from "./thread.ts";

// https://discord.com/developers/docs/resources/channel#channel-mention-object-channel-mention-structure
export interface ChannelMentionPayload {
  id: string;
  guild_id: string;
  type: ChannelType;
  name: string;
}

// https://discord.com/developers/docs/resources/channel#attachment-object-attachment-structure
export interface AttachmentPayload {
  id: string;
  filename: string;
  content_type: string;
  size: number;
  url: string;
  proxy_url: string;
  height?: number;
  width?: number;
}

// https://discord.com/developers/docs/resources/channel#reaction-object-reaction-structure
export interface ReactionPayload {
  count: number;
  me: boolean;
  // emoji: EmojiPayload;
}

// https://discord.com/developers/docs/resources/channel#message-object-message-types
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
}

// https://discord.com/developers/docs/resources/channel#message-object-message-activity-types
export enum MessageActivityType {
  JOIN = 1,
  SPECTATE = 2,
  LISTEN = 3,
  JOIN_REQUEST = 5,
}

// https://discord.com/developers/docs/resources/channel#message-object-message-activity-structure
export interface MessageActivityPayload {
  type: MessageActivityType;
  party_id?: string;
}

// https://discord.com/developers/docs/resources/channel#message-reference-object
export interface MessageReferencePayload {
  message_id?: string;
  channel_id?: string;
  guild_id?: string;
  fail_if_not_exists?: string;
}

// https://discord.com/developers/docs/resources/channel#message-object-message-flags
export enum MessageFlags {
  CROSSPOSTED = 1,
  IS_CROSSPOST = 2,
  SUPPRESS_EMBEDS = 4,
  SOURCE_MESSAGE_DELETED = 8,
  URGENT = 16,
  HAS_THREAD = 32,
  EPHEMERAL = 64,
  LOADING = 128,
}

// https://discord.com/developers/docs/resources/channel#message-object-message-structure
export interface Message {
  id: string;
  channel_id: string;
  guild_id: string;
  // author: UserPayload;
  // member?: MemberPayload;
  content: string;
  timestamp: string;
  edited_timestamp: string | null;
  tts: boolean;
  mention_everyone: boolean;
  // mentions: UserPayload[];
  mention_roles: string[];
  mention_channels?: ChannelMentionPayload[];
  attachments: AttachmentPayload[];
  embeds: EmbedPayload[];
  reactions?: ReactionPayload[];
  nonce?: string | number;
  pinned: boolean;
  webhook_id?: string;
  type: MessageType;
  activity?: MessageActivityPayload;
  // application?: ApplicationPayload;
  application_id?: string;
  message_reference?: MessageReferencePayload;
  flags?: MessageFlags;
  referenced_message?: Message | null;
  // interaction?: MessageInteractionPayload;
  thread?: GuildThreadChannelPayload;
  // components?: MessageComponentPayload[];
  // sticker_items?: StickerItemPayload[];
}

export interface GetChannelMessagesParams {
  around?: string;
  before?: string;
  after?: string;
  limit?: number;
}

export interface AllowedMentionsPayload {
  parse?: string[];
  roles?: string[];
  users?: string[];
  replied_user?: boolean;
}

export interface CreateMessagePayload {
  content: string;
  tts?: boolean;
  file?: AttachmentPayload;
  files?: AttachmentPayload[];
  embeds?: EmbedPayload[];
  allowed_mentions?: AllowedMentionsPayload;
  message_reference?: MessageReferencePayload;
  // components: MessageComponentPayload[];
  sticker_ids?: string[];
}

export interface GetMessageReactionParams {
  after?: string;
  limit?: number;
}

export interface EditMessagePayload {
  content?: string | null;
  embeds?: EmbedPayload[] | null;
  flags?: MessageFlags | null;
  file?: AttachmentPayload | null;
  allowed_mentions?: AllowedMentionsPayload | null;
  attachments?: AttachmentPayload[] | null;
  // components?: MessageComponentPayload[] | null;
}

export interface BulkDeleteMessagesPayload {
  messages: string[];
  reason?: string;
}
