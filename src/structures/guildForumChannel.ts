import { Client } from '../client/client.ts'
import type { AllMessageOptions } from '../managers/channels.ts'
import {
  CreateThreadInForumPayload,
  GuildForumChannelPayload,
  GuildForumSortOrderTypes,
  GuildForumTagPayload,
  ModifyGuildForumChannelOption,
  ModifyGuildForumChannelPayload,
  ThreadChannelPayload
} from '../types/channel.ts'
import { CHANNEL } from '../types/endpoint.ts'
import { transformComponent } from '../utils/components.ts'
import { Embed } from './embed.ts'
import { Emoji } from './emoji.ts'
import { Guild } from './guild.ts'
import { GuildThreadAvailableChannel } from './guildThreadAvailableChannel.ts'
import { Message } from './message.ts'
import { ThreadChannel } from './threadChannel.ts'

export interface CreateThreadInForumOptions {
  /** 2-100 character channel name */
  name: string
  /** duration in minutes to automatically archive the thread after recent activity, can be set to: 60, 1440, 4320, 10080 */
  autoArchiveDuration?: number
  slowmode?: number | null
  message: string | AllMessageOptions
  appliedTags?: string[] | GuildForumTag[]
}

export class GuildForumTag {
  id!: string
  name!: string
  moderated!: boolean
  emojiID!: string
  emojiName!: string | null

  constructor(data: GuildForumTagPayload) {
    this.readFromData(data)
  }

  readFromData(data: GuildForumTagPayload): void {
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
    this.defaultReactionEmoji =
      data.default_reaction_emoji !== null
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

  override async startThread(
    options: CreateThreadInForumOptions,
    message?: string | AllMessageOptions | Message
  ): Promise<ThreadChannel> {
    if (options.message !== undefined) {
      message = options.message
    }
    if (message instanceof Message) {
      message = {
        content: message.content,
        embeds: message.embeds.map((embed) => new Embed(embed)),
        components: message.components
      }
    } else if (message instanceof Embed) {
      message = {
        embed: message
      }
    } else if (Array.isArray(message)) {
      message = {
        embeds: message
      }
    } else if (typeof message === 'string') {
      message = {
        content: message
      }
    }

    const messageObject = {
      content: message?.content,
      embed: message?.embed,
      embeds: message?.embeds,
      file: message?.file,
      files: message?.files,
      allowed_mentions: message?.allowedMentions,
      components:
        message?.components !== undefined
          ? typeof message.components === 'function'
            ? message.components()
            : transformComponent(message.components)
          : undefined
    }

    if (
      messageObject.content === undefined &&
      messageObject.embed === undefined
    ) {
      messageObject.content = ''
    }

    const body: CreateThreadInForumPayload = {
      name: options.name,
      auto_archive_duration: options.autoArchiveDuration,
      rate_limit_per_user: options.slowmode,
      message: messageObject,
      applied_tags: options.appliedTags?.map((tag) => {
        if (tag instanceof GuildForumTag) {
          return tag.id
        }
        return tag
      })
    }

    const resp: ThreadChannelPayload = await this.client.rest.api.channels[
      this.id
    ].threads.post(body)
    const thread = new ThreadChannel(this.client, resp, this.guild)
    this.threads.set(thread.id, resp)
    return thread
  }
}
