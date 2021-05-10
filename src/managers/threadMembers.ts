import type { Client } from '../client/mod.ts'
import { ThreadMemberPayload } from '../types/channel.ts'
import { CHANNEL } from '../types/endpoint.ts'
import { BaseManager } from './base.ts'
import { ThreadChannel, ThreadMember } from '../structures/threadChannel.ts'
import { User } from '../../mod.ts'

export class ThreadMembersManager extends BaseManager<
  ThreadMemberPayload,
  ThreadMember
> {
  constructor(client: Client, public thread: ThreadChannel) {
    super(client, `thread_members:${thread.id}`, ThreadMember)
  }

  async get(id: string): Promise<ThreadMember | undefined> {
    const res = await this._get(id)
    if (res !== undefined) {
      return new ThreadMember(this.client, res)
    } else return undefined
  }

  /** Delete a Thread */
  async delete(id: string | ThreadChannel): Promise<boolean> {
    return this.client.rest.delete(CHANNEL(typeof id === 'string' ? id : id.id))
  }

  async array(): Promise<ThreadMember[]> {
    const arr = await (this.client.cache.array(
      this.cacheName
    ) as ThreadMemberPayload[])
    if (arr === undefined) return []
    const result: any[] = []
    for (const elem of arr) {
      result.push(new ThreadMember(this.client, elem))
    }
    return result
  }

  async add(who: string | User): Promise<ThreadMembersManager> {
    await this.thread.addUser(who)
    return this
  }

  async remove(who: string | User): Promise<ThreadMembersManager> {
    await this.thread.removeUser(who)
    return this
  }
}
