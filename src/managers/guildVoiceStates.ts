import { Client } from '../models/client.ts'
import { Guild } from '../structures/guild.ts'
import { VoiceChannel } from '../structures/guildVoiceChannel.ts'
import { User } from '../structures/user.ts'
import { VoiceState } from '../structures/voiceState.ts'
import { VoiceStatePayload } from '../types/voice.ts'
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

  async get(key: string): Promise<VoiceState | undefined> {
    const raw = await this._get(key)
    if (raw === undefined) return

    const guild =
      raw.guild_id === undefined
        ? undefined
        : await this.client.guilds.get(raw.guild_id)

    return new VoiceState(this.client, raw, {
      user: ((await this.client.users.get(raw.user_id)) as unknown) as User,
      channel:
        raw.channel_id == null
          ? null
          : (((await this.client.channels.get<VoiceChannel>(
              raw.channel_id
            )) as unknown) as VoiceChannel),
      guild,
      member:
        guild === undefined ? undefined : await guild.members.get(raw.user_id)
    })
  }

  async fromPayload(d: VoiceStatePayload[]): Promise<void> {
    for (const data of d) {
      await this.set(data.user_id, data)
    }
  }
}
