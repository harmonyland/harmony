import { Client } from '../client/mod.ts'
import {
  ChannelPayload,
  ChannelTypes,
  DMChannelPayload,
  GroupDMChannelPayload,
  GuildCategoryChannelPayload,
  GuildNewsChannelPayload,
  GuildTextBasedChannelPayload,
  GuildTextChannelPayload,
  GuildVoiceChannelPayload,
  TextChannelPayload
} from '../types/channel.ts'
import { DMChannel } from '../structures/dmChannel.ts'
import { GroupDMChannel } from '../structures/groupChannel.ts'
import { CategoryChannel } from '../structures/guildCategoryChannel.ts'
import {
  GuildTextBasedChannel,
  GuildTextChannel
} from '../structures/guildTextChannel.ts'
import { NewsChannel } from '../structures/guildNewsChannel.ts'
import { VoiceChannel } from '../structures/guildVoiceChannel.ts'
import { Guild } from '../structures/guild.ts'
import { TextChannel } from '../structures/textChannel.ts'
import { Channel, GuildChannel } from '../structures/channel.ts'
import { StoreChannel } from '../structures/guildStoreChannel.ts'
import { StageVoiceChannel } from '../structures/guildStageVoiceChannel.ts'

export type EveryTextChannelTypes =
  | TextChannel
  | NewsChannel
  | GuildTextChannel
  | GuildTextBasedChannel
  | DMChannel
  | GroupDMChannel

export type EveryTextChannelPayloadTypes =
  | TextChannelPayload
  | GuildNewsChannelPayload
  | GuildTextChannelPayload
  | GuildTextBasedChannelPayload
  | DMChannelPayload
  | GroupDMChannelPayload

export type EveryChannelTypes =
  | Channel
  | GuildChannel
  | CategoryChannel
  | VoiceChannel
  | EveryTextChannelTypes

export type EveryChannelPayloadTypes =
  | ChannelPayload
  | GuildCategoryChannelPayload
  | GuildVoiceChannelPayload
  | EveryTextChannelPayloadTypes

/** Get appropriate Channel structure by its type */
const getChannelByType = (
  client: Client,
  data: EveryChannelPayloadTypes,
  guild?: Guild
): EveryChannelTypes | undefined => {
  switch (data.type) {
    case ChannelTypes.GUILD_CATEGORY:
      if (guild === undefined)
        throw new Error('No Guild was provided to construct Channel')
      return new CategoryChannel(
        client,
        data as GuildCategoryChannelPayload,
        guild
      )
    case ChannelTypes.GUILD_NEWS:
      if (guild === undefined)
        throw new Error('No Guild was provided to construct Channel')
      return new NewsChannel(client, data as GuildNewsChannelPayload, guild)
    case ChannelTypes.GUILD_TEXT:
      if (guild === undefined)
        throw new Error('No Guild was provided to construct Channel')
      return new GuildTextChannel(
        client,
        data as GuildTextChannelPayload,
        guild
      )
    case ChannelTypes.GUILD_STORE:
      if (guild === undefined)
        throw new Error('No Guild was provided to construct Channel')
      return new StoreChannel(client, data as GuildTextChannelPayload, guild)
    case ChannelTypes.GUILD_VOICE:
      if (guild === undefined)
        throw new Error('No Guild was provided to construct Channel')
      return new VoiceChannel(client, data as GuildVoiceChannelPayload, guild)
    case ChannelTypes.GUILD_STAGE_VOICE:
      if (guild === undefined)
        throw new Error('No Guild was provided to construct Channel')
      return new StageVoiceChannel(
        client,
        data as GuildVoiceChannelPayload,
        guild
      )
    case ChannelTypes.DM:
      return new DMChannel(client, data as DMChannelPayload)
    case ChannelTypes.GROUP_DM:
      return new GroupDMChannel(client, data as GroupDMChannelPayload)
  }
}

export default getChannelByType

export function isTextChannel(channel: Channel): channel is TextChannel {
  return (
    channel.type === ChannelTypes.DM ||
    channel.type === ChannelTypes.GROUP_DM ||
    channel.type === ChannelTypes.GUILD_TEXT ||
    channel.type === ChannelTypes.GUILD_NEWS
  )
}

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
    channel.type === ChannelTypes.GUILD_NEWS
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
    channel.type === ChannelTypes.GUILD_STAGE_VOICE
  )
}
