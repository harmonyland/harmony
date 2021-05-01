import {
  InteractionMessageComponentData,
  MessageComponentType
} from '../types/messageComponents.ts'
import { Interaction } from './interactions.ts'
import type { Client } from '../client/mod.ts'
import { InteractionPayload } from '../types/interactions.ts'
import type { Guild } from './guild.ts'
import type { GuildTextChannel } from './guildTextChannel.ts'
import type { Member } from './member.ts'
import type { TextChannel } from './textChannel.ts'
import { User } from './user.ts'
import { Message } from './message.ts'

export class MessageComponentInteraction extends Interaction {
  data: InteractionMessageComponentData
  declare message: Message

  constructor(
    client: Client,
    data: InteractionPayload,
    others: {
      channel?: TextChannel | GuildTextChannel
      guild?: Guild
      member?: Member
      user: User
      message?: Message
    }
  ) {
    super(client, data, others)
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    this.data = data.data as InteractionMessageComponentData
  }

  get customID(): string {
    return this.data.custom_id
  }

  get componentType(): MessageComponentType {
    return this.data.component_type
  }
}
