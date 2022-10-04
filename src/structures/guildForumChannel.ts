import {
  CategoryChannel,
  Client,
  Emoji,
  Guild,
  GuildChannel,
  GuildForumChannelPayload,
  GuildForumSortOrderTypes,
  GuildForumTagPayload,
  Invite,
  Message,
  ModifyGuildForumChannelOption,
  ModifyGuildForumChannelPayload,
  ThreadChannel,
  ThreadMember
} from '../../mod.ts'
import { ChannelThreadsManager } from '../managers/channelThreads.ts'
import { CreateInviteOptions } from '../managers/invites.ts'
import { CHANNEL } from '../types/endpoint.ts'
import { CreateThreadOptions } from './guildTextChannel.ts'

export class GuildForumTag {
  id!: string
  name!: string
  moderated!: boolean
  emojiID!: string
  emojiName!: string | null

  constructor(data: GuildForumTagPayload) {
    this.readFromData(data)
  }

  readFromData(data: GuildForumTagPayload) {
    this.id = data.id ?? this.id
    this.name = data.name ?? this.name
    this.moderated = data.moderated ?? this.moderated
    this.emojiID = data.emoji_id ?? this.emojiID
    this.emojiName = data.emoji_name ?? this.emojiName
  }
}

export class GuildForumChannel extends GuildChannel {
  slowmode!: number
  defaultThreadSlowmode!: number
  defaultAutoArchiveDuration!: number
  threads: ChannelThreadsManager
  topic?: string
  availableTags!: GuildForumTag[]
  defaultReactionEmoji!: Emoji
  defaultSortOrder!: GuildForumSortOrderTypes

  constructor(client: Client, data: GuildForumChannelPayload, guild: Guild) {
    super(client, data, guild)
    this.readFromData(data)
    this.threads = new ChannelThreadsManager(
      this.client,
      this.guild.threads,
      this
    )
  }

  readFromData(data: GuildForumChannelPayload): void {
    super.readFromData(data)
    this.topic = data.topic ?? this.topic
    this.defaultThreadSlowmode =
      data.default_thread_rate_limit_per_user ?? this.defaultThreadSlowmode
    this.defaultAutoArchiveDuration =
      data.default_auto_archive_duration ?? this.defaultAutoArchiveDuration
    this.slowmode = data.rate_limit_per_user ?? this.slowmode
    this.availableTags =
      data.available_tags?.map((tag) => new GuildForumTag(tag)) ??
      this.availableTags
    this.defaultReactionEmoji = data.default_reaction_emoji
      ? new Emoji(this.client, {
          id: data.default_reaction_emoji.emoji_id,
          name: data.default_reaction_emoji.emoji_name
        })
      : this.defaultReactionEmoji
    this.defaultSortOrder = data.default_sort_order ?? this.defaultSortOrder
  }

  async edit(
    options?: ModifyGuildForumChannelOption
  ): Promise<GuildForumChannel> {
    if (options?.defaultReactionEmoji !== undefined) {
      if (options.defaultReactionEmoji instanceof Emoji) {
        options.defaultReactionEmoji = {
          emoji_id: options.defaultReactionEmoji.id,
          emoji_name: options.defaultReactionEmoji.name
        }
      }
    }
    if (options?.availableTags !== undefined) {
      options.availableTags = options.availableTags?.map((tag) => {
        if (tag instanceof GuildForumTag) {
          return {
            id: tag.id,
            name: tag.name,
            moderated: tag.moderated,
            emoji_id: tag.emojiID,
            emoji_name: tag.emojiName
          }
        }
        return tag
      })
    }

    const body: ModifyGuildForumChannelPayload = {
      name: options?.name,
      position: options?.position,
      permission_overwrites: options?.permissionOverwrites,
      parent_id: options?.parentID,
      nsfw: options?.nsfw,
      topic: options?.topic,
      rate_limit_per_user: options?.slowmode,
      default_auto_archive_duration: options?.defaultAutoArchiveDuration,
      default_thread_rate_limit_per_user: options?.defaultThreadSlowmode,
      default_sort_order: options?.defaultSortOrder,
      default_reaction_emoji: options?.defaultReactionEmoji,
      available_tags: options?.availableTags
    }

    const resp = await this.client.rest.patch(CHANNEL(this.id), body)

    return new GuildForumChannel(this.client, resp, this.guild)
  }

  /** Create an Invite for this Channel */
  async createInvite(options?: CreateInviteOptions): Promise<Invite> {
    return this.guild.invites.create(this.id, options)
  }

  /** Edit topic of the channel */
  async setTopic(topic: string): Promise<GuildForumChannel> {
    return await this.edit({ topic })
  }

  /** Edit category of the channel */
  async setCategory(
    category: CategoryChannel | string
  ): Promise<GuildForumChannel> {
    return await this.edit({
      parentID: typeof category === 'object' ? category.id : category
    })
  }

  /** Edit Slowmode of the channel */
  async setSlowmode(slowmode?: number | null): Promise<GuildForumChannel> {
    return await this.edit({ slowmode: slowmode ?? null })
  }

  /** Edit Default Slowmode of the threads in the channel */
  async setDefaultThreadSlowmode(
    slowmode?: number | null
  ): Promise<GuildForumChannel> {
    return await this.edit({ defaultThreadSlowmode: slowmode ?? null })
  }

  /** Edit Default Auto Archive Duration of threads */
  async setDefaultAutoArchiveDuration(
    slowmode?: number | null
  ): Promise<GuildForumChannel> {
    return await this.edit({ defaultAutoArchiveDuration: slowmode ?? null })
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
    const data =
      await this.client.rest.endpoints.getJoinedPrivateArchivedThreads(
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
