import { Client } from '../models/client.ts'
import { Channel } from '../structures/channel.ts'
import { Guild } from '../structures/guild.ts'
import { CategoryChannel } from '../structures/guildCategoryChannel.ts'
import { GuildTextChannel } from '../structures/textChannel.ts'
import { VoiceChannel } from '../structures/guildVoiceChannel.ts'
import {
  ChannelTypes,
  GuildCategoryChannelPayload,
  GuildChannelPayload,
  GuildTextChannelPayload,
  GuildVoiceChannelPayload,
  Overwrite
} from '../types/channel.ts'
import { CHANNEL, GUILD_CHANNELS } from '../types/endpoint.ts'
import { BaseChildManager } from './baseChild.ts'
import { ChannelsManager } from './channels.ts'

export type GuildChannelPayloads =
  | GuildTextChannelPayload
  | GuildVoiceChannelPayload
  | GuildCategoryChannelPayload
export type GuildChannel = GuildTextChannel | VoiceChannel | CategoryChannel

export interface CreateChannelOptions {
  name: string
  type?: ChannelTypes
  topic?: string
  bitrate?: number
  userLimit?: number
  rateLimitPerUser?: number
  position?: number
  permissionOverwrites?: Overwrite[]
  parent?: CategoryChannel | string
  nsfw?: boolean
}

export class GuildChannelsManager extends BaseChildManager<
  GuildChannelPayloads,
  GuildChannel
> {
  guild: Guild

  constructor(client: Client, parent: ChannelsManager, guild: Guild) {
    super(client, parent as any)
    this.guild = guild
  }

  async get(id: string): Promise<GuildChannel | undefined> {
    const res = await this.parent.get(id)
    if (res !== undefined && res.guild.id === this.guild.id) return res
    else return undefined
  }

  /** Delete a Guild Channel */
  async delete(id: string): Promise<boolean> {
    return this.client.rest.delete(CHANNEL(id))
  }

  async array(): Promise<GuildChannel[]> {
    const arr = (await this.parent.array()) as Channel[]
    return arr.filter(
      (c: any) => c.guild !== undefined && c.guild.id === this.guild.id
    ) as any
  }

  async flush(): Promise<boolean> {
    const arr = await this.array()
    for (const elem of arr) {
      this.parent.delete(elem.id)
    }
    return true
  }

  /** Create a new Guild Channel */
  async create(options: CreateChannelOptions): Promise<GuildChannel> {
    if (options.name === undefined)
      throw new Error('name is required for GuildChannelsManager#create')
    const res = ((await this.client.rest.post(GUILD_CHANNELS(this.guild.id)),
    {
      name: options.name,
      type: options.type,
      topic: options.topic,
      bitrate: options.bitrate,
      user_limit: options.userLimit,
      rate_limit_per_user: options.rateLimitPerUser,
      position: options.position,
      permission_overwrites: options.permissionOverwrites,
      parent_id:
        options.parent === undefined
          ? undefined
          : typeof options.parent === 'object'
          ? options.parent.id
          : options.parent,
      nsfw: options.nsfw
    }) as unknown) as GuildChannelPayload

    await this.set(res.id, res)
    const channel = await this.get(res.id)
    return (channel as unknown) as GuildChannel
  }
}
