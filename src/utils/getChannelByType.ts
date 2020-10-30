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
} from '../types/channelTypes.ts'
import { DMChannel } from '../structures/dmChannel.ts'
import { GroupDMChannel } from '../structures/groupChannel.ts'
import { CategoryChannel } from '../structures/guildCategoryChannel.ts'
import { NewsChannel } from '../structures/guildNewsChannel.ts'
import { VoiceChannel } from '../structures/guildVoiceChannel.ts'
import { TextChannel } from '../structures/textChannel.ts'

const getChannelByType = (
  client: Client,
  data:
    | GuildChannelCategoryPayload
    | GuildNewsChannelPayload
    | GuildTextChannelPayload
    | GuildVoiceChannelPayload
    | DMChannelPayload
    | GroupDMChannelPayload
    | ChannelPayload
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
      return new CategoryChannel(client, data as GuildChannelCategoryPayload)
    case ChannelTypes.GUILD_NEWS:
      return new NewsChannel(client, data as GuildNewsChannelPayload)
    case ChannelTypes.GUILD_TEXT:
      return new TextChannel(client, data as GuildTextChannelPayload)
    case ChannelTypes.GUILD_VOICE:
      return new VoiceChannel(client, data as GuildVoiceChannelPayload)
    case ChannelTypes.DM:
      return new DMChannel(client, data as DMChannelPayload)
    case ChannelTypes.GROUP_DM:
      return new GroupDMChannel(client, data as GroupDMChannelPayload)
  }
}

export default getChannelByType
