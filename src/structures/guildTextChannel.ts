import { Mixin } from '../../deps.ts'
import { TextChannel } from './textChannel.ts'
import { GuildChannel } from './channel.ts'
import type { Client } from '../client/mod.ts'
import type {
  GuildTextBasedChannelPayload,
  GuildTextChannelPayload,
  ModifyGuildTextBasedChannelOption,
  ModifyGuildTextBasedChannelPayload,
  ModifyGuildTextChannelOption,
  ModifyGuildTextChannelPayload
} from '../types/channel.ts'
import { ChannelTypes } from '../types/channel.ts'
import type { Guild } from './guild.ts'
import { CHANNEL } from '../types/endpoint.ts'
import type { Message } from './message.ts'
import type { CreateInviteOptions } from '../managers/invites.ts'
import type { Invite } from './invite.ts'
import type { CategoryChannel } from './guildCategoryChannel.ts'
import type { ThreadChannel, ThreadMember } from './threadChannel.ts'
import { ChannelThreadsManager } from '../managers/channelThreads.ts'

const GUILD_TEXT_BASED_CHANNEL_TYPES: ChannelTypes[] = [
  ChannelTypes.GUILD_TEXT,
  ChannelTypes.GUILD_NEWS
]

export interface CreateThreadOptions {
  /** 2-100 character channel name */
  name: string
  /** duration in minutes to automatically archive the thread after recent activity, can be set to: 60, 1440, 4320, 10080 */
  autoArchiveDuration: number
}

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
  threads: ChannelThreadsManager

  constructor(client: Client, data: GuildTextChannelPayload, guild: Guild) {
    super(client, data, guild)
    this.slowmode = data.rate_limit_per_user
    this.threads = new ChannelThreadsManager(
      this.client,
      this.guild.threads,
      this
    )
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

  async startThread(
    options: CreateThreadOptions,
    message: Message | string
  ): Promise<ThreadChannel> {
    const payload = await this.client.rest.endpoints.startPublicThread(
      this.id,
      typeof message === 'string' ? message : message.id,
      { name: options.name, auto_archive_duration: options.autoArchiveDuration }
    )
    await this.client.channels.set(payload.id, payload)
    return (await this.client.channels.get<ThreadChannel>(payload.id))!
  }

  async startPrivateThread(
    options: CreateThreadOptions
  ): Promise<ThreadChannel> {
    const payload = await this.client.rest.endpoints.startPrivateThread(
      this.id,
      { name: options.name, auto_archive_duration: options.autoArchiveDuration }
    )
    await this.client.channels.set(payload.id, payload)
    return (await this.client.channels.get<ThreadChannel>(payload.id))!
  }

  async fetchArchivedThreads(
    type: 'public' | 'private' = 'public',
    params: { before?: string; limit?: number } = {}
  ): Promise<{
    threads: ThreadChannel[]
    members: ThreadMember[]
    hasMore: boolean
  }> {
    const data =
      type === 'public'
        ? await this.client.rest.endpoints.getPublicArchivedThreads(
            this.id,
            params
          )
        : await this.client.rest.endpoints.getPrivateArchivedThreads(
            this.id,
            params
          )

    const threads: ThreadChannel[] = []
    const members: ThreadMember[] = []

    for (const d of data.threads) {
      await this.threads.set(d.id, d)
      threads.push((await this.threads.get(d.id))!)
    }

    for (const d of data.members) {
      const thread =
        threads.find((e) => e.id === d.id) ?? (await this.threads.get(d.id))
      if (thread !== undefined) {
        await thread.members.set(d.user_id, d)
        members.push((await thread.members.get(d.user_id))!)
      }
    }

    return {
      threads,
      members,
      hasMore: data.has_more
    }
  }

  async fetchPublicArchivedThreads(
    params: { before?: string; limit?: number } = {}
  ): Promise<{
    threads: ThreadChannel[]
    members: ThreadMember[]
    hasMore: boolean
  }> {
    return await this.fetchArchivedThreads('public', params)
  }

  async fetchPrivateArchivedThreads(
    params: { before?: string; limit?: number } = {}
  ): Promise<{
    threads: ThreadChannel[]
    members: ThreadMember[]
    hasMore: boolean
  }> {
    return await this.fetchArchivedThreads('private', params)
  }

  async fetchJoinedPrivateArchivedThreads(
    params: { before?: string; limit?: number } = {}
  ): Promise<{
    threads: ThreadChannel[]
    members: ThreadMember[]
    hasMore: boolean
  }> {
    const data = await this.client.rest.endpoints.getJoinedPrivateArchivedThreads(
      this.id,
      params
    )

    const threads: ThreadChannel[] = []
    const members: ThreadMember[] = []

    for (const d of data.threads) {
      await this.threads.set(d.id, d)
      threads.push((await this.threads.get(d.id))!)
    }

    for (const d of data.members) {
      const thread =
        threads.find((e) => e.id === d.id) ?? (await this.threads.get(d.id))
      if (thread !== undefined) {
        await thread.members.set(d.user_id, d)
        members.push((await thread.members.get(d.user_id))!)
      }
    }

    return {
      threads,
      members,
      hasMore: data.has_more
    }
  }
}
