import { Client } from '../client/mod.ts'
import {
  ChannelPayload,
  ChannelTypes,
  DMChannelPayload,
  GroupDMChannelPayload,
  GuildCategoryChannelPayload,
  GuildNewsChannelPayload,
  GuildStageChannelPayload,
  GuildTextBasedChannelPayload,
  GuildTextChannelPayload,
  GuildVoiceChannelPayload,
  TextChannelPayload,
  ThreadChannelPayload
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
import { ThreadChannel } from '../structures/threadChannel.ts'

export type EveryTextChannelTypes =
  | TextChannel
  | NewsChannel
  | GuildTextChannel
  | GuildTextBasedChannel
  | DMChannel
  | GroupDMChannel
  | ThreadChannel

export type EveryTextChannelPayloadTypes =
  | TextChannelPayload
  | GuildNewsChannelPayload
  | GuildTextChannelPayload
  | GuildTextBasedChannelPayload
  | DMChannelPayload
  | GroupDMChannelPayload
  | ThreadChannelPayload

export type EveryChannelTypes =
  | Channel
  | GuildChannel
  | CategoryChannel
  | VoiceChannel
  | StageVoiceChannel
  | EveryTextChannelTypes

export type EveryChannelPayloadTypes =
  | ChannelPayload
  | GuildCategoryChannelPayload
  | GuildVoiceChannelPayload
  | GuildStageChannelPayload
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
    case ChannelTypes.NEWS_THREAD:
    case ChannelTypes.PRIVATE_THREAD:
    case ChannelTypes.PUBLIC_THREAD:
      if (guild === undefined)
        throw new Error('No Guild was provided to construct Channel')
      return new ThreadChannel(client, data as ThreadChannelPayload, guild)
  }
}

export default getChannelByType
