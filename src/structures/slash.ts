import { Client } from '../models/client.ts'
import { INTERACTION_CALLBACK } from '../types/endpoint.ts'
import { MemberPayload } from '../types/guild.ts'
import {
  InteractionData,
  InteractionPayload,
  InteractionResponsePayload,
  InteractionResponseType
} from '../types/slash.ts'
import { Embed } from './embed.ts'

export interface InteractionResponse {
  type?: InteractionResponseType
  content?: string
  embeds?: Embed[]
  tts?: boolean
  flags?: number
}

export class Interaction {
  client: Client
  type: number
  token: string
  member: MemberPayload
  id: string
  data: InteractionData

  constructor(client: Client, data: InteractionPayload) {
    this.client = client
    this.type = data.type
    this.token = data.token
    this.member = data.member
    this.id = data.id
    this.data = data.data
  }

  async respond(data: InteractionResponse): Promise<Interaction> {
    const payload: InteractionResponsePayload = {
      type: data.type ?? InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data:
        data.type === undefined ||
        data.type === InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE ||
        data.type === InteractionResponseType.CHANNEL_MESSAGE
          ? {
              content: data.content ?? '',
              embeds: data.embeds,
              tts: data.tts ?? false,
              flags: data.flags ?? undefined
            }
          : undefined
    }

    await this.client.rest.post(
      INTERACTION_CALLBACK(this.id, this.token),
      payload
    )

    return this
  }
}
