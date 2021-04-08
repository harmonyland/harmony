import type { Client } from '../client/mod.ts'
import { BaseChildManager } from './baseChild.ts'
import type { VoiceStatePayload } from '../types/voice.ts'
import { VoiceState } from '../structures/voiceState.ts'
import { GuildVoiceStatesManager } from './guildVoiceStates.ts'
import type { VoiceChannel } from '../structures/guildVoiceChannel.ts'

export class GuildChannelVoiceStatesManager extends BaseChildManager<
  VoiceStatePayload,
  VoiceState
> {
  channel: VoiceChannel

  constructor(
    client: Client,
    parent: GuildVoiceStatesManager,
    channel: VoiceChannel
  ) {
    super(client, parent as any)
    this.channel = channel
  }

  async get(id: string): Promise<VoiceState | undefined> {
    const res = await this.parent.get(id)
    if (res !== undefined && res.channel?.id === this.channel.id) return res
    else return undefined
  }

  async array(): Promise<VoiceState[]> {
    const arr = (await this.parent.array()) as VoiceState[]
    return arr.filter((c: any) => c.channel?.id === this.channel.id) as any
  }

  async fromPayload(d: VoiceStatePayload[]): Promise<void> {
    for (const data of d) {
      await this.set(data.user_id, data)
    }
  }
}
