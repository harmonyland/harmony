import type { Client } from '../client/mod.ts'
import { InteractionPayload } from '../types/interactions.ts'
import {
  InteractionApplicationCommandData,
  InteractionApplicationCommandOption,
  SlashCommandOptionType
} from '../types/slashCommands.ts'
import type { Dict } from '../utils/dict.ts'
import type { Guild } from './guild.ts'
import type { GuildTextChannel } from './guildTextChannel.ts'
import type { Member } from './member.ts'
import type { Role } from './role.ts'
import type { TextChannel } from './textChannel.ts'
import { User } from './user.ts'
import {
  InteractionUser,
  InteractionChannel,
  Interaction
} from './interactions.ts'

export interface InteractionApplicationCommandResolved {
  users: Dict<InteractionUser>
  members: Dict<Member>
  channels: Dict<InteractionChannel>
  roles: Dict<Role>
}

export class SlashCommandInteraction extends Interaction {
  /** Data sent with Interaction. Only applies to Application Command */
  data: InteractionApplicationCommandData
  /** Resolved data for Snowflakes in Slash Command Arguments */
  resolved: InteractionApplicationCommandResolved

  constructor(
    client: Client,
    data: InteractionPayload,
    others: {
      channel?: TextChannel | GuildTextChannel
      guild?: Guild
      member?: Member
      user: User
      resolved: InteractionApplicationCommandResolved
    }
  ) {
    super(client, data, others)
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    this.data = data.data as InteractionApplicationCommandData
    this.resolved = others.resolved
  }

  /** Name of the Command Used (may change with future additions to Interactions!) */
  get name(): string {
    return this.data.name
  }

  get options(): InteractionApplicationCommandOption[] {
    return this.data.options ?? []
  }

  /** Get an option by name */
  option<T>(name: string): T {
    let options = this.options
    while (
      options.length === 1 &&
      (options[0].type === SlashCommandOptionType.SUB_COMMAND_GROUP ||
        options[0].type === SlashCommandOptionType.SUB_COMMAND)
    ) {
      options = options[0].options ?? []
    }
    const op = options.find((e) => e.name === name)
    if (op === undefined || op.value === undefined) return undefined as any
    if (op.type === SlashCommandOptionType.USER) {
      const u: InteractionUser = this.resolved.users[op.value] as any
      if (this.resolved.members[op.value] !== undefined)
        u.member = this.resolved.members[op.value]
      return u as any
    } else if (op.type === SlashCommandOptionType.ROLE)
      return this.resolved.roles[op.value] as any
    else if (op.type === SlashCommandOptionType.CHANNEL)
      return this.resolved.channels[op.value] as any
    else return op.value
  }
}
