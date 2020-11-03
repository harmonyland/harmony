import { Client } from "../models/client.ts";
import { Channel } from "../structures/channel.ts";
import { Guild } from "../structures/guild.ts";
import { CategoryChannel } from "../structures/guildCategoryChannel.ts";
import { GuildTextChannel } from "../structures/guildTextChannel.ts";
import { VoiceChannel } from "../structures/guildVoiceChannel.ts";
import { GuildChannelCategoryPayload, GuildTextChannelPayload, GuildVoiceChannelPayload } from "../types/channel.ts";
import { CHANNEL } from "../types/endpoint.ts";
import { BaseChildManager } from "./BaseChildManager.ts";
import { ChannelsManager } from "./ChannelsManager.ts";

export type GuildChannelPayloads = GuildTextChannelPayload | GuildVoiceChannelPayload | GuildChannelCategoryPayload
export type GuildChannel = GuildTextChannel | VoiceChannel | CategoryChannel

export class GuildChannelsManager extends BaseChildManager<GuildChannelPayloads, GuildChannel> {
  guild: Guild

  constructor(client: Client, parent: ChannelsManager, guild: Guild) {
    super(client, parent as any)
    this.guild = guild
  }

  async get(id: string): Promise<GuildChannel | undefined> {
    const res = await this.parent.get(id)
    if(res !== undefined && res.guild.id === this.guild.id) return res
    else return undefined
  }

  async delete(id: string): Promise<boolean> {
    return this.client.rest.delete(CHANNEL(id))
  }

  async array(): Promise<GuildChannel[]> {
    const arr = await this.parent.array() as Channel[]
    return arr.filter((c: any) => c.guild !== undefined && c.guild.id === this.guild.id) as any
  }

  async flush(): Promise<boolean> {
    const arr = await this.array()
    for (const elem of arr) {
      this.parent.delete(elem.id)
    }
    return true
  }
}