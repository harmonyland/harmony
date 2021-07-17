import type { Client } from '../client/mod.ts'
import type { Guild } from '../structures/guild.ts'
import type { VoiceChannel } from '../structures/guildVoiceChannel.ts'
import type { User } from '../structures/user.ts'
import { VoiceState } from '../structures/voiceState.ts'
import type { VoiceStatePayload } from '../types/voice.ts'
import { BaseManager } from './base.ts'

export class GuildVoiceStatesManager extends BaseManager<
  VoiceStatePayload,
  VoiceState
> {
  guild: Guild

  constructor(client: Client, guild: Guild) {
    super(client, `vs:${guild.id}`, VoiceState)
    this.guild = guild
  }

  /** Get Client's Voice State in the Guild */
  async me(): Promise<VoiceState | undefined> {
    const member = await this.guild.me()
    return await this.get(member.id)
  }

  /** Get a Voice State by User ID */
  async get(key: string): Promise<VoiceState | undefined> {
    const raw = await this._get(key)
    if (raw === undefined) return

    const guild =
      raw.guild_id === undefined
        ? this.guild
        : await this.client.guilds.get(raw.guild_id)

    return new VoiceState(this.client, raw, {
      user: (await this.client.users.get(raw.user_id)) as unknown as User,
      channel:
        raw.channel_id === null
          ? null
          : ((await this.client.channels.get<VoiceChannel>(
              raw.channel_id
            )) as unknown as VoiceChannel),
      guild,
      member:
        guild === undefined ? undefined : await guild.members.get(raw.user_id)
    })
  }

  async array(): Promise<VoiceState[]> {
    let arr = await (this.client.cache.array(
      this.cacheName
    ) as VoiceStatePayload[])
    if (arr === undefined) arr = []

    return await Promise.all(
      arr.map(async (raw) => {
        const guild =
          raw.guild_id === undefined
            ? this.guild
            : await this.client.guilds.get(raw.guild_id)

        return new VoiceState(this.client, raw, {
          user: (await this.client.users.get(raw.user_id)) as unknown as User,
          channel:
            raw.channel_id === null
              ? null
              : ((await this.client.channels.get<VoiceChannel>(
                  raw.channel_id
                )) as unknown as VoiceChannel),
          guild,
          member:
            guild === undefined
              ? undefined
              : await guild.members.get(raw.user_id)
        })
      })
    )
  }

  async fromPayload(d: VoiceStatePayload[]): Promise<void> {
    for (const data of d) {
      await this.set(data.user_id, data)
    }
  }
}
