import type { Client } from '../client/mod.ts'
import { ThreadChannelPayload } from '../types/channel.ts'
import { BaseChildManager } from './baseChild.ts'
import { ThreadsManager } from './threads.ts'
import { ThreadChannel } from '../structures/threadChannel.ts'
import { GuildTextBasedChannel } from '../structures/guildTextChannel.ts'

export class ChannelThreadsManager extends BaseChildManager<
  ThreadChannelPayload,
  ThreadChannel
> {
  channel: GuildTextBasedChannel

  constructor(
    client: Client,
    parent: ThreadsManager,
    channel: GuildTextBasedChannel
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
}
