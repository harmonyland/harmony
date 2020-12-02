import { Guild } from "../structures/guild.ts"
import { VoiceChannel } from "../structures/guildVoiceChannel.ts"
import { Client } from './client.ts'

export interface VoiceOptions {
  guild: Guild,
  channel: VoiceChannel
}

export class VoiceClient {
  client: Client
  ws?: WebSocket
  guild: Guild
  channel: VoiceChannel

  constructor(client: Client, options: VoiceOptions) {
    this.client = client
    this.guild = options.guild
    this.channel = options.channel
  }

  async connect(): Promise<VoiceClient> {
    // TODO(DjDeveloperr): Actually understand what the hell docs say
    return this
  }
}