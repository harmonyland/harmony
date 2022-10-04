import { Client } from '../client/client.ts'
import {
  GuildForumChannelPayload,
  GuildForumSortOrderTypes,
  GuildForumTagPayload,
  ModifyGuildForumChannelOption,
  ModifyGuildForumChannelPayload
} from '../types/channel.ts'
import { CHANNEL } from '../types/endpoint.ts'
import { Emoji } from './emoji.ts'
import { Guild } from './guild.ts'
import { GuildThreadAvailableChannel } from './guildThreadAvailableChannel.ts'

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

export class GuildForumChannel extends GuildThreadAvailableChannel {
  availableTags!: GuildForumTag[]
  defaultReactionEmoji!: Emoji
  defaultSortOrder!: GuildForumSortOrderTypes

  constructor(client: Client, data: GuildForumChannelPayload, guild: Guild) {
    super(client, data, guild)
    this.readFromData(data)
  }

  readFromData(data: GuildForumChannelPayload): void {
    super.readFromData(data)
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
}
