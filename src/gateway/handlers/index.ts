import { GatewayEventHandler } from '../index.ts'
import { GatewayEvents, TypingStartGuildData } from '../../types/gateway.ts'
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
import { GuildTextChannel, TextChannel } from '../../structures/textChannel.ts'
import { Guild } from '../../structures/guild.ts'
import { User } from '../../structures/user.ts'
import { Emoji } from '../../structures/emoji.ts'
import { Member } from '../../structures/member.ts'
import { Role } from '../../structures/role.ts'
import { Message } from '../../structures/message.ts'
import { Collection } from '../../utils/collection.ts'
import { voiceServerUpdate } from './voiceServerUpdate.ts'
import { voiceStateUpdate } from './voiceStateUpdate.ts'
import { VoiceState } from '../../structures/voiceState.ts'
import { messageReactionAdd } from './messageReactionAdd.ts'
import { messageReactionRemove } from './messageReactionRemove.ts'
import { messageReactionRemoveAll } from './messageReactionRemoveAll.ts'
import { messageReactionRemoveEmoji } from './messageReactionRemoveEmoji.ts'
import { guildMembersChunk } from './guildMembersChunk.ts'
import { presenceUpdate } from './presenceUpdate.ts'
import { inviteCreate } from './inviteCreate.ts'
import { inviteDelete } from './inviteDelete.ts'
import { MessageReaction } from '../../structures/messageReaction.ts'
import { Invite } from '../../structures/invite.ts'
import { Presence } from '../../structures/presence.ts'
import {
  EveryChannelTypes,
  EveryTextChannelTypes
} from '../../utils/getChannelByType.ts'

export const gatewayHandlers: {
  [eventCode in GatewayEvents]: GatewayEventHandler | undefined
} = {
  READY: ready,
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
  WEBHOOKS_UPDATE: webhooksUpdate
}

export interface EventTypes {
  [name: string]: (...args: any[]) => void
}

export interface VoiceServerUpdateData {
  token: string
  endpoint: string
  guild: Guild
}

export interface ClientEvents extends EventTypes {
  /** When Client has successfully connected to Discord */
  ready: () => void
  /** When a successful reconnect has been made */
  reconnect: () => void
  /** When a successful session resume has been done */
  resumed: () => void
  /**
   * When a new Channel is created
   * @param channel New Channel object
   */
  channelCreate: (channel: EveryChannelTypes) => void
  /**
   * When a Channel was deleted
   * @param channel Channel object which was deleted
   */
  channelDelete: (channel: EveryChannelTypes) => void
  /**
   * Channel's Pinned Messages were updated
   * @param before Channel object before update
   * @param after Channel object after update
   */
  channelPinsUpdate: (
    before: EveryTextChannelTypes,
    after: EveryTextChannelTypes
  ) => void
  /**
   * A Channel was updated
   * @param before Channel object before update
   * @param after Channel object after update
   */
  channelUpdate: (before: EveryChannelTypes, after: EveryChannelTypes) => void
  /**
   * A User was banned from a Guild
   * @param guild The Guild from which User was banned
   * @param user The User who was banned
   */
  guildBanAdd: (guild: Guild, user: User) => void
  /**
   * A ban from a User in Guild was elevated
   * @param guild Guild from which ban was removed
   * @param user User of which ban was elevated
   */
  guildBanRemove: (guild: Guild, user: User) => void
  /**
   * Client has joined a new Guild.
   * @param guild The new Guild object
   */
  guildCreate: (guild: Guild) => void
  /**
   * A Guild in which Client was either deleted, or bot was kicked
   * @param guild The Guild object
   */
  guildDelete: (guild: Guild) => void
  /**
   * A new Emoji was added to Guild
   * @param guild Guild in which Emoji was added
   * @param emoji The Emoji which was added
   */
  guildEmojiAdd: (guild: Guild, emoji: Emoji) => void
  /**
   * An Emoji was deleted from Guild
   * @param guild Guild from which Emoji was deleted
   * @param emoji Emoji which was deleted
   */
  guildEmojiDelete: (guild: Guild, emoji: Emoji) => void
  /**
   * An Emoji in a Guild was updated
   * @param guild Guild in which Emoji was updated
   * @param before Emoji object before update
   * @param after Emoji object after update
   */
  guildEmojiUpdate: (guild: Guild, before: Emoji, after: Emoji) => void
  /**
   * Guild's Integrations were updated
   * @param guild The Guild object
   */
  guildIntegrationsUpdate: (guild: Guild) => void
  /**
   * A new Member has joined a Guild
   * @param member The Member object
   */
  guildMemberAdd: (member: Member) => void
  /**
   * A Guild Member has either left or was kicked from Guild
   * @param member The Member object
   */
  guildMemberRemove: (member: Member) => void
  /**
   * A Guild Member was updated. Nickname changed, role assigned, etc.
   * @param before Member object before update
   * @param after Meber object after update
   */
  guildMemberUpdate: (before: Member, after: Member) => void
  /**
   * A new Role was created in Guild
   * @param role The new Role object
   */
  guildRoleCreate: (role: Role) => void
  /**
   * A Role was deleted from the Guild
   * @param role The Role object
   */
  guildRoleDelete: (role: Role) => void
  /**
   * A Role was updated in a Guild
   * @param before Role object before update
   * @param after Role object after updated
   */
  guildRoleUpdate: (before: Role, after: Role) => void
  /**
   * A Guild has been updated. For example name, icon, etc.
   * @param before Guild object before update
   * @param after Guild object after update
   */
  guildUpdate: (before: Guild, after: Guild) => void
  /**
   * A new Message was created (sent)
   * @param message The new Message object
   */
  messageCreate: (message: Message) => void
  /**
   * A Message was deleted.
   * @param message The Message object
   */
  messageDelete: (message: Message) => void
  /**
   * Messages were bulk deleted in a Guild Text Channel
   * @param channel Channel in which Messages were deleted
   * @param messages Collection of Messages deleted
   * @param uncached Set of Messages deleted's IDs which were not cached
   */
  messageDeleteBulk: (
    channel: GuildTextChannel,
    messages: Collection<string, Message>,
    uncached: Set<string>
  ) => void
  /**
   * A Message was updated. For example content, embed, etc.
   * @param before Message object before update
   * @param after Message object after update
   */
  messageUpdate: (before: Message, after: Message) => void
  /**
   * Reaction was added to a Message
   * @param reaction Reaction object
   * @param user User who added the reaction
   */
  messageReactionAdd: (reaction: MessageReaction, user: User) => void
  /**
   * Reaction was removed fro a Message
   * @param reaction Reaction object
   * @param user User to who removed the reaction
   */
  messageReactionRemove: (reaction: MessageReaction, user: User) => void
  /**
   * All reactions were removed from a Message
   * @param message Message from which reactions were removed
   */
  messageReactionRemoveAll: (message: Message) => void
  /**
   * All reactions of a single Emoji were removed
   * @param message The Message object
   * @param emoji The Emoji object
   */
  messageReactionRemoveEmoji: (message: Message, emoji: Emoji) => void
  /**
   * A User has started typing in a Text Channel
   */
  typingStart: (
    user: User,
    channel: TextChannel,
    at: Date,
    guildData?: TypingStartGuildData
  ) => void
  /**
   * A new Invite was created
   * @param invite New Invite object
   */
  inviteCreate: (invite: Invite) => void
  /**
   * An Invite was deleted
   * @param invite Invite object
   */
  inviteDelete: (invite: Invite) => void
  /**
   * A User was updated. For example username, avatar, etc.
   * @param before The User object before update
   * @param after The User object after update
   */
  userUpdate: (before: User, after: User) => void
  /**
   * Client has received credentials for establishing connection to Voice Server
   */
  voiceServerUpdate: (data: VoiceServerUpdateData) => void
  /**
   * A User has joined a Voice Channel
   */
  voiceStateAdd: (state: VoiceState) => void
  /**
   * A User has left a Voice Channel
   */
  voiceStateRemove: (state: VoiceState) => void
  /**
   * Voice State of a User has been updated
   * @param before Voice State object before update
   * @param after Voice State object after update
   */
  voiceStateUpdate: (state: VoiceState, after: VoiceState) => void
  /**
   * A User's presence has been updated
   * @param presence New Presence
   */
  presenceUpdate: (presence: Presence) => void
  /**
   * Webhooks of a Channel in a Guild has been updated
   * @param guild Guild in which Webhooks were updated
   * @param channel Channel of which Webhooks were updated
   */
  webhooksUpdate: (guild: Guild, channel: GuildTextChannel) => void
}
