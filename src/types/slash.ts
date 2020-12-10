import { EmbedPayload } from './channel.ts'
import { MemberPayload } from './guild.ts'

export interface InteractionOption {
  name: string
  value?: any
  options?: any[]
}

export interface InteractionData {
  options: InteractionOption[]
  name: string
  id: string
}

export enum InteractionType {
  PING = 1,
  APPLICATION_COMMAND = 2
}

export interface InteractionPayload {
  type: InteractionType
  token: string
  member: MemberPayload
  id: string
  data: InteractionData
  guild_id: string
  channel_id: string
}

export interface SlashCommandChoice {
  name: string
  value: string
}

export enum SlashCommandOptionType {
  SUB_COMMAND = 1,
  SUB_COMMAND_GROUP = 2,
  STRING = 3,
  INTEGER = 4,
  BOOLEAN = 5,
  USER = 6,
  CHANNEL = 7,
  ROLE = 8
}

export interface SlashCommandOption {
  name: string
  description: string
  type: SlashCommandOptionType
  required: boolean
  choices?: SlashCommandChoice[]
}

export interface SlashCommandPartial {
  name: string
  description: string
  options: SlashCommandOption[]
}

export interface SlashCommandPayload extends SlashCommandPartial {
  id: string
  application_id: string
}

export enum InteractionResponseType {
  PONG = 1,
  ACKNOWLEDGE = 2,
  CHANNEL_MESSAGE = 3,
  CHANNEL_MESSAGE_WITH_SOURCE = 4,
  ACK_WITH_SOURCE = 5
}

export interface InteractionResponsePayload {
  type: InteractionResponseType
  data?: InteractionResponseDataPayload
}

export interface InteractionResponseDataPayload {
  tts?: boolean
  content: string
  embeds?: EmbedPayload[]
  allowed_mentions?: {
    parse?: 'everyone' | 'users' | 'roles'
    roles?: string[]
    users?: string[]
  }
  flags?: number
}
