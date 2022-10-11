import { Client } from '../client/client.ts'
import { ChannelThreadsManager } from '../managers/channelThreads.ts'
import {
  ChannelTypes,
  GuildThreadAvailableChannelPayload,
  ModifyGuildThreadAvailableChannelOption,
  ModifyGuildThreadAvailableChannelPayload
} from '../types/channel.ts'
import { CHANNEL } from '../types/endpoint.ts'
import { GuildChannel } from './channel.ts'
import { Guild } from './guild.ts'
import { Message } from './message.ts'
import { ThreadChannel, ThreadMember } from './threadChannel.ts'

export interface CreateThreadOptions {
  /** 2-100 character channel name */
  name: string
  /** duration in minutes to automatically archive the thread after recent activity, can be set to: 60, 1440, 4320, 10080 */
  autoArchiveDuration?: number
  slowmode?: number | null
  type?: ChannelTypes
  invitable?: boolean
}

export class GuildThreadAvailableChannel extends GuildChannel {
  topic?: string
  slowmode!: number
  defaultThreadSlowmode?: number
  defaultAutoArchiveDuration?: number
  threads: ChannelThreadsManager

  constructor(
    client: Client,
    data: GuildThreadAvailableChannelPayload,
    guild: Guild
  ) {
    super(client, data, guild)
    this.readFromData(data)
    this.threads = new ChannelThreadsManager(
      this.client,
      this.guild.threads,
      this
    )
  }

  readFromData(data: GuildThreadAvailableChannelPayload): void {
    super.readFromData(data)
    this.defaultThreadSlowmode =
      data.default_thread_rate_limit_per_user ?? this.defaultThreadSlowmode
    this.defaultAutoArchiveDuration =
      data.default_auto_archive_duration ?? this.defaultAutoArchiveDuration
    this.topic = data.topic ?? this.topic
  }

  /** Edit the Guild Text Channel */
  async edit(
    options?: ModifyGuildThreadAvailableChannelOption
  ): Promise<GuildThreadAvailableChannel> {
    const body: ModifyGuildThreadAvailableChannelPayload = {
      name: options?.name,
      position: options?.position,
      permission_overwrites: options?.permissionOverwrites,
      parent_id: options?.parentID,
      nsfw: options?.nsfw,
      topic: options?.topic,
      rate_limit_per_user: options?.slowmode,
      default_auto_archive_duration: options?.defaultAutoArchiveDuration,
      default_thread_rate_limit_per_user: options?.defaultThreadSlowmode
    }

    const resp = await this.client.rest.patch(CHANNEL(this.id), body)

    return new GuildThreadAvailableChannel(this.client, resp, this.guild)
  }

  /** Edit topic of the channel */
  async setTopic(topic: string): Promise<GuildThreadAvailableChannel> {
    return await this.edit({ topic })
  }

  /** Edit Slowmode of the channel */
  async setSlowmode(
    slowmode?: number | null
  ): Promise<GuildThreadAvailableChannel> {
    return await this.edit({ slowmode: slowmode ?? null })
  }

  /** Edit Default Slowmode of the threads in the channel */
  async setDefaultThreadSlowmode(
    slowmode?: number | null
  ): Promise<GuildThreadAvailableChannel> {
    return await this.edit({ defaultThreadSlowmode: slowmode ?? null })
  }

  /** Edit Default Auto Archive Duration of threads */
  async setDefaultAutoArchiveDuration(
    slowmode?: number | null
  ): Promise<GuildThreadAvailableChannel> {
    return await this.edit({ defaultAutoArchiveDuration: slowmode ?? null })
  }

  async startThread(
    options: CreateThreadOptions,
    message?: Message | string
  ): Promise<ThreadChannel> {
    const payload =
      message !== undefined
        ? await this.client.rest.endpoints.startPublicThreadFromMessage(
            this.id,
            typeof message === 'string' ? message : message.id,
            {
              name: options.name,
              auto_archive_duration: options.autoArchiveDuration,
              rate_limit_per_user: options.slowmode
            }
          )
        : await this.client.rest.endpoints.startThreadWithoutMessage(this.id, {
            name: options.name,
            auto_archive_duration: options.autoArchiveDuration,
            rate_limit_per_user: options.slowmode,
            invitable: options.invitable,
            type: options.type
          })
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
