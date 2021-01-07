import { GatewayIntents } from '../types/gateway.ts'

export type PrivilegedIntents = 'GUILD_MEMBERS' | 'GUILD_PRESENCES'

/* eslint-disable @typescript-eslint/no-extraneous-class */
/** Utility class for handling Gateway Intents */
export class Intents {
  static NonPrivileged: number[] = [
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
    ...Intents.NonPrivileged
  ]

  static Presence: number[] = [
    GatewayIntents.GUILD_PRESENCES,
    ...Intents.NonPrivileged
  ]

  static GuildMembers: number[] = [
    GatewayIntents.GUILD_MEMBERS,
    ...Intents.NonPrivileged
  ]

  static None: number[] = [...Intents.NonPrivileged]

  /** Create an Array of Intents easily passing Intents you're privileged for and disable the ones you don't need */
  static create(
    privileged?: PrivilegedIntents[],
    disable?: number[]
  ): number[] {
    let intents: number[] = [...Intents.NonPrivileged]

    if (privileged !== undefined && privileged.length !== 0) {
      if (privileged.includes('GUILD_MEMBERS'))
        intents.push(GatewayIntents.GUILD_MEMBERS)
      if (privileged.includes('GUILD_PRESENCES'))
        intents.push(GatewayIntents.GUILD_PRESENCES)
    }

    if (disable !== undefined) {
      intents = intents.filter((intent) => !disable.includes(intent))
    }

    return intents
  }
}
