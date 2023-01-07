import { Client } from '../client/mod.ts'
import { Channel } from '../structures/channel.ts'
import { Embed } from '../structures/embed.ts'
import { Message } from '../structures/message.ts'
import type { TextChannel } from '../structures/textChannel.ts'
import type { User } from '../structures/user.ts'
import type {
  ChannelPayload,
  GuildChannelPayload,
  MessageOptions,
  MessagePayload
} from '../types/channel.ts'
import { CHANNEL } from '../types/endpoint.ts'
import getChannelByType from '../utils/channel.ts'
import { BaseManager } from './base.ts'
import { transformComponent } from '../utils/components.ts'
import { Collection } from '../utils/collection.ts'

export type AllMessageOptions = MessageOptions | Embed | Embed[]

export class ChannelsManager extends BaseManager<ChannelPayload, Channel> {
  constructor(client: Client) {
    super(client, 'channels', Channel)
  }

  async getUserDM(user: User | string): Promise<string | undefined> {
    return this.client.cache.get(
      'user_dms',
      typeof user === 'string' ? user : user.id
    )
  }

  async setUserDM(user: User | string, id: string): Promise<void> {
    await this.client.cache.set(
      'user_dms',
      typeof user === 'string' ? user : user.id,
      id
    )
  }

  // Override get method as Generic
  async get<T extends Channel = Channel>(key: string): Promise<T | undefined> {
    const data = await this._get(key)
    if (data === undefined) return
    let guild
    if ('guild_id' in data) {
      guild = await this.client.guilds.get(
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        (data as GuildChannelPayload).guild_id
      )
    }
    const res = getChannelByType(this.client, data, guild)
    return res as T
  }

  async array(): Promise<Channel[]> {
    const arr = await (this.client.cache.array(
      this.cacheName
    ) as ChannelPayload[])
    if (arr === undefined) return []
    const result = []
    for (const elem of arr) {
      let guild
      if ('guild_id' in elem) {
        guild = await this.client.guilds.get(
          (elem as unknown as GuildChannelPayload).guild_id
        )
      }
      result.push(getChannelByType(this.client, elem, guild)!)
    }
    return result
  }

  /** Fetches a Channel by ID, cache it, resolve it */
  async fetch<T = Channel>(id: string): Promise<T> {
    return await new Promise((resolve, reject) => {
      this.client.rest
        .get(CHANNEL(id))
        .then(async (data) => {
          this.set(id, data as ChannelPayload)
          let guild
          if (data.guild_id !== undefined) {
            guild = await this.client.guilds.get(data.guild_id)
          }
          resolve(
            getChannelByType(
              this.client,
              data as ChannelPayload,
              guild
            ) as unknown as T
          )
        })
        .catch((e) => reject(e))
    })
  }

  async sendMessage(
    channel: string | TextChannel,
    content?: string | AllMessageOptions,
    option?: AllMessageOptions
  ): Promise<Message> {
    const channelID = typeof channel === 'string' ? channel : channel.id

    if (typeof content === 'object') {
      option = content
      content = undefined
    }
    if (content === undefined && option === undefined) {
      throw new Error('Either text or option is necessary.')
    }
    if (option instanceof Embed) {
      option = {
        embeds: [option]
      }
    }
    if (Array.isArray(option)) {
      option = {
        embeds: option
      }
    }

    const payload = {
      content: content ?? option?.content,
      embed: option?.embed,
      embeds: option?.embeds,
      file: option?.file,
      files: option?.files,
      tts: option?.tts,
      allowed_mentions: option?.allowedMentions,
      components:
        option?.components !== undefined
          ? typeof option.components === 'function'
            ? option.components
            : transformComponent(option.components)
          : undefined,
      message_reference:
        option?.reply === undefined
          ? undefined
          : typeof option.reply === 'string'
          ? {
              message_id: option.reply
            }
          : typeof option.reply === 'object'
          ? option.reply instanceof Message
            ? {
                message_id: option.reply.id,
                channel_id: option.reply.channel.id,
                guild_id: option.reply.guild?.id
              }
            : option.reply
          : undefined
    }

    if (payload.content === undefined && payload.embed === undefined) {
      payload.content = ''
    }

    const resp = await this.client.rest.api.channels[channelID].messages.post(
      payload
    )
    const chan =
      typeof channel === 'string'
        ? (await this.get<TextChannel>(channel))!
        : channel
    const res = new Message(this.client, resp, chan, this.client.user!)
    await res.mentions.fromPayload(resp)
    return res
  }

  async editMessage(
    channel: string | TextChannel,
    message: Message | string,
    text?: string | MessageOptions,
    option?: MessageOptions
  ): Promise<Message> {
    const channelID = typeof channel === 'string' ? channel : channel.id

    if (text === undefined && option === undefined) {
      throw new Error('Either text or option is necessary.')
    }

    if (this.client.user === undefined) {
      throw new Error('Client user has not initialized.')
    }

    if (typeof text === 'object') {
      if (typeof option === 'object') Object.assign(option, text)
      else option = text
      text = undefined
    }

    if (option?.embed !== undefined) {
      option.embeds = [option.embed]
      delete option.embed
    }

    const newMsg = await this.client.rest.api.channels[channelID].messages[
      typeof message === 'string' ? message : message.id
    ].patch({
      content: text ?? option?.content,
      embeds: option?.embeds,
      // Cannot upload new files with Message
      // file: option?.file,
      tts: option?.tts,
      allowed_mentions: option?.allowedMentions,
      components:
        option?.components !== undefined
          ? typeof option.components === 'function'
            ? option.components
            : transformComponent(option.components)
          : undefined
    })

    const chan =
      typeof channel === 'string'
        ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          (await this.get<TextChannel>(channel))!
        : channel
    const res = new Message(this.client, newMsg, chan, this.client.user)
    await res.mentions.fromPayload(newMsg)
    return res
  }

  async getPinnedMessages(
    channel: string | TextChannel
  ): Promise<Collection<string, Message>> {
    const res = new Collection<string, Message>()
    const channelID = typeof channel === 'string' ? channel : channel.id
    const channelStruct =
      typeof channel === 'string'
        ? await this.get<TextChannel>(channelID)
        : channel

    if (channelStruct === undefined) {
      throw new Error(`Channel ${channelID} not found.`)
    }

    const pins: MessagePayload[] = await this.client.rest.api.channels[
      channelID
    ].pins.get()

    for (const pin of pins) {
      await channelStruct.messages.set(pin.id, pin)
      const msg = (await channelStruct.messages.get(
        pin.id
      )) as unknown as Message
      res.set(msg.id, msg)
    }

    return res
  }

  async pinMessage(
    channel: string | TextChannel,
    message: string | Message
  ): Promise<void> {
    const channelID = typeof channel === 'string' ? channel : channel.id
    const messageID = typeof message === 'string' ? message : message.id

    await this.client.rest.api.channels[channelID].pins[messageID].put()
  }

  async unpinMessage(
    channel: string | TextChannel,
    message: string | Message
  ): Promise<void> {
    const channelID = typeof channel === 'string' ? channel : channel.id
    const messageID = typeof message === 'string' ? message : message.id

    await this.client.rest.api.channels[channelID].pins[messageID].delete()
  }

  /** Get cache size for messages. Returns total messages cache size if channel param is not given */
  async messageCacheSize(channel?: string | TextChannel): Promise<number> {
    if (channel === undefined) {
      const channels = (await this.client.cache.keys('channels')) ?? []
      if (channels.length === 0) return 0
      let size = 0
      for (const id of channels) {
        size += await this.messageCacheSize(id)
      }
      return size
    }

    const id = typeof channel === 'object' ? channel.id : channel
    return (await this.client.cache.size(`messages:${id}`)) ?? 0
  }
}
