import { Client } from '../models/client.ts'
import {
  ChannelPayload,
  GuildChannelCategoryPayload,
  GuildNewsChannelPayload,
  GuildTextChannelPayload,
  GuildVoiceChannelPayload,
  DMChannelPayload,
  GroupDMChannelPayload,
  ChannelTypes
} from '../types/channelTypes.ts'
import { Base } from './base.ts'
import { CategoryChannel } from './guildCategoryChannel.ts'
import { VoiceChannel } from './guildVoiceChannel.ts'
import { NewsChannel } from './guildnewsChannel.ts'
import { DMChannel } from './dmChannel.ts'
import { GroupDMChannel } from './groupChannel.ts'
import { TextChannel } from './textChannel.ts'

export class Channel extends Base {
  type: ChannelTypes
  id: string
  static cacheName = 'channel'
  static cacheArgIndex = 0

  constructor (client: Client, data: ChannelPayload) {
    super(client)
    this.type = data.type
    this.id = data.id
  }

  get mention () {
    return `<#${this.id}>`
  }

  static from (
    data:
      | GuildChannelCategoryPayload
      | GuildNewsChannelPayload
      | GuildTextChannelPayload
      | GuildVoiceChannelPayload
      | DMChannelPayload
      | GroupDMChannelPayload,
    client: Client
  ) {
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
}
