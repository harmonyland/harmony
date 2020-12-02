import { GatewayIntents } from '../types/gateway.ts'

export type PriviligedIntents = 'GUILD_MEMBERS' | 'GUILD_PRESENCES'

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class Intents {
  static NonPriviliged: number[] = [
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
    GatewayIntents.GUILD_WEBHOOKS
  ]

  static All: number[] = [
    GatewayIntents.GUILD_MEMBERS,
    GatewayIntents.GUILD_PRESENCES,
    ...Intents.NonPriviliged
  ]

  static Presence: number[] = [
    GatewayIntents.GUILD_PRESENCES,
    ...Intents.NonPriviliged
  ]

  static GuildMembers: number[] = [
    GatewayIntents.GUILD_MEMBERS,
    ...Intents.NonPriviliged
  ]

  static None: number[] = [...Intents.NonPriviliged]

  static create(
    priviliged?: PriviligedIntents[],
    disable?: number[]
  ): number[] {
    let intents: number[] = [...Intents.NonPriviliged]

    if (priviliged !== undefined && priviliged.length !== 0) {
      if (priviliged.includes('GUILD_MEMBERS'))
        intents.push(GatewayIntents.GUILD_MEMBERS)
      if (priviliged.includes('GUILD_PRESENCES'))
        intents.push(GatewayIntents.GUILD_PRESENCES)
    }

    if (disable !== undefined) {
      intents = intents.filter((intent) => !disable.includes(intent))
    }

    return intents
  }
}
