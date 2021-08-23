import type { Client } from '../client/mod.ts'
import { Emoji } from '../structures/emoji.ts'
import type { Guild } from '../structures/guild.ts'
import { Role } from '../structures/role.ts'
import type { EmojiPayload } from '../types/emoji.ts'
import { CHANNEL, GUILD_EMOJI, GUILD_EMOJIS } from '../types/endpoint.ts'
import { BaseChildManager } from './baseChild.ts'
import type { EmojisManager } from './emojis.ts'
import { fetchAuto } from '../../deps.ts'

export class GuildEmojisManager extends BaseChildManager<EmojiPayload, Emoji> {
  guild: Guild

  constructor(client: Client, parent: EmojisManager, guild: Guild) {
    super(client, parent as any)
    this.guild = guild
  }

  async get(id: string): Promise<Emoji | undefined> {
    const res = await this.parent.get(id)
    if (res !== undefined && res.guild?.id === this.guild.id) return res
    else return undefined
  }

  async size(): Promise<number> {
    return (
      (await this.client.cache.size(
        this.parent.cacheName,
        (d) => d.guild_id === this.guild.id
      )) ?? 0
    )
  }

  async delete(id: string): Promise<boolean> {
    return this.client.rest.delete(CHANNEL(id))
  }

  async fetch(id: string): Promise<Emoji | undefined> {
    return await new Promise((resolve, reject) => {
      this.client.rest
        .get(GUILD_EMOJI(this.guild.id, id))
        .then(async (data) => {
          const emoji = new Emoji(this.client, data as EmojiPayload)
          data.guild_id = this.guild.id
          await this.set(id, data as EmojiPayload)
          emoji.guild = this.guild
          resolve(emoji)
        })
        .catch((e) => reject(e))
    })
  }

  async create(
    name: string,
    url: string,
    roles?: Role[] | string[] | string
  ): Promise<Emoji | undefined> {
    let data = url
    if (!data.startsWith('data:')) {
      data = await fetchAuto(url)
    }
    return await new Promise((resolve, reject) => {
      let roleIDs: string[] = []
      if (roles !== undefined && typeof roles === 'string') roleIDs = [roles]
      else if (roles !== undefined) {
        if (roles?.length === 0)
          reject(new Error('Empty Roles array was provided'))
        if (roles[0] instanceof Role)
          roleIDs = (roles as any).map((r: Role) => r.id)
        else roleIDs = roles as string[]
      } else roles = [this.guild.id]
      this.client.rest
        .post(GUILD_EMOJIS(this.guild.id), {
          name,
          image: data,
          roles: roleIDs
        })
        .then(async (data) => {
          const emoji = new Emoji(this.client, data as EmojiPayload)
          data.guild_id = this.guild.id
          await this.set(data.id, data as EmojiPayload)
          emoji.guild = this.guild
          resolve(emoji)
        })
        .catch((e) => reject(e))
    })
  }

  async array(): Promise<Emoji[]> {
    const arr = (await this.parent.array()) as Emoji[]
    return arr.filter(
      (c: any) => c.guild !== undefined && c.guild.id === this.guild.id
    ) as any
  }

  async flush(): Promise<boolean> {
    const arr = await this.array()
    for (const elem of arr) {
      const emojiID = elem.id !== null ? elem.id : elem.name
      this.parent._delete(emojiID as string)
    }
    return true
  }

  async keys(): Promise<string[]> {
    const result = []
    for (const raw of (await this.client.cache.array(this.parent.cacheName)) ??
      []) {
      if (raw.guild_id === this.guild.id) result.push(raw.id)
    }
    return result
  }
}
