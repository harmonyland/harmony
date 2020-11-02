import { Client } from "../models/client.ts";
import { Channel } from "../structures/channel.ts";
import { Guild } from "../structures/guild.ts";
import { CategoryChannel } from "../structures/guildCategoryChannel.ts";
import { GuildTextChannel } from "../structures/guildTextChannel.ts";
import { VoiceChannel } from "../structures/guildVoiceChannel.ts";
import { GuildChannelCategoryPayload, GuildTextChannelPayload, GuildVoiceChannelPayload } from "../types/channel.ts";
import { CHANNEL } from "../types/endpoint.ts";
import { BaseChildManager } from "./BaseChildManager.ts";
import { BaseManager } from "./BaseManager.ts";
import { ChannelsManager } from "./ChannelsManager.ts";

export type GuildChannelPayload = GuildTextChannelPayload | GuildVoiceChannelPayload | GuildChannelCategoryPayload
export type GuildChannel = GuildTextChannel | VoiceChannel | CategoryChannel

export class GuildChannelsManager extends BaseChildManager<GuildChannelPayload, GuildChannel> {
  guild: Guild

  constructor(client: Client, parent: ChannelsManager, guild: Guild) {
    super(client, parent as any)
    this.guild = guild
  }

  async get(id: string): Promise<GuildChannel | void> {
    const res = await this.parent.get(id)
    if(res && res.guild.id == this.guild.id) return res
    else return
  }

  delete(id: string) {
    return this.client.rest.delete(CHANNEL(id))
  }

  async array(): Promise<GuildChannel[]> {
    let arr = await this.parent.array() as Channel[]
    return arr as any//.filter((c: any) => c.guild && c.guild.id == this.guild.id) as any
  }

  async flush() {
    let arr = await this.array()
    for (let elem of arr) {
      this.parent.delete(elem.id)
    }
    return true
  }
}