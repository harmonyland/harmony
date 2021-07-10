import type { Channel, GuildChannel } from '../structures/channel.ts'
import type { DMChannel } from '../structures/dmChannel.ts'
import type { GroupDMChannel } from '../structures/groupChannel.ts'
import type { CategoryChannel } from '../structures/guildCategoryChannel.ts'
import type { NewsChannel } from '../structures/guildNewsChannel.ts'
import type { StoreChannel } from '../structures/guildStoreChannel.ts'
import type {
  GuildTextBasedChannel,
  GuildTextChannel
} from '../structures/guildTextChannel.ts'
import type { VoiceChannel } from '../structures/guildVoiceChannel.ts'
import type { StageVoiceChannel } from '../structures/guildVoiceStageChannel.ts'
import { TextChannel } from '../structures/textChannel.ts'
import type { ThreadChannel } from '../structures/threadChannel.ts'
import { ChannelTypes } from '../types/channel.ts'

export function isDMChannel(channel: Channel): channel is DMChannel {
  return channel.type === ChannelTypes.DM
}

export function isGroupDMChannel(channel: Channel): channel is GroupDMChannel {
  return channel.type === ChannelTypes.GROUP_DM
}

export function isGuildTextChannel(
  channel: Channel
): channel is GuildTextChannel {
  return channel.type === ChannelTypes.GUILD_TEXT
}

export function isGuildBasedTextChannel(
  channel: Channel
): channel is GuildTextBasedChannel {
  return (
    channel.type === ChannelTypes.GUILD_TEXT ||
    channel.type === ChannelTypes.GUILD_NEWS ||
    channel.type === ChannelTypes.NEWS_THREAD ||
    channel.type === ChannelTypes.PRIVATE_THREAD ||
    channel.type === ChannelTypes.PUBLIC_THREAD
  )
}

export function isCategoryChannel(
  channel: Channel
): channel is CategoryChannel {
  return channel.type === ChannelTypes.GUILD_CATEGORY
}

export function isNewsChannel(channel: Channel): channel is NewsChannel {
  return channel.type === ChannelTypes.GUILD_NEWS
}

export function isVoiceChannel(channel: Channel): channel is VoiceChannel {
  return channel.type === ChannelTypes.GUILD_VOICE
}

export function isStageVoiceChannel(
  channel: Channel
): channel is StageVoiceChannel {
  return channel.type === ChannelTypes.GUILD_STAGE_VOICE
}

export function isStoreChannel(channel: Channel): channel is StoreChannel {
  return channel.type === ChannelTypes.GUILD_STORE
}

export function isGuildChannel(channel: Channel): channel is GuildChannel {
  return (
    channel.type === ChannelTypes.GUILD_CATEGORY ||
    channel.type === ChannelTypes.GUILD_NEWS ||
    channel.type === ChannelTypes.GUILD_STORE ||
    channel.type === ChannelTypes.GUILD_TEXT ||
    channel.type === ChannelTypes.GUILD_VOICE ||
    channel.type === ChannelTypes.GUILD_STAGE_VOICE ||
    channel.type === ChannelTypes.NEWS_THREAD ||
    channel.type === ChannelTypes.PRIVATE_THREAD ||
    channel.type === ChannelTypes.PUBLIC_THREAD
  )
}

export function isThreadChannel(channel: Channel): channel is ThreadChannel {
  return (
    channel.type === ChannelTypes.NEWS_THREAD ||
    channel.type === ChannelTypes.PRIVATE_THREAD ||
    channel.type === ChannelTypes.PUBLIC_THREAD
  )
}

export function isTextChannel(channel: Channel): channel is TextChannel {
  return (
    channel.type === ChannelTypes.DM ||
    channel.type === ChannelTypes.GROUP_DM ||
    channel.type === ChannelTypes.GUILD_TEXT ||
    channel.type === ChannelTypes.GUILD_NEWS ||
    channel.type === ChannelTypes.NEWS_THREAD ||
    channel.type === ChannelTypes.PRIVATE_THREAD ||
    channel.type === ChannelTypes.PUBLIC_THREAD
  )
}
