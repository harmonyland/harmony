import { Client } from '../models/client.ts'
import {
  ChannelPayload,
  ChannelTypes,
  DMChannelPayload,
  GroupDMChannelPayload,
  GuildChannelCategoryPayload,
  GuildNewsChannelPayload,
  GuildTextChannelPayload,
  GuildVoiceChannelPayload
} from '../types/channel.ts'
import { DMChannel } from '../structures/dmChannel.ts'
import { GroupDMChannel } from '../structures/groupChannel.ts'
import { CategoryChannel } from '../structures/guildCategoryChannel.ts'
import { NewsChannel } from '../structures/guildNewsChannel.ts'
import { VoiceChannel } from '../structures/guildVoiceChannel.ts'
import { Guild } from "../structures/guild.ts"
import { GuildTextChannel } from "../structures/guildTextChannel.ts"
import { TextChannel } from "../structures/textChannel.ts"

const getChannelByType = (
  client: Client,
  data:
    | GuildChannelCategoryPayload
    | GuildNewsChannelPayload
    | GuildTextChannelPayload
    | GuildVoiceChannelPayload
    | DMChannelPayload
    | GroupDMChannelPayload
    | ChannelPayload,
  guild?: Guild
):
  | CategoryChannel
  | NewsChannel
  | TextChannel
  | VoiceChannel
  | DMChannel
  | GroupDMChannel
  | undefined => {
  switch (data.type) {
    case ChannelTypes.GUILD_CATEGORY:
      if(guild === undefined) throw new Error("No Guild was provided to construct Channel")
      return new CategoryChannel(client, data as GuildChannelCategoryPayload, guild)
    case ChannelTypes.GUILD_NEWS:
      if(guild === undefined) throw new Error("No Guild was provided to construct Channel")
      return new NewsChannel(client, data as GuildNewsChannelPayload, guild)
    case ChannelTypes.GUILD_TEXT:
      if(guild === undefined) throw new Error("No Guild was provided to construct Channel")
      return new GuildTextChannel(client, data as GuildTextChannelPayload, guild)
    case ChannelTypes.GUILD_VOICE:
      if(guild === undefined) throw new Error("No Guild was provided to construct Channel")
      return new VoiceChannel(client, data as GuildVoiceChannelPayload, guild)
    case ChannelTypes.DM:
      return new DMChannel(client, data as DMChannelPayload)
    case ChannelTypes.GROUP_DM:
      return new GroupDMChannel(client, data as GroupDMChannelPayload)
  }
}

export default getChannelByType
