import { GatewayIntents } from '../types/gateway.ts'

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class Intents {
  static All: number[] = [
    GatewayIntents.GUILD_MEMBERS,
    GatewayIntents.GUILD_PRESENCES,
    GatewayIntents.GUILD_MESSAGES,
    GatewayIntents.DIRECT_MESSAGES,
    GatewayIntents.DIRECT_MESSAGE_REACTIONS,
    GatewayIntents.DIRECT_MESSAGE_TYPING,
    GatewayIntents.GUILDS,
    GatewayIntents.GUILD_BANS,
    GatewayIntents.GUILD_EMOJIS,
    GatewayIntents.GUILD_INTEGRATIONS,
    GatewayIntents.GUILD_INVITES,
    GatewayIntents.GUILD_MESSAGE_REACTIONS,
    GatewayIntents.GUILD_MESSAGE_TYPING,
    GatewayIntents.GUILD_VOICE_STATES,
    GatewayIntents.GUILD_WEBHOOKS,
  ]

  static Presence: number[] = [
    GatewayIntents.GUILD_PRESENCES,
    GatewayIntents.GUILDS,
  ]

  static GuildMembers: number[] = [
    GatewayIntents.GUILD_MEMBERS,
    GatewayIntents.GUILDS,
    GatewayIntents.GUILD_BANS,
    GatewayIntents.GUILD_VOICE_STATES,
  ]

  static None: number[] = []
}
