import { Embed } from '../structures/embed.ts'
import { MessageAttachment } from '../structures/message.ts'
import { EmojiPayload } from './emoji.ts'
import { MemberPayload } from './guild.ts'
import { UserPayload } from './user.ts'

export interface ChannelPayload {
  id: string
  type: ChannelTypes
}

export interface TextChannelPayload extends ChannelPayload {
  last_message_id?: string
  last_pin_timestamp?: string
}

export interface GuildChannelPayload extends ChannelPayload {
  guild_id: string
  name: string
  position: number
  permission_overwrites: Overwrite[]
  parent_id?: string
}

export interface GuildTextChannelPayload
  extends TextChannelPayload,
    GuildChannelPayload {
  nsfw: boolean
  rate_limit_per_user: number
  topic?: string
}

export interface GuildNewsChannelPayload
  extends TextChannelPayload,
    GuildChannelPayload {
  topic?: string
  nsfw: boolean
}

export interface GuildVoiceChannelPayload extends GuildChannelPayload {
  bitrate: string
  user_limit: number
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
  permission_overwrites?: Overwrite[] | null
  parent_id?: string
}

export interface ModifyGuildCategoryChannelPayload
  extends ModifyChannelPayload {}

export interface ModifyGuildTextChannelPayload extends ModifyChannelPayload {
  type?: number
  topic?: string | null
  nsfw?: boolean | null
  rate_limit_per_user?: number | null
}

export interface ModifyGuildNewsChannelPayload extends ModifyChannelPayload {
  type?: number
  topic?: string | null
  nsfw?: boolean | null
}

export interface ModifyVoiceChannelPayload extends ModifyChannelPayload {
  bitrate?: number | null
  user_limit?: number | null
}

export interface ModifyChannelOption {
  name?: string
  position?: number | null
  permissionOverwrites?: Overwrite[] | null
  parentID?: string
}

export interface ModifyGuildCategoryChannelOption extends ModifyChannelOption {}

export interface ModifyGuildTextChannelOption extends ModifyChannelOption {
  type?: number
  topic?: string | null
  nsfw?: boolean | null
  rateLimitPerUser?: number | null
}

export interface ModifyGuildNewsChannelOption extends ModifyChannelOption {
  type?: number
  topic?: string | null
  nsfw?: boolean | null
}

export interface ModifyVoiceChannelOption extends ModifyChannelOption {
  bitrate?: number | null
  userLimit?: number | null
}

export interface Overwrite {
  id: string
  type: number
  allow: string
  deny: string
}

export enum ChannelTypes {
  GUILD_TEXT = 0,
  DM = 1,
  GUILD_VOICE = 2,
  GROUP_DM = 3,
  GUILD_CATEGORY = 4,
  GUILD_NEWS = 5,
  GUILD_STORE = 6
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
  flags?: number
  stickers?: MessageStickerPayload[]
}

export interface MessageOptions {
  tts?: boolean
  embed?: Embed
  file?: MessageAttachment | string
  allowedMentions?: {
    parse?: 'everyone' | 'users' | 'roles'
    roles?: string[]
    users?: string[]
  }
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
  GUILD_DISCOVERY_REQUALIFIED = 15
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
  URGENT = 1 << 4
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

export interface MessageStickerPayload {
  id: string
  pack_id: string
  name: string
  description: string
  tags?: string
  asset: string
  preview_asset: string | null
  format_type: MessageStickerFormatTypes
}
