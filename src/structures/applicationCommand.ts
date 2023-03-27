import type { Client } from '../client/mod.ts'
import { InteractionPayload } from '../types/interactions.ts'
import {
  InteractionApplicationCommandData,
  InteractionApplicationCommandOption,
  ApplicationCommandOptionType
} from '../types/applicationCommand.ts'
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
import type { Message } from './message.ts'
import type { Attachment } from '../types/channel.ts'

export interface InteractionApplicationCommandResolved {
  users: Dict<InteractionUser>
  members: Dict<Member>
  channels: Dict<InteractionChannel>
  roles: Dict<Role>
  messages: Dict<Message>
}

export class ApplicationCommandInteraction extends Interaction {
  declare locale: string
  declare guildLocale: string

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

  /** Application Command options. Sub Command (and Group) nesting is stripped off for this */
  get options(): InteractionApplicationCommandOption[] {
    let options = this.data.options ?? []
    while (
      options.length === 1 &&
      (options[0].type === ApplicationCommandOptionType.SUB_COMMAND_GROUP ||
        options[0].type === ApplicationCommandOptionType.SUB_COMMAND)
    ) {
      options = options[0].options ?? []
    }
    return options
  }

  /** Gets sub command name from options */
  get subCommand(): string | undefined {
    if (
      this.data.options?.[0]?.type === ApplicationCommandOptionType.SUB_COMMAND
    )
      return this.data.options[0].name
    else if (
      this.data.options?.[0]?.type ===
        ApplicationCommandOptionType.SUB_COMMAND_GROUP &&
      this.data.options?.[0]?.options?.[0]?.type ===
        ApplicationCommandOptionType.SUB_COMMAND
    )
      return this.data.options[0].options[0].name
  }

  /** Gets sub command group name from options */
  get subCommandGroup(): string | undefined {
    if (
      this.data.options?.[0]?.type ===
      ApplicationCommandOptionType.SUB_COMMAND_GROUP
    )
      return this.data.options[0].name
  }

  /** Target ID. Only valid for Context Menu commands */
  get targetID(): string | undefined {
    return this.data.target_id
  }

  /** Target User object. Only valid for User Context Menu commands */
  get targetUser(): User | undefined {
    return this.targetID !== undefined
      ? this.resolved.users[this.targetID]
      : undefined
  }

  /** Target Message object. Only valid for Message Context Menu commands */
  get targetMessage(): Message | undefined {
    return this.targetID !== undefined
      ? this.resolved.messages[this.targetID]
      : undefined
  }

  /** Get an option by name */
  option<
    T extends
      | number
      | string
      | InteractionUser
      | InteractionChannel
      | Role
      | Attachment
      | undefined
  >(name: string): T {
    const options = this.options
    const op = options.find((e) => e.name === name)
    if (op === undefined || op.value === undefined) return undefined as T
    if (op.type === ApplicationCommandOptionType.USER) {
      const u: InteractionUser = this.resolved.users[op.value]
      if (this.resolved.members[op.value] !== undefined)
        u.member = this.resolved.members[op.value]
      return u as T
    } else if (op.type === ApplicationCommandOptionType.ROLE)
      return this.resolved.roles[op.value] as T
    else if (op.type === ApplicationCommandOptionType.CHANNEL)
      return this.resolved.channels[op.value] as T
    else return op.value
  }
}

/**
 * Deprecated, use ApplicationCommandInteraction instead
 * @deprecated
 */
export { ApplicationCommandInteraction as SlashCommandInteraction }
