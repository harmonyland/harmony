import { Client } from '../models/client.ts'
import { INTERACTION_CALLBACK } from '../types/endpoint.ts'
import {
  InteractionData,
  InteractionPayload,
  InteractionResponsePayload,
  InteractionResponseType
} from '../types/slash.ts'
import { Embed } from './embed.ts'
import { Guild } from './guild.ts'
import { Member } from './member.ts'
import { GuildTextChannel } from './textChannel.ts'
import { User } from './user.ts'

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
  id: string
  data: InteractionData
  channel: GuildTextChannel
  guild: Guild
  member: Member

  constructor(
    client: Client,
    data: InteractionPayload,
    others: {
      channel: GuildTextChannel
      guild: Guild
      member: Member
    }
  ) {
    this.client = client
    this.type = data.type
    this.token = data.token
    this.member = others.member
    this.id = data.id
    this.data = data.data
    this.guild = others.guild
    this.channel = others.channel
  }

  get user(): User {
    return this.member.user
  }

  get name(): string {
    return this.data.name
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
