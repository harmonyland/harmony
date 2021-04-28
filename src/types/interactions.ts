import {
  AllowedMentionsPayload,
  EmbedPayload,
  MessagePayload
} from './channel.ts'
import type { MemberPayload } from './guild.ts'
import type { InteractionApplicationCommandData } from './slashCommands.ts'
import type { UserPayload } from './user.ts'

export enum InteractionType {
  /** Ping sent by the API (HTTP-only) */
  PING = 1,
  /** Slash Command Interaction */
  APPLICATION_COMMAND = 2
}

export interface InteractionMemberPayload extends MemberPayload {
  /** Permissions of the Member who initiated Interaction (Guild-only) */
  permissions: string
}

export interface InteractionPayload {
  /** Type of the Interaction */
  type: InteractionType
  /** Token of the Interaction to respond */
  token: string
  /** Member object of user who invoked */
  member?: InteractionMemberPayload
  /** User who initiated Interaction (only in DMs) */
  user?: UserPayload
  /** ID of the Interaction */
  id: string
  /**
   * Data sent with the interaction. Undefined only when Interaction is PING (http-only).*
   */
  data?: InteractionApplicationCommandData
  /** ID of the Guild in which Interaction was invoked */
  guild_id?: string
  /** ID of the Channel in which Interaction was invoked */
  channel_id?: string
  /** Application ID of the Client who received interaction */
  application_id: string
  /** Message ID if the Interaction was of type MESSAGE_COMPONENT */
  message?: MessagePayload
}

export enum InteractionResponseType {
  /** Just ack a ping, Http-only. */
  PONG = 1,
  /** Send a channel message as response. */
  CHANNEL_MESSAGE_WITH_SOURCE = 4,
  /** Let the user know bot is processing ("thinking") and you can edit the response later */
  DEFERRED_CHANNEL_MESSAGE = 5
}

export interface InteractionResponsePayload {
  /** Type of the response */
  type: InteractionResponseType
  /** Data to be sent with response. Optional for types: Pong, Acknowledge, Ack with Source */
  data?: InteractionResponseDataPayload
}

export interface InteractionResponseDataPayload {
  tts?: boolean
  /** Text content of the Response (Message) */
  content: string
  /** Upto 10 Embed Objects to send with Response */
  embeds?: EmbedPayload[]
  /** Allowed Mentions object */
  allowed_mentions?: AllowedMentionsPayload
  flags?: number
}

export enum InteractionResponseFlags {
  /** A Message which is only visible to Interaction User. */
  EPHEMERAL = 1 << 6
}
