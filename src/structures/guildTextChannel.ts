import { Mixin } from '../../deps.ts'
import { TextChannel } from './textChannel.ts'
import { GuildChannel } from './channel.ts'
import { Client } from '../models/client.ts'
import {
  ChannelTypes,
  GuildTextBasedChannelPayload,
  GuildTextChannelPayload,
  ModifyGuildTextBasedChannelOption,
  ModifyGuildTextBasedChannelPayload,
  ModifyGuildTextChannelOption,
  ModifyGuildTextChannelPayload
} from '../types/channel.ts'
import { Guild } from './guild.ts'
import { CHANNEL } from '../types/endpoint.ts'
import { Message } from './message.ts'
import { CreateInviteOptions } from '../managers/invites.ts'
import { Invite } from './invite.ts'
import { CategoryChannel } from './guildCategoryChannel.ts'

const GUILD_TEXT_BASED_CHANNEL_TYPES: ChannelTypes[] = [
  ChannelTypes.GUILD_TEXT,
  ChannelTypes.GUILD_NEWS
]

/** Represents a Text Channel but in a Guild */
export class GuildTextBasedChannel extends Mixin(TextChannel, GuildChannel) {
  topic?: string

  get mention(): string {
    return `<#${this.id}>`
  }

  toString(): string {
    return this.mention
  }

  constructor(
    client: Client,
    data: GuildTextBasedChannelPayload,
    guild: Guild
  ) {
    super(client, data, guild)
    this.topic = data.topic
  }

  readFromData(data: GuildTextBasedChannelPayload): void {
    super.readFromData(data)
    this.topic = data.topic ?? this.topic
  }

  /** Edit the Guild Text Channel */
  async edit(
    options?: ModifyGuildTextBasedChannelOption
  ): Promise<GuildTextBasedChannel> {
    const body: ModifyGuildTextBasedChannelPayload = {
      name: options?.name,
      position: options?.position,
      permission_overwrites: options?.permissionOverwrites,
      parent_id: options?.parentID,
      nsfw: options?.nsfw,
      topic: options?.topic
      // rate_limit_per_user: options?.slowmode
    }

    const resp = await this.client.rest.patch(CHANNEL(this.id), body)

    return new GuildTextBasedChannel(this.client, resp, this.guild)
  }

  /**
   * Bulk Delete Messages in a Guild Text Channel
   * @param messages Messages to delete. Can be a number, or Array of Message or IDs
   */
  async bulkDelete(
    messages: Array<Message | string> | number
  ): Promise<GuildTextBasedChannel> {
    let ids: string[] = []

    if (Array.isArray(messages))
      ids = messages.map((e) => (typeof e === 'string' ? e : e.id))
    else {
      let list = await this.messages.array()
      if (list.length < messages) list = (await this.fetchMessages()).array()
      ids = list
        .sort((b, a) => a.createdAt.getTime() - b.createdAt.getTime())
        .filter((e, i) => i < messages)
        .filter(
          (e) =>
            new Date().getTime() - e.createdAt.getTime() <=
            1000 * 60 * 60 * 24 * 14
        )
        .map((e) => e.id)
    }

    ids = [...new Set(ids)]
    if (ids.length < 2 || ids.length > 100)
      throw new Error('bulkDelete can only delete messages in range 2-100')

    await this.client.rest.api.channels[this.id].messages['bulk-delete'].post({
      messages: ids
    })

    return this
  }

  /** Create an Invite for this Channel */
  async createInvite(options?: CreateInviteOptions): Promise<Invite> {
    return this.guild.invites.create(this.id, options)
  }

  /** Edit topic of the channel */
  async setTopic(topic: string): Promise<GuildTextBasedChannel> {
    return await this.edit({ topic })
  }

  /** Edit category of the channel */
  async setCategory(
    category: CategoryChannel | string
  ): Promise<GuildTextBasedChannel> {
    return await this.edit({
      parentID: typeof category === 'object' ? category.id : category
    })
  }
}

export const checkGuildTextBasedChannel = (
  channel: TextChannel
): channel is GuildTextBasedChannel =>
  GUILD_TEXT_BASED_CHANNEL_TYPES.includes(channel.type)

export class GuildTextChannel extends GuildTextBasedChannel {
  slowmode: number

  constructor(client: Client, data: GuildTextChannelPayload, guild: Guild) {
    super(client, data, guild)
    this.slowmode = data.rate_limit_per_user
  }

  readFromData(data: GuildTextChannelPayload): void {
    super.readFromData(data)
    this.slowmode = data.rate_limit_per_user ?? this.slowmode
  }

  /** Edit the Guild Text Channel */
  async edit(
    options?: ModifyGuildTextChannelOption
  ): Promise<GuildTextChannel> {
    const body: ModifyGuildTextChannelPayload = {
      name: options?.name,
      position: options?.position,
      permission_overwrites: options?.permissionOverwrites,
      parent_id: options?.parentID,
      nsfw: options?.nsfw,
      topic: options?.topic,
      rate_limit_per_user: options?.slowmode
    }

    const resp = await this.client.rest.patch(CHANNEL(this.id), body)

    return new GuildTextChannel(this.client, resp, this.guild)
  }

  /** Edit Slowmode of the channel */
  async setSlowmode(slowmode?: number | null): Promise<GuildTextChannel> {
    return await this.edit({ slowmode: slowmode ?? null })
  }
}
