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
import { DMChannel } from './dm.ts'
import { GroupChannel } from './groupChannel.ts'
import { VoiceChannel } from './guildVoiceChannel.ts'
import { TextChannel } from './textChannel.ts'

export class Channel extends Base {
  type: ChannelTypes
  id: string

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
        return
      case ChannelTypes.GUILD_NEWS:
        return
      case ChannelTypes.GUILD_TEXT:
        return new TextChannel(client, data as GuildTextChannelPayload)
      case ChannelTypes.GUILD_VOICE:
        return new VoiceChannel(client, data as GuildVoiceChannelPayload)
      case ChannelTypes.DM:
        return new DMChannel(client, data as DMChannelPayload)
      case ChannelTypes.GROUP_DM:
        return new GroupChannel(client, data as GroupDMChannelPayload)
    }
  }
}
