import type { Client } from '../client/mod.ts'
import {
  ChannelTypes,
  ThreadChannelPayload,
  ThreadMemberPayload
} from '../types/channel.ts'
import { ThreadChannel } from '../structures/threadChannel.ts'
import { BaseChildManager } from './baseChild.ts'
import { GuildChannelsManager } from './guildChannels.ts'

export const ThreadTypes = [
  ChannelTypes.NEWS_THREAD,
  ChannelTypes.PRIVATE_THREAD,
  ChannelTypes.PUBLIC_THREAD
]

export class ThreadsManager extends BaseChildManager<
  ThreadChannelPayload,
  ThreadChannel
> {
  constructor(client: Client, parent: GuildChannelsManager) {
    // it's not assignable but we're making sure it returns correct type
    // so i had to make ts to shut up
    super(client, parent as any)
  }

  async set(id: string, data: ThreadChannelPayload): Promise<void> {
    if ('members' in data) {
      for (const member of (data as any).members as ThreadMemberPayload[]) {
        await this.client.cache.set(`thread_members:${id}`, member.id, member)
      }
      ;(data as any).members = undefined
    }
    await super.set(id, data)
  }

  async get(id: string): Promise<ThreadChannel | undefined> {
    const res = await this.parent.get(id)
    if (res === undefined || !ThreadTypes.includes(res.type)) return undefined
    else return res
  }

  async array(): Promise<ThreadChannel[]> {
    const arr = await this.parent.array()
    return arr.filter((e) => ThreadTypes.includes(e.type))
  }
}
