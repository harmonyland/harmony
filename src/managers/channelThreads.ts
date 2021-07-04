import type { Client } from '../client/mod.ts'
import type { ThreadChannelPayload } from '../types/channel.ts'
import { BaseChildManager } from './baseChild.ts'
import type { ThreadsManager } from './threads.ts'
import type {
  ThreadChannel,
  ThreadMember
} from '../structures/threadChannel.ts'
import type {
  CreateThreadOptions,
  GuildTextChannel
} from '../structures/guildTextChannel.ts'
import type { Message } from '../../mod.ts'

export class ChannelThreadsManager extends BaseChildManager<
  ThreadChannelPayload,
  ThreadChannel
> {
  channel: GuildTextChannel

  constructor(
    client: Client,
    parent: ThreadsManager,
    channel: GuildTextChannel
  ) {
    super(client, parent as any)
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
    // my IDE is giving error idk why
    return (this.parent as any).delete(id)
  }

  async array(): Promise<ThreadChannel[]> {
    const arr = (await this.parent.array()) as ThreadChannel[]
    return arr.filter(
      (c: ThreadChannel) => c.parentID === this.channel.id
    ) as any
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
    message: string | Message
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
