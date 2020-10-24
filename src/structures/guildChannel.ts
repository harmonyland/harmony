import { Client } from '../models/client.ts'
import { GuildChannelPayload, Overwrite } from '../types/channelTypes.ts'
import { Channel } from './channel.ts'
import * as cache from '../models/cache.ts'
import { Guild } from './guild.ts'
import { GUILD_CHANNEL } from '../types/endpoint.ts'

export class GuildChannel extends Channel {
  guildID: string
  name: string
  position: number
  permissionOverwrites: Overwrite[]
  nsfw: boolean
  parentID?: string

  constructor (client: Client, data: GuildChannelPayload) {
    super(client, data)
    this.guildID = data.guild_id
    this.name = data.name
    this.position = data.position
    this.permissionOverwrites = data.permission_overwrites
    this.nsfw = data.nsfw
    this.parentID = data.parent_id
  }

  static async autoInit (client: Client, guildID: string) {
    const cached = cache.get('guildChannel', guildID)
    if (cached === undefined || !(cached instanceof GuildChannel)) {
      const resp = await fetch(GUILD_CHANNEL(guildID), {
        headers: {
          Authorization: `Bot ${client.token}`
        }
      })
      const guildChannelParsed: GuildChannelPayload = await resp.json()

      const newGuild = new GuildChannel(client, guildChannelParsed)
      cache.set('guildChannel', guildID, newGuild)
      return newGuild
    } else {
      return cached
    }
  }
}
