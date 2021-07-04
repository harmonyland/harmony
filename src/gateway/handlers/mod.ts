import type { GatewayEventHandler } from '../mod.ts'
import type {
  GatewayEvents,
  MessageDeletePayload,
  TypingStartGuildData
} from '../../types/gateway.ts'
import { channelCreate } from './channelCreate.ts'
import { channelDelete } from './channelDelete.ts'
import { channelUpdate } from './channelUpdate.ts'
import { channelPinsUpdate } from './channelPinsUpdate.ts'
import { guildCreate } from './guildCreate.ts'
import { guildDelete } from './guildDelete.ts'
import { guildUpdate } from './guildUpdate.ts'
import { guildBanAdd } from './guildBanAdd.ts'
import { ready } from './ready.ts'
import { guildBanRemove } from './guildBanRemove.ts'
import { messageCreate } from './messageCreate.ts'
import { resume } from './resume.ts'
import { reconnect } from './reconnect.ts'
import { messageDelete } from './messageDelete.ts'
import { messageUpdate } from './messageUpdate.ts'
import { guildEmojiUpdate } from './guildEmojiUpdate.ts'
import { guildMemberAdd } from './guildMemberAdd.ts'
import { guildMemberRemove } from './guildMemberRemove.ts'
import { guildMemberUpdate } from './guildMemberUpdate.ts'
import { guildRoleCreate } from './guildRoleCreate.ts'
import { guildRoleDelete } from './guildRoleDelete.ts'
import { guildRoleUpdate } from './guildRoleUpdate.ts'
import { guildIntegrationsUpdate } from './guildIntegrationsUpdate.ts'
import { webhooksUpdate } from './webhooksUpdate.ts'
import { messageDeleteBulk } from './messageDeleteBulk.ts'
import { userUpdate } from './userUpdate.ts'
import { typingStart } from './typingStart.ts'
import type { TextChannel } from '../../structures/textChannel.ts'
import { GuildTextBasedChannel } from '../../structures/guildTextChannel.ts'
import type { Guild } from '../../structures/guild.ts'
import type { User } from '../../structures/user.ts'
import type { Emoji } from '../../structures/emoji.ts'
import type { Member } from '../../structures/member.ts'
import type { Role } from '../../structures/role.ts'
import type { Message } from '../../structures/message.ts'
import type { Collection } from '../../utils/collection.ts'
import { voiceServerUpdate } from './voiceServerUpdate.ts'
import { voiceStateUpdate } from './voiceStateUpdate.ts'
import type { VoiceState } from '../../structures/voiceState.ts'
import { messageReactionAdd } from './messageReactionAdd.ts'
import { messageReactionRemove } from './messageReactionRemove.ts'
import { messageReactionRemoveAll } from './messageReactionRemoveAll.ts'
import { messageReactionRemoveEmoji } from './messageReactionRemoveEmoji.ts'
import { guildMembersChunk } from './guildMembersChunk.ts'
import { presenceUpdate } from './presenceUpdate.ts'
import { inviteCreate } from './inviteCreate.ts'
import { inviteDelete } from './inviteDelete.ts'
import type { MessageReaction } from '../../structures/messageReaction.ts'
import type { Invite } from '../../structures/invite.ts'
import type { Presence } from '../../structures/presence.ts'
import type {
  EveryChannelTypes,
  EveryTextChannelTypes
} from '../../utils/channel.ts'
import { interactionCreate } from './interactionCreate.ts'
import type { Interaction } from '../../structures/interactions.ts'
import type { CommandContext } from '../../commands/command.ts'
import type { RequestMethods } from '../../rest/types.ts'
import type { PartialInvitePayload } from '../../types/invite.ts'
import type { GuildChannels } from '../../types/guild.ts'
import { applicationCommandCreate } from './applicationCommandCreate.ts'
import { applicationCommandDelete } from './applicationCommandDelete.ts'
import { applicationCommandUpdate } from './applicationCommandUpdate.ts'
import type { SlashCommand } from '../../interactions/slashCommand.ts'
import type {
  ThreadChannel,
  ThreadMember
} from '../../structures/threadChannel.ts'
import { threadCreate } from './threadCreate.ts'
import { threadDelete } from './threadDelete.ts'
import { threadUpdate } from './threadUpdate.ts'
import { threadMembersUpdate } from './threadMembersUpdate.ts'
import { threadMemberUpdate } from './threadMemberUpdate.ts'
import { threadListSync } from './threadListSync.ts'

export const gatewayHandlers: {
  [eventCode in GatewayEvents]: GatewayEventHandler | undefined
} = {
  READY: ready,
  APPLICATION_COMMAND_CREATE: applicationCommandCreate,
  APPLICATION_COMMAND_DELETE: applicationCommandDelete,
  APPLICATION_COMMAND_UPDATE: applicationCommandUpdate,
  RECONNECT: reconnect,
  RESUMED: resume,
  CHANNEL_CREATE: channelCreate,
  CHANNEL_DELETE: channelDelete,
  CHANNEL_UPDATE: channelUpdate,
  CHANNEL_PINS_UPDATE: channelPinsUpdate,
  GUILD_CREATE: guildCreate,
  GUILD_DELETE: guildDelete,
  GUILD_UPDATE: guildUpdate,
  GUILD_BAN_ADD: guildBanAdd,
  GUILD_BAN_REMOVE: guildBanRemove,
  GUILD_EMOJIS_UPDATE: guildEmojiUpdate,
  GUILD_INTEGRATIONS_UPDATE: guildIntegrationsUpdate,
  GUILD_MEMBER_ADD: guildMemberAdd,
  GUILD_MEMBER_REMOVE: guildMemberRemove,
  GUILD_MEMBER_UPDATE: guildMemberUpdate,
  GUILD_MEMBERS_CHUNK: guildMembersChunk,
  GUILD_ROLE_CREATE: guildRoleCreate,
  GUILD_ROLE_UPDATE: guildRoleUpdate,
  GUILD_ROLE_DELETE: guildRoleDelete,
  INVITE_CREATE: inviteCreate,
  INVITE_DELETE: inviteDelete,
  MESSAGE_CREATE: messageCreate,
  MESSAGE_UPDATE: messageUpdate,
  MESSAGE_DELETE: messageDelete,
  MESSAGE_DELETE_BULK: messageDeleteBulk,
  MESSAGE_REACTION_ADD: messageReactionAdd,
  MESSAGE_REACTION_REMOVE: messageReactionRemove,
  MESSAGE_REACTION_REMOVE_ALL: messageReactionRemoveAll,
  MESSAGE_REACTION_REMOVE_EMOJI: messageReactionRemoveEmoji,
  PRESENCE_UPDATE: presenceUpdate,
  TYPING_START: typingStart,
  USER_UPDATE: userUpdate,
  VOICE_STATE_UPDATE: voiceStateUpdate,
  VOICE_SERVER_UPDATE: voiceServerUpdate,
  WEBHOOKS_UPDATE: webhooksUpdate,
  INTERACTION_CREATE: interactionCreate,
  THREAD_CREATE: threadCreate,
  THREAD_DELETE: threadDelete,
  THREAD_UPDATE: threadUpdate,
  THREAD_LIST_SYNC: threadListSync,
  THREAD_MEMBERS_UPDATE: threadMembersUpdate,
  THREAD_MEMBER_UPDATE: threadMemberUpdate
}

export interface VoiceServerUpdateData {
  token: string
  endpoint: string
  guild: Guild
}

/** All Client Events */
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type ClientEvents = {
  /** When Client has successfully connected to Discord */
  ready: [shards: number]
  /** When a Shard has recieved READY */
  shardReady: [shard: number]
  /** When all guilds of a Shard are loaded */
  guildsLoaded: [shard: number]
  /** When a reconnect was requested by Discord */
  reconnect: [shard: number]
  /** When a successful session resume has been done */
  resumed: [shard: number]
  /**
   * When a new Channel is created
   * @param channel New Channel object
   */
  channelCreate: [channel: EveryChannelTypes]
  /**
   * When a Channel was deleted
   * @param channel Channel object which was deleted
   */
  channelDelete: [channel: EveryChannelTypes]
  /**
   * Channel's Pinned Messages were updated
   * @param before Channel object before update
   * @param after Channel object after update
   */
  channelPinsUpdate: [
    before: EveryTextChannelTypes,
    after: EveryTextChannelTypes
  ]
  /**
   * A Channel was updated
   * @param before Channel object before update
   * @param after Channel object after update
   */
  channelUpdate: [before: EveryChannelTypes, after: EveryChannelTypes]
  /**
   * A User was banned from a Guild
   * @param guild The Guild from which User was banned
   * @param user The User who was banned
   */
  guildBanAdd: [guild: Guild, user: User]
  /**
   * A ban from a User in Guild was elevated
   * @param guild Guild from which ban was removed
   * @param user User of which ban was elevated
   */
  guildBanRemove: [guild: Guild, user: User]
  /**
   * Client has joined a new Guild.
   * @param guild The new Guild object
   */
  guildCreate: [guild: Guild]
  /**
   * A Guild was successfully loaded.
   * @param guild The Guild object
   */
  guildLoaded: [guild: Guild]
  /**
   * A Guild in which Client was either deleted, or bot was kicked
   * @param guild The Guild object
   */
  guildDelete: [guild: Guild]
  /**
   * A new Emoji was added to Guild
   * @param guild Guild in which Emoji was added
   * @param emoji The Emoji which was added
   */
  guildEmojiAdd: [emoji: Emoji]
  /**
   * An Emoji was deleted from Guild
   * @param emoji Emoji which was deleted
   */
  guildEmojiDelete: [emoji: Emoji]
  /**
   * An Emoji in a Guild was updated
   * @param before Emoji object before update
   * @param after Emoji object after update
   */
  guildEmojiUpdate: [before: Emoji, after: Emoji]
  /**
   * Guild's Integrations were updated
   * @param guild The Guild object
   */
  guildIntegrationsUpdate: [guild: Guild]
  /**
   * Guild's Emojis were updated
   * @param guild The Guild object
   */
  guildEmojisUpdate: [guild: Guild]
  /**
   * A new Member has joined a Guild
   * @param member The Member object
   */
  guildMemberAdd: [member: Member]
  /**
   * A Guild Member has either left or was kicked from Guild
   * @param member The Member object
   */
  guildMemberRemove: [member: Member]
  /**
   * A Guild Member was updated. Nickname changed, role assigned, etc.
   * @param before Member object before update
   * @param after Member object after update
   */
  guildMemberUpdate: [before: Member, after: Member]
  /**
   * A new Role was created in Guild
   * @param role The new Role object
   */
  guildRoleCreate: [role: Role]
  /**
   * A Role was deleted from the Guild
   * @param role The Role object
   */
  guildRoleDelete: [role: Role]
  /**
   * A Role was updated in a Guild
   * @param before Role object before update
   * @param after Role object after updated
   */
  guildRoleUpdate: [before: Role, after: Role]
  /**
   * A Guild has been updated. For example name, icon, etc.
   * @param before Guild object before update
   * @param after Guild object after update
   */
  guildUpdate: [before: Guild, after: Guild]
  guildUnavailable: [guild: Guild]
  /**
   * A new Message was created (sent)
   * @param message The new Message object
   */
  messageCreate: [message: Message]
  /**
   * A Message was deleted.
   * @param message The Message object
   */
  messageDelete: [message: Message]
  /**
   * Messages were bulk deleted in a Guild Text Channel
   * @param channel Channel in which Messages were deleted
   * @param messages Collection of Messages deleted
   * @param uncached Set of Messages deleted's IDs which were not cached
   */
  messageDeleteBulk: [
    channel: GuildTextBasedChannel,
    messages: Collection<string, Message>,
    uncached: Set<string>
  ]
  /**
   * A Message was updated. For example content, embed, etc.
   * @param before Message object before update
   * @param after Message object after update
   */
  messageUpdate: [before: Message, after: Message]
  /**
   * Reaction was added to a Message
   * @param reaction Reaction object
   * @param user User who added the reaction
   */
  messageReactionAdd: [reaction: MessageReaction, user: User]
  /**
   * Reaction was removed fro a Message
   * @param reaction Reaction object
   * @param user User to who removed the reaction
   */
  messageReactionRemove: [reaction: MessageReaction, user: User]
  /**
   * All reactions were removed from a Message
   * @param message Message from which reactions were removed
   */
  messageReactionRemoveAll: [message: Message]
  /**
   * All reactions of a single Emoji were removed
   * @param message The Message object
   * @param emoji The Emoji object
   */
  messageReactionRemoveEmoji: [message: Message, emoji: Emoji]
  /**
   * A User has started typing in a Text Channel
   * @param user User who started typing
   * @param channel Channel which user started typing in
   * @param at Date when user started typing
   * @param guild Guild which user started typing in (can be undefined)
   */
  typingStart: [
    user: User,
    channel: TextChannel,
    at: Date,
    guild: TypingStartGuildData | undefined
  ]
  /**
   * A new Invite was created
   * @param invite New Invite object
   */
  inviteCreate: [invite: Invite]
  /**
   * An Invite was deleted
   * @param invite Invite object
   */
  inviteDelete: [invite: Invite]
  /**
   * A User was updated. For example username, avatar, etc.
   * @param before The User object before update
   * @param after The User object after update
   */
  userUpdate: [before: User, after: User]
  /**
   * Client has received credentials for establishing connection to Voice Server
   * @param data Updated voice server object
   */
  voiceServerUpdate: [data: VoiceServerUpdateData]
  /**
   * A User has joined a Voice Channel
   * @param state Added voice state object
   */
  voiceStateAdd: [state: VoiceState]
  /**
   * A User has left a Voice Channel
   * @param state Removed voice state object
   */
  voiceStateRemove: [state: VoiceState]
  /**
   * Voice State of a User has been updated
   * @param before Voice State object before update
   * @param after Voice State object after update
   */
  voiceStateUpdate: [before: VoiceState, after: VoiceState]
  /**
   * A User's presence has been updated
   * @param presence New Presence
   */
  presenceUpdate: [presence: Presence]
  /**
   * Webhooks of a Channel in a Guild has been updated
   * @param guild Guild in which Webhooks were updated
   * @param channel Channel of which Webhooks were updated
   */
  webhooksUpdate: [guild: Guild, channel: GuildTextBasedChannel]

  /**
   * An Interaction was created
   * @param interaction Created interaction object
   */
  interactionCreate: [interaction: Interaction]

  /**
   * When debug message was made
   * @param message Debug message
   */
  debug: [message: string]

  /**
   * Raw event which gives you access to raw events DISPATCH'd from Gateway
   * @param evt Event name string
   * @param payload Payload JSON of the event
   */
  raw: [evt: string, payload: any, shard: number]

  /**
   * An uncached Message was deleted.
   * @param payload Message Delete Payload
   */
  messageDeleteUncached: [payload: MessageDeletePayload]

  guildMembersChunk: [
    guild: Guild,
    info: {
      chunkIndex: number
      chunkCount: number
      members: string[]
      presences: string[] | undefined
    }
  ]
  guildMembersChunked: [guild: Guild, chunks: number]
  rateLimit: [
    data: {
      method: RequestMethods
      path: string
      global: boolean
      timeout: number
      limit: number
    }
  ]
  inviteDeleteUncached: [invite: PartialInvitePayload]
  voiceStateRemoveUncached: [data: { guild: Guild; member: Member }]
  userUpdateUncached: [user: User]
  webhooksUpdateUncached: [guild: Guild, channelID: string]
  guildRoleUpdateUncached: [role: Role]
  guildMemberUpdateUncached: [member: Member]
  guildMemberRemoveUncached: [member: Member]
  channelUpdateUncached: [channel: GuildChannels]
  slashCommandCreate: [cmd: SlashCommand]
  slashCommandUpdate: [cmd: SlashCommand]
  slashCommandDelete: [cmd: SlashCommand]
  commandOwnerOnly: [ctx: CommandContext]
  commandGuildOnly: [ctx: CommandContext]
  commandDmOnly: [ctx: CommandContext]
  commandNSFW: [ctx: CommandContext]
  commandBotMissingPermissions: [ctx: CommandContext, missing: string[]]
  commandUserMissingPermissions: [ctx: CommandContext, missing: string[]]
  commandMissingArgs: [ctx: CommandContext]
  commandUsed: [ctx: CommandContext]
  commandError: [ctx: CommandContext, err: Error]
  gatewayError: [err: ErrorEvent, shards: [number, number]]

  threadCreate: [thread: ThreadChannel]
  threadDelete: [thread: ThreadChannel]
  threadDeleteUncached: [thread: string]
  threadUpdate: [old: ThreadChannel, new: ThreadChannel]
  threadUpdateUncached: [thread: ThreadChannel]
  threadListSync: [
    guild: Guild,
    threads: Collection<string, ThreadChannel>,
    members: Collection<string, ThreadMember>,
    channels: Collection<string, GuildTextBasedChannel>
  ]
  threadMemberUpdate: [me: ThreadMember]
  threadMembersUpdate: [
    guild: Guild,
    added: Collection<string, ThreadMember>,
    removed: Collection<string, ThreadMember>,
    memberCount: number
  ]
  threadMemberAdd: [member: ThreadMember, guild: Guild]
  threadMemberRemove: [member: ThreadMember, guild: Guild]
}
