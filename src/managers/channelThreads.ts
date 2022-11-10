import type { Client } from '../client/mod.ts'
import type { ThreadChannelPayload } from '../types/channel.ts'
import { BaseChildManager } from './baseChild.ts'
import type { ThreadsManager } from './threads.ts'
import type {
  ThreadChannel,
  ThreadMember
} from '../structures/threadChannel.ts'
import type { BaseManager, Message } from '../../mod.ts'
import type {
  CreateThreadOptions,
  GuildThreadAvailableChannel
} from '../structures/guildThreadAvailableChannel.ts'

export class ChannelThreadsManager extends BaseChildManager<
  ThreadChannelPayload,
  ThreadChannel
> {
  channel: GuildThreadAvailableChannel
  declare parent: BaseManager<ThreadChannelPayload, ThreadChannel>

  constructor(
    client: Client,
    parent: ThreadsManager,
    channel: GuildThreadAvailableChannel
  ) {
    super(
      client,
      parent as unknown as BaseManager<ThreadChannelPayload, ThreadChannel>
    )
    this.channel = channel
  }

  async get(id: string): Promise<ThreadChannel | undefined> {
    const res = await this.parent.get(id)
    if (res !== undefined && res.parentID === this.channel.id) return res
    else return undefined
  }

  /** Delete a Thread Channel */
  async delete(id: string | ThreadChannel): Promise<boolean> {
    const v = typeof id === 'string' ? id : id.id
    if ((await this.get(v))?.parentID !== this.channel.id) return false
    await this.parent.delete(typeof id === 'string' ? id : id.id)
    return true
  }

  async array(): Promise<ThreadChannel[]> {
    const arr = await this.parent.array()
    return arr.filter((c) => c.parentID === this.channel.id)
  }

  async flush(): Promise<boolean> {
    const arr = await this.array()
    for (const elem of arr) {
      this.parent._delete(elem.id)
    }
    return true
  }

  async start(
    options: CreateThreadOptions,
    message?: string | Message
  ): Promise<ThreadChannel> {
    return this.channel.startThread(options, message)
  }

  async startPrivate(options: CreateThreadOptions): Promise<ThreadChannel> {
    return this.channel.startPrivateThread(options)
  }

  async fetchArchived(
    type: 'public' | 'private' = 'public',
    params: { before?: string; limit?: number } = {}
  ): Promise<{
    threads: ThreadChannel[]
    members: ThreadMember[]
    hasMore: boolean
  }> {
    return this.channel.fetchArchivedThreads(type, params)
  }

  async fetchPublicArchived(
    params: { before?: string; limit?: number } = {}
  ): Promise<{
    threads: ThreadChannel[]
    members: ThreadMember[]
    hasMore: boolean
  }> {
    return this.channel.fetchPublicArchivedThreads(params)
  }

  async fetchPrivateArchived(
    params: { before?: string; limit?: number } = {}
  ): Promise<{
    threads: ThreadChannel[]
    members: ThreadMember[]
    hasMore: boolean
  }> {
    return this.channel.fetchPrivateArchivedThreads(params)
  }

  async fetchJoinedPrivateArchived(
    params: { before?: string; limit?: number } = {}
  ): Promise<{
    threads: ThreadChannel[]
    members: ThreadMember[]
    hasMore: boolean
  }> {
    return this.channel.fetchJoinedPrivateArchivedThreads(params)
  }
}
