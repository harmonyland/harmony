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

export interface ModalSubmitComponentActionRow {
  type: MessageComponentType.ACTION_ROW
  components: ModalSubmitComponentBase[]
}

export type ModalSubmitComponentBase = ModalSubmitComponentTextInput

export interface ModalSubmitComponentTextInput {
  type: MessageComponentType.TEXT_INPUT
  customID: string
  value: string
}

export class ModalSubmitInteraction extends Interaction {
  data: InteractionModalSubmitData
  components: ModalSubmitComponentActionRow[] = []

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
      if (raw.type === MessageComponentType.ACTION_ROW) {
        const components: ModalSubmitComponentBase[] = []
        for (const data of raw.components) {
          components.push({
            type: data.type,
            customID: data.custom_id,
            value: data.value
          })
        }
        this.components.push({
          type: raw.type,
          components
        })
      }
    }
  }

  get customID(): string {
    return this.data.custom_id
  }

  getComponent<T extends ModalSubmitComponentBase>(
    customID: string
  ): T | undefined {
    for (const component of this.components) {
      if (component.type === MessageComponentType.ACTION_ROW) {
        for (const inner of component.components) {
          if (inner.customID === customID) {
            return inner as T
          }
        }
      }
    }
  }
}
