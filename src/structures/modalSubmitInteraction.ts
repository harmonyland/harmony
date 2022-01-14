import type { Client } from '../client/client.ts'
import { InteractionPayload } from '../types/interactions.ts'
import {
  InteractionModalSubmitData,
  MessageComponentType
} from '../types/messageComponents.ts'
import { Guild } from './guild.ts'
import { GuildTextChannel } from './guildTextChannel.ts'
import { Interaction } from './interactions.ts'
import { Member } from './member.ts'
import { TextChannel } from './textChannel.ts'
import { User } from './user.ts'

export interface ModalSubmitComponentTextInput {
  type: MessageComponentType.TEXT_INPUT
  customID: string
  value: string
}

export type ModalSubmitComponent = ModalSubmitComponentTextInput

export class ModalSubmitInteraction extends Interaction {
  data: InteractionModalSubmitData
  components: ModalSubmitComponent[] = []

  constructor(
    client: Client,
    data: InteractionPayload,
    others: {
      channel?: TextChannel | GuildTextChannel
      guild?: Guild
      member?: Member
      user: User
    }
  ) {
    super(client, data, others)
    this.data = data.data as unknown as InteractionModalSubmitData

    for (const raw of this.data.components) {
      if (raw.type === MessageComponentType.TEXT_INPUT) {
        this.components.push({
          type: raw.type,
          customID: raw.custom_id,
          value: raw.value
        })
      }
    }
  }

  get customID(): string {
    return this.data.custom_id
  }

  getComponent<T extends ModalSubmitComponent>(
    customID: string
  ): T | undefined {
    return this.components.find((e) => e.customID === customID) as T
  }
}
