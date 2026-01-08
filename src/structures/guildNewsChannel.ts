import type {
  GuildNewsChannelPayload,
  ModifyGuildTextBasedChannelOption,
  ModifyGuildThreadAvailableChannelOption,
  ModifyGuildThreadAvailableChannelPayload
} from '../types/channel.ts'
import { GuildTextBasedChannel } from './guildTextChannel.ts'
import { GuildThreadAvailableChannel } from './guildThreadAvailableChannel.ts'
import { CHANNEL } from '../types/endpoint.ts'

export class NewsChannel extends GuildTextBasedChannel {
  /* Edit the NewsChannel */
  override async edit(
    options?: ModifyGuildTextBasedChannelOption &
      ModifyGuildThreadAvailableChannelOption
  ): Promise<NewsChannel> {
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

    return new NewsChannel(this.client, resp, this.guild)
  }

  override readFromData(data: GuildNewsChannelPayload): void {
    super.readFromData(data)

    this.defaultThreadSlowmode =
      data.default_thread_rate_limit_per_user ?? this.defaultThreadSlowmode
    this.defaultAutoArchiveDuration =
      data.default_auto_archive_duration ?? this.defaultAutoArchiveDuration
    this.topic = data.topic ?? this.topic
  }
}

export interface NewsChannel extends GuildThreadAvailableChannel {}

const ignore = ['constructor', 'edit', 'readFromData']
for (const name of Object.getOwnPropertyNames(
  GuildThreadAvailableChannel.prototype
)) {
  if (ignore.includes(name)) continue
  Object.defineProperty(
    NewsChannel.prototype,
    name,
    Object.getOwnPropertyDescriptor(
      GuildThreadAvailableChannel.prototype,
      name
    )!
  )
}
