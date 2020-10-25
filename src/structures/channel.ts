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
    super(client, data)
    this.type = data.type
    this.id = data.id
  }

  get mention () {
    return `<#${this.id}>`
  }
}
