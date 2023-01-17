import type { Embed } from '../structures/embed.ts'
import type { Member } from '../structures/member.ts'
import type { Message, MessageAttachment } from '../structures/message.ts'
import type { Role } from '../structures/role.ts'
import type { Permissions } from '../utils/permissions.ts'
import type { EmojiPayload } from './emoji.ts'
import type { MemberPayload } from './guild.ts'
import type { InteractionType } from './interactions.ts'
import type { UserPayload } from './user.ts'
import type {
  MessageComponentData,
  MessageComponentPayload
} from './messageComponents.ts'
import type { Emoji } from '../structures/emoji.ts'
import type { GuildForumTag } from '../structures/guildForumChannel.ts'

export interface ChannelPayload {
  id: string
  type: ChannelTypes
  flags: number
}

export interface TextChannelPayload extends ChannelPayload {
  last_message_id?: string
  last_pin_timestamp?: string
}

export interface GuildChannelPayload extends ChannelPayload {
  guild_id: string
  name: string
  position: number
  permission_overwrites: OverwritePayload[]
  nsfw: boolean
  parent_id?: string
}

export interface GuildTextBasedChannelPayload
  extends TextChannelPayload,
    GuildChannelPayload {}

export interface GuildThreadAvailableChannelPayload
  extends GuildChannelPayload {
  topic?: string
  rate_limit_per_user: number
  default_thread_rate_limit_per_user?: number
  default_auto_archive_duration?: number
}

export enum ChannelFlags {
  PINNED = 1 << 1,
  REQUIRE_TAG = 1 << 4
}

export interface ThreadChannelPayload
  extends TextChannelPayload,
    GuildChannelPayload {
  message_count: number
  member_count: number
  member?: ThreadMemberPayload
  thread_metadata: ThreadMetadataPayload
  rate_limit_per_user: number
  owner_id: string
  total_message_sent: number
  applied_tags?: string[]
}

export interface GuildTextChannelPayload
  extends GuildTextBasedChannelPayload,
    GuildThreadAvailableChannelPayload {}

export interface GuildNewsChannelPayload
  extends GuildTextBasedChannelPayload,
    GuildThreadAvailableChannelPayload {}

export interface GuildVoiceChannelPayload
  extends GuildChannelPayload,
    GuildTextBasedChannelPayload {
  bitrate: string
  user_limit: number
  video_quality_mode: number
}

export interface GuildStageChannelPayload
  extends Omit<GuildVoiceChannelPayload, 'video_quality_mode'> {}

export interface GuildForumTagPayload {
  id: string
  name: string
  moderated: boolean
  emoji_id: string
  emoji_name: string | null
}

export interface GuildForumDefaultReactionPayload {
  emoji_id: string | null
  emoji_name: string | null
}

export enum GuildForumSortOrderTypes {
  LATEST_ACTIVITY = 0,
  CREATION_DATE = 1
}

export interface GuildForumChannelPayload
  extends GuildThreadAvailableChannelPayload {
  available_tags: GuildForumTagPayload[]
  default_reaction_emoji: GuildForumDefaultReactionPayload | null
  default_sort_order: GuildForumSortOrderTypes | null
}

export interface DMChannelPayload extends TextChannelPayload {
  recipients: UserPayload[]
}

export interface GroupDMChannelPayload extends DMChannelPayload {
  name: string
  icon?: string
  owner_id: string
}

export interface GuildCategoryChannelPayload
  extends ChannelPayload,
    GuildChannelPayload {}

export interface ModifyChannelPayload {
  name?: string
  position?: number | null
  permission_overwrites?: OverwritePayload[] | null
  parent_id?: string
  nsfw?: boolean | null
}

export interface ModifyGuildCategoryChannelPayload
  extends ModifyChannelPayload {}

export interface ModifyGuildTextBasedChannelPayload
  extends ModifyChannelPayload {
  type?: number
}

export interface ModifyGuildThreadAvailableChannelPayload
  extends ModifyChannelPayload {
  topic?: string | null
  rate_limit_per_user?: number | null
  default_thread_rate_limit_per_user?: number | null
  default_auto_archive_duration?: number | null
}

export interface ModifyGuildTextChannelPayload
  extends ModifyGuildTextBasedChannelPayload,
    ModifyGuildThreadAvailableChannelPayload {}

export interface ModifyThreadChannelPayload
  extends ModifyGuildTextBasedChannelPayload {
  archived?: boolean
  auto_archive_duration?: number
  locked?: boolean
}

export interface ModifyGuildNewsChannelPayload
  extends ModifyGuildTextBasedChannelPayload,
    ModifyGuildThreadAvailableChannelPayload {}

export interface ModifyVoiceChannelPayload
  extends ModifyChannelPayload,
    ModifyGuildTextBasedChannelPayload {
  bitrate?: number | null
  user_limit?: number | null
}

export interface ModifyGuildForumChannelPayload
  extends ModifyGuildThreadAvailableChannelPayload {
  default_reaction_emoji?: GuildForumDefaultReactionPayload | null
  default_sort_order?: GuildForumSortOrderTypes | null
  available_tags?: GuildForumTagPayload[] | null
}

export interface ModifyChannelOption {
  name?: string
  position?: number | null
  permissionOverwrites?: OverwritePayload[] | null
  parentID?: string
  nsfw?: boolean | null
}

export interface ModifyGuildCategoryChannelOption extends ModifyChannelOption {}

export interface ModifyGuildTextBasedChannelOption extends ModifyChannelOption {
  type?: number
}

export interface ModifyGuildThreadAvailableChannelOption
  extends ModifyChannelOption {
  topic?: string | null
  slowmode?: number | null
  defaultThreadSlowmode?: number | null
  defaultAutoArchiveDuration?: number | null
}

export interface ModifyGuildTextChannelOption
  extends ModifyGuildTextBasedChannelOption,
    ModifyGuildThreadAvailableChannelOption {}

export interface ModifyThreadChannelOption
  extends ModifyGuildTextChannelOption {
  archived?: boolean
  autoArchiveDuration?: number
  locked?: boolean
}

export interface ModifyGuildNewsChannelOption
  extends ModifyGuildTextBasedChannelOption,
    ModifyGuildThreadAvailableChannelOption {}

export interface ModifyVoiceChannelOption
  extends ModifyChannelOption,
    ModifyGuildTextBasedChannelOption {
  bitrate?: number | null
  userLimit?: number | null
}

export interface ModifyGuildForumChannelOption
  extends ModifyGuildThreadAvailableChannelOption {
  defaultReactionEmoji?: Emoji | GuildForumDefaultReactionPayload | null
  defaultSortOrder?: GuildForumSortOrderTypes | null
  availableTags?: GuildForumTag[] | GuildForumTagPayload[] | null
}

export enum OverwriteType {
  ROLE = 0,
  USER = 1
}

export interface OverwritePayload {
  id: string
  type: OverwriteType
  allow: string
  deny: string
}

export interface Overwrite {
  id: string | Role | Member
  type: OverwriteType
  allow: Permissions
  deny: Permissions
}

export interface OverwriteAsOptions {
  id: string | Role | Member
  type?: OverwriteType
  allow?: string | Permissions
  deny?: string | Permissions
}

export type OverwriteAsArg = OverwriteAsOptions | OverwritePayload

export enum OverrideType {
  ADD = 0,
  REMOVE = 1,
  REPLACE = 2
}

export enum ChannelTypes {
  GUILD_TEXT = 0,
  DM = 1,
  GUILD_VOICE = 2,
  GROUP_DM = 3,
  GUILD_CATEGORY = 4,
  GUILD_NEWS = 5,
  GUILD_STORE = 6,
  NEWS_THREAD = 10,
  PUBLIC_THREAD = 11,
  PRIVATE_THREAD = 12,
  GUILD_STAGE_VOICE = 13,
  GUILD_DIRECTORY = 14,
  GUILD_FORUM = 15
}

export interface MessagePayload {
  id: string
  channel_id: string
  guild_id?: string
  author: UserPayload
  member?: MemberPayload
  content: string
  timestamp: string
  edited_timestamp?: string
  tts: boolean
  mention_everyone: boolean
  mentions: UserPayload[]
  mention_roles: string[]
  mention_channels?: ChannelMention[]
  attachments: Attachment[]
  embeds: EmbedPayload[]
  reactions?: Reaction[]
  nonce?: number | string
  pinned: boolean
  webhook_id?: string
  type: number
  activity?: MessageActivity
  application?: MessageApplication
  message_reference?: MessageReference
  referenced_message?: MessagePayload
  flags?: number
  sticker_items?: MessageStickerItemPayload[]
  interaction?: MessageInteractionPayload
  components?: MessageComponentPayload[]
  thread?: ThreadChannelPayload
}

export enum AllowedMentionType {
  Roles = 'roles',
  Users = 'users',
  Everyone = 'everyone'
}

export interface AllowedMentionsPayload {
  parse?: AllowedMentionType[]
  users?: string[]
  roles?: string[]
  replied_user?: boolean
}

export interface MessageOptions {
  content?: string
  tts?: boolean
  /** @deprecated Use `embeds` instead */
  embed?: Embed | EmbedPayload
  embeds?: Array<Embed | EmbedPayload>
  file?: MessageAttachment
  files?: MessageAttachment[]
  allowedMentions?: AllowedMentionsPayload
  reply?: Message | MessageReference | string
  components?: MessageComponentData[] | (() => MessageComponentPayload[])
}

export interface ChannelMention {
  id: string
  guild_id: string
  type: ChannelTypes
  name: string
}

export interface Attachment {
  id: string
  filename: string
  size: number
  url: string
  proxy_url: string
  height: number | undefined
  width: number | undefined
}

export interface EmbedPayload {
  title?: string
  type?: EmbedTypes
  description?: string
  url?: string
  timestamp?: string
  color?: number
  footer?: EmbedFooter
  image?: EmbedImage
  thumbnail?: EmbedThumbnail
  video?: EmbedVideo
  provider?: EmbedProvider
  author?: EmbedAuthor
  fields?: EmbedField[]
}

export type EmbedTypes =
  | 'rich'
  | 'image'
  | 'video'
  | 'gifv'
  | 'article'
  | 'link'

export interface EmbedField {
  name: string
  value: string
  inline?: boolean
}

export interface EmbedAuthor {
  name?: string
  url?: string
  icon_url?: string
  proxy_icon_url?: string
}

export interface EmbedFooter {
  text: string
  icon_url?: string
  proxy_icon_url?: string
}

export interface EmbedImage {
  url?: string
  proxy_url?: string
  height?: number
  width?: number
}

export interface EmbedProvider {
  name?: string
  url?: string
}

export interface EmbedVideo {
  url?: string
  height?: number
  width?: number
}

export interface EmbedThumbnail {
  url?: string
  proxy_url?: string
  height?: number
  width?: number
}

export interface Reaction {
  count: number
  me: boolean
  emoji: EmojiPayload
}

export interface MessageActivity {
  type: MessageTypes
  party_id?: string
}

export interface MessageApplication {
  id: string
  cover_image?: string
  description: string
  icon: string | undefined
  name: string
}

export interface MessageReference {
  message_id?: string
  channel_id?: string
  guild_id?: string
  fail_if_not_exists?: boolean
}

export enum MessageTypes {
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
  GUILD_INVITE_REMINDER = 22
}

export enum MessageActivityTypes {
  JOIN = 1,
  SPECTATE = 2,
  LISTEN = 3,
  JOIN_REQUEST = 4
}

export enum MessageFlags {
  CROSSPOSTED = 1 << 0,
  IS_CROSSPOST = 1 << 1,
  SUPPRESS_EMBEDS = 1 << 2,
  SOURCE_MESSAGE_DELETED = 1 << 3,
  URGENT = 1 << 4,
  HAS_THREAD = 1 << 5,
  EPHEMERAL = 1 << 6,
  LOADING = 1 << 7
}

export interface FollowedChannel {
  channel_id: string
  webhook_id: string
}

export enum MessageStickerFormatTypes {
  PNG = 1,
  APNG = 2,
  LOTTIE = 3
}

export enum MessageStickerType {
  STANDARD = 1,
  GUILD = 2
}

export interface MessageStickerItemPayload {
  id: string
  name: string
  format_type: MessageStickerFormatTypes
}

export interface MessageStickerPayload {
  id: string
  pack_id?: string
  name: string
  description: string | null
  tags: string
  type: MessageStickerType
  format_type: MessageStickerFormatTypes
  available?: boolean
  guild_id?: string
  user?: UserPayload
  sort_value?: number
}

export interface MessageStickerPackPayload {
  id: string
  stickers: MessageStickerPayload[]
  name: string
  sku_id: string
  cover_sticker_id?: string
  description: string
  banner_asset_id?: string
}

export interface ModifyGuildStickerOptions {
  /** Name of the sticker (2-30 characters) */
  name: string
  /** Description of the sticker (empty or 2-100 characters) */
  description: string
  /** The Discord name of a unicode emoji representing the sticker's expression (2-200 characters) */
  tags: string
  /** Optional Audit Log reason */
  reason?: string
}

export interface CreateGuildStickerOptions extends ModifyGuildStickerOptions {
  /** The sticker file to upload, must be a PNG, APNG, or Lottie JSON file, max 500 KB */
  file: Blob | Uint8Array
}

export interface MessageInteractionPayload {
  id: string
  type: InteractionType
  name: string
  user: UserPayload
}

export interface EditMessagePayload {
  content?: string
  embed?: EmbedPayload
  allowed_mentions?: AllowedMentionsPayload
  flags?: number
  components?: MessageComponentPayload[]
}

export interface CreateMessagePayload extends EditMessagePayload {
  nonce?: string
  tts?: boolean
  message_reference?: MessageReference
  file?: MessageAttachment
  files?: MessageAttachment[]
  components?: MessageComponentPayload[]
}

export interface CreateWebhookMessageBasePayload {
  content?: string
  embeds?: EmbedPayload[]
  tts?: boolean
  file?: MessageAttachment
  files?: MessageAttachment[]
  allowed_mentions?: AllowedMentionsPayload
}

export interface CreateWebhookMessagePayload extends CreateMessagePayload {
  username?: string
  avatar_url?: string
}

export interface ThreadMetadataPayload {
  archived: boolean
  archiver_id?: string
  /** Duration in minutes to automatically archive the thread after recent activity, can be set to: 60, 1440, 4320, 10080 */
  auto_archive_duration: number
  archive_timestamp: string
  locked?: boolean
}

export interface ThreadMemberPayload {
  /** ID of the Thread Channel */
  id: string
  user_id: string
  join_timestamp: string
  flags: number
}

export interface CreateThreadPayload {
  /** 2-100 character channel name */
  name: string
  /** duration in minutes to automatically archive the thread after recent activity, can be set to: 60, 1440, 4320, 10080 */
  auto_archive_duration?: number
  rate_limit_per_user?: number | null
  type?: ChannelTypes
  invitable?: boolean
}

export interface CreateThreadInForumPayload {
  /** 2-100 character channel name */
  name: string
  /** duration in minutes to automatically archive the thread after recent activity, can be set to: 60, 1440, 4320, 10080 */
  auto_archive_duration?: number
  rate_limit_per_user?: number | null
  message: CreateMessagePayload
  applied_tags?: string[]
}
