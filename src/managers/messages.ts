import type { Client } from '../client/mod.ts'
import { Message } from '../structures/message.ts'
import type { TextChannel } from '../structures/textChannel.ts'
import { User } from '../structures/user.ts'
import type { MessagePayload } from '../types/channel.ts'
import { CHANNEL_MESSAGE } from '../types/endpoint.ts'
import { Snowflake } from '../utils/snowflake.ts'
import { BaseManager } from './base.ts'

export class MessagesManager extends BaseManager<MessagePayload, Message> {
  channel: TextChannel

  constructor(client: Client, channel: TextChannel) {
    super(client, `messages:${channel.id}`, Message)
    this.channel = channel
  }

  async get(key: string): Promise<Message | undefined> {
    const raw = await this._get(key)
    if (raw === undefined) return

    if (raw.author === undefined) return

    let channel = await this.client.channels.get(raw.channel_id)
    if (channel === undefined)
      channel = await this.client.channels.fetch(raw.channel_id)

    let author = (await this.client.users.get(raw.author.id)) as unknown as User

    if (author === undefined) author = new User(this.client, raw.author)

    const res = new this.DataType(this.client, raw, channel, author)
    await res.mentions.fromPayload(raw)

    if (typeof raw.guild_id === 'string')
      res.guild = await this.client.guilds.get(raw.guild_id)

    if (typeof res.guild === 'object')
      res.member = await res.guild.members.get(raw.author.id)

    return res
  }

  async set(key: string, value: MessagePayload): Promise<void> {
    await this.client.cache.set(
      this.cacheName,
      key,
      value,
      this.client.messageCacheLifetime
    )
    const keys = (await this.client.cache.keys(this.cacheName)) ?? []
    if (keys.length > this.client.messageCacheMax) {
      const sorted = keys.sort(
        (b, a) => new Snowflake(a).timestamp - new Snowflake(b).timestamp
      )
      const toRemove = sorted.filter((_, i) => i >= this.client.messageCacheMax)
      await this.client.cache.delete(this.cacheName, ...toRemove)
    }
  }

  async array(): Promise<Message[]> {
    let arr = await (this.client.cache.array(
      this.cacheName
    ) as MessagePayload[])
    if (arr === undefined) arr = []

    const result: Message[] = []
    await Promise.all(
      arr.map(async (raw) => {
        if (raw.author === undefined) return

        let channel = await this.client.channels.get(raw.channel_id)
        if (channel === undefined)
          channel = await this.client.channels.fetch(raw.channel_id)
        if (channel === undefined) return

        let author = (await this.client.users.get(
          raw.author.id
        )) as unknown as User

        if (author === undefined) author = new User(this.client, raw.author)

        const res = new Message(
          this.client,
          raw,
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
          channel as TextChannel,
          author
        )
        await res.mentions.fromPayload(raw)
        result.push(res)
      })
    )
    return result
  }

  async fetch(id: string): Promise<Message> {
    return await new Promise((resolve, reject) => {
      this.client.rest
        .get(CHANNEL_MESSAGE(this.channel.id, id))
        .then(async (data) => {
          await this.set(id, data as MessagePayload)

          let channel = await this.client.channels.get<TextChannel>(
            this.channel.id
          )
          if (channel === undefined)
            channel = await this.client.channels.fetch(this.channel.id)

          await this.client.users.set(
            data.author.id,
            (data as MessagePayload).author
          )

          const res = (await this.get(data.id)) as Message

          await res.mentions.fromPayload(data)

          resolve(res)
        })
        .catch((e) => reject(e))
    })
  }
}
