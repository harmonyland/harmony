import type { Client } from '../client/client.ts'
import {
  ThreadChannelPayload,
  ThreadMemberPayload,
  ThreadMetadataPayload
} from '../types/channel.ts'
import { Base, SnowflakeBase } from './base.ts'
import type { Guild } from './guild.ts'
import { GuildTextBasedChannel } from './guildTextChannel.ts'
import type { IResolvable } from './resolvable.ts'
import { UserResolvable } from './user.ts'
import type { User } from './user.ts'
import { ThreadMembersManager } from '../managers/threadMembers.ts'
import { Collection } from '../utils/collection.ts'

export class ThreadMetadata extends Base {
  archived: boolean = false
  archiver?: UserResolvable
  /** Duration in minutes to automatically archive the thread after recent activity, can be set to: 60, 1440, 4320, 10080 */
  autoArchiveDuration!: number
  archiveTimestamp!: Date
  locked: boolean = false

  constructor(client: Client, data: ThreadMetadataPayload) {
    super(client)
    this.readFromData(data)
  }

  readFromData(data: ThreadMetadataPayload): this {
    this.archived = data.archived ?? this.archived
    this.archiver =
      data.archiver_id === undefined || data.archiver_id === null
        ? undefined
        : new UserResolvable(this.client, data.archiver_id)
    this.autoArchiveDuration = data.auto_archive_duration ?? this.locked
    this.archiveTimestamp = new Date(data.archive_timestamp)
    this.locked = data.locked ?? this.locked
    return this
  }
}

export class ThreadMember extends SnowflakeBase {
  user!: UserResolvable
  joinTimestamp!: Date
  thread!: ThreadResolvable
  flags = 0

  constructor(client: Client, data: ThreadMemberPayload) {
    super(client)
    this.readFromData(data)
  }

  readFromData(data: ThreadMemberPayload): this {
    this.user = new UserResolvable(this.client, data.user_id)
    this.joinTimestamp = new Date(data.join_timestamp)
    this.thread = new ThreadResolvable(this.client, data.id)
    this.flags = data.flags ?? this.flags
    return this
  }
}

export class ThreadResolvable
  extends SnowflakeBase
  implements IResolvable<ThreadChannel> {
  constructor(client: Client, public id: string) {
    super(client)
  }

  async get(): Promise<ThreadChannel | undefined> {
    return this.client.channels.get<ThreadChannel>(this.id)
  }

  async fetch(): Promise<ThreadChannel> {
    return this.client.channels.fetch<ThreadChannel>(this.id)
  }

  async resolve(): Promise<ThreadChannel | undefined> {
    return (await this.client.channels.resolve(this.id)) as ThreadChannel
  }
}

export class ThreadChannel extends GuildTextBasedChannel {
  declare topic: undefined
  metadata!: ThreadMetadata
  memberCount!: number
  messageCount!: number
  member?: ThreadMember
  members: ThreadMembersManager

  constructor(client: Client, data: ThreadChannelPayload, guild: Guild) {
    super(client, data as any, guild)
    this.readFromData(data)
    this.members = new ThreadMembersManager(client, this)
  }

  private _readFromData(data: ThreadChannelPayload): void {
    this.metadata = new ThreadMetadata(this.client, data.thread_metadata)
    this.memberCount = data.member_count
    this.messageCount = data.message_count
    this.member =
      data.member !== undefined
        ? new ThreadMember(this.client, data.member)
        : undefined
  }

  readFromData(data: any): this {
    super.readFromData(data)
    this._readFromData(data)
    return this
  }

  async join(): Promise<this> {
    await this.client.rest.endpoints.joinThread(this.id)
    return this
  }

  async leave(): Promise<this> {
    await this.client.rest.endpoints.leaveThread(this.id)
    return this
  }

  async addUser(user: string | User): Promise<this> {
    await this.client.rest.endpoints.addUserToThread(
      this.id,
      typeof user === 'string' ? user : user.id
    )
    return this
  }

  async removeUser(user: string | User): Promise<this> {
    await this.client.rest.endpoints.removeUserFromThread(
      this.id,
      typeof user === 'string' ? user : user.id
    )
    return this
  }

  async fetchMembers(): Promise<Collection<string, ThreadMember>> {
    const payloads = await this.client.rest.endpoints.getThreadMembers(this.id)
    const members: Collection<string, ThreadMember> = new Collection()
    for (const payload of payloads) {
      await this.members.set(payload.id, payload)
      members.set(payload.id, (await this.members.get(payload.id))!)
    }
    return members
  }

  /** Not possible to set Thread Channel topic */
  async setTopic(): Promise<this> {
    throw new Error('Not possible to set Thread Channel topic')
  }
}
