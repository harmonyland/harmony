import { Embed } from '../structures/embed.ts'
import { EmojiPayload } from './emojiTypes.ts'
import { MemberPayload } from './guildTypes.ts'
import { RolePayload } from './roleTypes.ts'
import { UserPayload } from './userTypes.ts'

interface ChannelPayload {
  id: string
  type: ChannelTypes
}

interface TextChannelPayload extends ChannelPayload {
  last_message_id?: string
  last_pin_timestamp?: string
}

interface GuildChannelPayload extends ChannelPayload {
  guild_id: string
  name: string
  position: number
  permission_overwrites: Overwrite[]
  nsfw: boolean
  parent_id?: string
}

interface GuildTextChannelPayload
  extends TextChannelPayload,
    GuildChannelPayload {
  rate_limit_per_user: number
  topic?: string
}

interface GuildNewsChannelPayload
  extends TextChannelPayload,
    GuildChannelPayload {
  topic?: string
}

interface GuildVoiceChannelPayload extends GuildChannelPayload {
  bitrate: string
  user_limit: number
}

interface DMChannelPayload extends TextChannelPayload {
  recipients: UserPayload[]
}

interface GroupDMChannelPayload extends DMChannelPayload {
  name: string
  icon?: string
  owner_id: string
}

interface GuildChannelCategoryPayload
  extends ChannelPayload,
    GuildChannelPayload {}

interface Overwrite {
  id: string
  type: number
  allow: string
  deny: string
}

enum ChannelTypes {
  GUILD_TEXT = 0,
  DM = 1,
  GUILD_VOICE = 2,
  GROUP_DM = 3,
  GUILD_CATEGORY = 4,
  GUILD_NEWS = 5,
  GUILD_STORE = 6
}

interface MessagePayload {
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
  mentions: MemberPayload[]
  mention_roles: RolePayload[]
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
}

interface MessageOption {
  tts: boolean
  embed: Embed
  file: Attachment
  allowedMention?: {
    parse: ['everyone', 'users', 'roles']
    roles: string[]
    users: string[]
  }
}

interface ChannelMention {
  id: string
  guild_id: string
  type: ChannelTypes
  name: string
}

interface Attachment {
  id: string
  filename: string
  size: number
  url: string
  proxy_url: string
  height: number | undefined
  width: number | undefined
}

interface EmbedPayload {
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

type EmbedTypes = 'rich' | 'image' | 'video' | 'gifv' | 'article' | 'link'

interface EmbedField {
  name: string
  value: string
  inline?: boolean
}

interface EmbedAuthor {
  name?: string
  url?: string
  icon_url?: string
  proxy_icon_url?: string
}

interface EmbedFooter {
  text: string
  icon_url?: string
  proxy_icon_url?: string
}

interface EmbedImage {
  url?: string
  proxy_url?: string
  height?: number
  width?: number
}

interface EmbedProvider {
  name?: string
  url?: string
}

interface EmbedVideo {
  url?: string
  height?: number
  width?: number
}

interface EmbedThumbnail {
  url?: string
  proxy_url?: string
  height?: number
  width?: number
}

interface Reaction {
  count: number
  me: boolean
  emoji: EmojiPayload
}

interface MessageActivity {
  type: MessageTypes
  party_id?: string
}

interface MessageApplication {
  id: string
  cover_image?: string
  desription: string
  icon: string | undefined
  name: string
}

interface MessageReference {
  message_id?: string
  channel_id?: string
  guild_id?: string
}

enum MessageTypes {
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

enum MessageActivityTypes {
  JOIN = 1,
  SPECTATE = 2,
  LISTEN = 3,
  JOIN_REQUEST = 4
}

enum MessageFlags {
  CROSSPOSTED = 1 << 0,
  IS_CROSSPOST = 1 << 1,
  SUPPRESS_EMBEDS = 1 << 2,
  SOURCE_MESSAGE_DELETED = 1 << 3,
  URGENT = 1 << 4
}

interface FollowedChannel {
  channel_id: string
  webhook_id: string
}

interface Overwrite {
  id: string
  type: number
  allow: string
  deny: string
}
interface ChannelMention {
  id: string
  guild_id: string
  type: ChannelTypes
  name: string
}

export {
  ChannelPayload,
  TextChannelPayload,
  GuildChannelPayload,
  GuildNewsChannelPayload,
  GuildTextChannelPayload,
  GuildVoiceChannelPayload,
  GuildChannelCategoryPayload,
  DMChannelPayload,
  GroupDMChannelPayload,
  Overwrite,
  ChannelTypes,
  ChannelMention,
  Attachment,
  Reaction,
  MessageActivity,
  MessageApplication,
  MessageReference,
  MessagePayload,
  MessageOption,
  EmbedPayload,
  EmbedTypes,
  EmbedFooter,
  EmbedImage,
  EmbedThumbnail,
  EmbedVideo,
  EmbedProvider,
  EmbedAuthor,
  EmbedField
}
