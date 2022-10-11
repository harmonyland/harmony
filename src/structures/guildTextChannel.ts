import { Mixin } from '../../deps.ts'
import { TextChannel } from './textChannel.ts'
import { GuildChannel } from './channel.ts'
import type { Client } from '../client/mod.ts'
import type {
  GuildTextBasedChannelPayload,
  ModifyGuildTextBasedChannelOption,
  ModifyGuildTextBasedChannelPayload
} from '../types/channel.ts'
import type { Guild } from './guild.ts'
import { CHANNEL } from '../types/endpoint.ts'
import type { Message } from './message.ts'
import { GuildThreadAvailableChannel } from './guildThreadAvailableChannel.ts'

/** Represents a Text Channel but in a Guild */
export class GuildTextBasedChannel extends Mixin(TextChannel, GuildChannel) {
  constructor(
    client: Client,
    data: GuildTextBasedChannelPayload,
    guild: Guild
  ) {
    super(client, data, guild)
    this.readFromData(data)
  }

  readFromData(data: GuildTextBasedChannelPayload): void {
    super.readFromData(data)
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
      nsfw: options?.nsfw
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
}

// Still exist for API compatibility
export class GuildTextChannel extends Mixin(
  GuildTextBasedChannel,
  GuildThreadAvailableChannel
) {}
