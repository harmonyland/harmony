import type { ApplicationPayload } from '../types/application.ts'
import type {
  ChannelPayload,
  CreateMessagePayload,
  CreateThreadPayload,
  CreateWebhookMessageBasePayload,
  CreateWebhookMessagePayload,
  EditMessagePayload,
  FollowedChannel,
  MessagePayload,
  OverwritePayload,
  ThreadChannelPayload,
  ThreadMemberPayload
} from '../types/channel.ts'
import type { CreateEmojiPayload, EmojiPayload } from '../types/emoji.ts'
import type { GuildBanAddPayload } from '../types/gateway.ts'
import type { GatewayBotPayload } from '../types/gatewayBot.ts'
import type {
  AuditLogEvents,
  AuditLogPayload,
  GuildBanPayload,
  GuildBeginPrunePayload,
  GuildCreateChannelPayload,
  GuildCreateRolePayload,
  GuildIntegrationPayload,
  GuildPayload,
  GuildPreviewPayload,
  GuildPruneCountPayload,
  GuildWidgetPayload,
  MemberPayload
} from '../types/guild.ts'
import type {
  InvitePayload,
  InviteWithMetadataPayload
} from '../types/invite.ts'
import type { RoleModifyPayload, RolePayload } from '../types/role.ts'
import type { InteractionResponsePayload } from '../types/interactions.ts'
import type {
  SlashCommandPartial,
  SlashCommandPayload
} from '../types/slashCommands.ts'
import type { TemplatePayload } from '../types/template.ts'
import type { UserPayload } from '../types/user.ts'
import type { VoiceRegion } from '../types/voice.ts'
import type { WebhookPayload } from '../types/webhook.ts'
import type { Dict } from '../utils/dict.ts'
import type { RESTManager } from './manager.ts'

function queryString<T>(obj: T): string {
  return Object.entries(obj)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&')
}

export class RESTEndpoints {
  rest!: RESTManager
  constructor(rest: RESTManager) {
    Object.defineProperty(this, 'rest', {
      value: rest,
      enumerable: false
    })
  }

  /**
   * Gets entitlements for a given user. You can use this on your game backend to check entitlements of an arbitrary user, or perhaps in an administrative panel for your support team.
   */
  async getEntitlements(applicationId: string): Promise<any> {
    return this.rest.get(`/applications/${applicationId}/entitlements`)
  }

  /**
   * Fetch an entitlement by its ID. This may be useful in confirming that a user has a given entitlement that another call or the SDK says they do.
   */
  async getEntitlement(
    applicationId: string,
    entitlementId: string
  ): Promise<any> {
    return this.rest.get(
      `/applications/${applicationId}/entitlements/${entitlementId}`
    )
  }

  /**
   * Get all SKUs for an application.
   */
  async getSKUs(applicationId: string): Promise<any> {
    return this.rest.get(`/applications/${applicationId}/skus`)
  }

  /**
   * Marks a given entitlement for the user as consumed, meaning it will no longer be returned in an entitlements check. **Ensure the user was granted whatever items the entitlement was for before consuming it!**
   */
  async consumeSKU(
    applicationId: string,
    entitlementId: string,
    payload: any
  ): Promise<any> {
    return this.rest.post(
      `/applications/${applicationId}/entitlements/${entitlementId}/consume`,
      payload
    )
  }

  /**
   * Deletes a test entitlement for an application. You can only delete entitlements that were "purchased" in developer test mode; these are entitlements of `type == TestModePurchase`. You cannot use this route to delete arbitrary entitlements that users actually purchased.
   */
  async deleteTestEntitlement(
    applicationId: string,
    entitlementId: string
  ): Promise<any> {
    return this.rest.delete(
      `/applications/${applicationId}/entitlements/${entitlementId}`
    )
  }

  /**
   * Creates a discount for the given user on their next purchase of the given SKU. You should call this endpoint from your backend server just before calling [StartPurchase](#DOCS_GAME_SDK_STORE/start-purchase) for the SKU you wish to discount. The user will then see a discounted price for that SKU at time of payment. The discount is automatically consumed after successful purchase or if the TTL expires.
   */
  async createPurchaseDiscount(
    skuId: string,
    userId: string,
    payload: any
  ): Promise<any> {
    return this.rest.put(`/store/skus/${skuId}/discounts/${userId}`, payload)
  }

  /**
   * Deletes the currently active discount on the given SKU for the given user. You **do not need** to call this after a user has made a discounted purchase; successful discounted purchases will automatically remove the discount for that user for subsequent purchases.
   */
  async deletePurchaseDiscount(skuId: string, userId: string): Promise<any> {
    return this.rest.delete(`/store/skus/${skuId}/discounts/${userId}`)
  }

  /**
   * Fetch all of the global commands for your application. Returns an array of [ApplicationCommand](#DOCS_INTERACTIONS_SLASH_COMMANDS/applicationcommand) objects.
   */
  async getGlobalApplicationCommands(
    applicationId: string
  ): Promise<SlashCommandPayload> {
    return this.rest.get(`/applications/${applicationId}/commands`)
  }

  async createGlobalApplicationCommand(
    applicationId: string,
    payload: any
  ): Promise<SlashCommandPayload> {
    return this.rest.post(`/applications/${applicationId}/commands`, payload)
  }

  /**
   * Fetch a global command for your application. Returns an [ApplicationCommand](#DOCS_INTERACTIONS_SLASH_COMMANDS/applicationcommand) object.
   */
  async getGlobalApplicationCommand(
    applicationId: string,
    commandId: string
  ): Promise<SlashCommandPayload[]> {
    return this.rest.get(`/applications/${applicationId}/commands/${commandId}`)
  }

  async editGlobalApplicationCommand(
    applicationId: string,
    commandId: string,
    payload: SlashCommandPartial
  ): Promise<SlashCommandPayload> {
    return this.rest.patch(
      `/applications/${applicationId}/commands/${commandId}`,
      payload
    )
  }

  /**
   * Deletes a global command. Returns `204`.
   */
  async deleteGlobalApplicationCommand(
    applicationId: string,
    commandId: string
  ): Promise<void> {
    return this.rest.delete(
      `/applications/${applicationId}/commands/${commandId}`
    )
  }

  /**
   * Fetch all of the guild commands for your application for a specific guild. Returns an array of [ApplicationCommand](#DOCS_INTERACTIONS_SLASH_COMMANDS/applicationcommand) objects.
   */
  async getGuildApplicationCommands(
    applicationId: string,
    guildId: string
  ): Promise<SlashCommandPayload[]> {
    return this.rest.get(
      `/applications/${applicationId}/guilds/${guildId}/commands`
    )
  }

  /**
   * Takes a list of application commands, overwriting existing commands that are registered globally for this application. Updates will be available in all guilds after 1 hour. Returns `200` and a list of [ApplicationCommand](#DOCS_INTERACTIONS_SLASH_COMMANDS/applicationcommand) objects. Commands that do not already exist will count toward daily application command create limits.
   */
  async bulkOverwriteGlobalApplicationCommands(
    applicationId: string,
    payload: SlashCommandPartial[]
  ): Promise<SlashCommandPayload[]> {
    return this.rest.put(`/applications/${applicationId}/commands`, payload)
  }

  async createGuildApplicationCommand(
    applicationId: string,
    guildId: string,
    payload: SlashCommandPartial
  ): Promise<SlashCommandPayload> {
    return this.rest.post(
      `/applications/${applicationId}/guilds/${guildId}/commands`,
      payload
    )
  }

  /**
   * Fetch a guild command for your application. Returns an [ApplicationCommand](#DOCS_INTERACTIONS_SLASH_COMMANDS/applicationcommand) object.
   */
  async getGuildApplicationCommand(
    applicationId: string,
    guildId: string,
    commandId: string
  ): Promise<SlashCommandPayload> {
    return this.rest.get(
      `/applications/${applicationId}/guilds/${guildId}/commands/${commandId}`
    )
  }

  async editGuildApplicationCommand(
    applicationId: string,
    guildId: string,
    commandId: string,
    payload: SlashCommandPartial
  ): Promise<SlashCommandPayload> {
    return this.rest.patch(
      `/applications/${applicationId}/guilds/${guildId}/commands/${commandId}`,
      payload
    )
  }

  /**
   * Delete a guild command. Returns `204` on success.
   */
  async deleteGuildApplicationCommand(
    applicationId: string,
    guildId: string,
    commandId: string
  ): Promise<void> {
    return this.rest.delete(
      `/applications/${applicationId}/guilds/${guildId}/commands/${commandId}`
    )
  }

  /**
   * Takes a list of application commands, overwriting existing commands for the guild. Returns `200` and a list of [ApplicationCommand](#DOCS_INTERACTIONS_SLASH_COMMANDS/applicationcommand) objects.
   */
  async bulkOverwriteGuildApplicationCommands(
    applicationId: string,
    guildId: string,
    payload: SlashCommandPartial
  ): Promise<SlashCommandPayload[]> {
    return this.rest.put(
      `/applications/${applicationId}/guilds/${guildId}/commands`,
      payload
    )
  }

  /**
   * Create a response to an Interaction from the gateway. Takes an [Interaction response](#DOCS_INTERACTIONS_SLASH_COMMANDS/interaction-response).
   */
  async createInteractionResponse(
    interactionId: string,
    interactionToken: string,
    payload: InteractionResponsePayload
  ): Promise<any> {
    return this.rest.post(
      `/interactions/${interactionId}/${interactionToken}/callback`,
      payload
    )
  }

  /**
   * Edits the initial Interaction response. Functions the same as [Edit Webhook Message](#DOCS_RESOURCES_WEBHOOK/edit-webhook-message).
   */
  async editOriginalInteractionResponse(
    applicationId: string,
    interactionToken: string,
    payload: CreateWebhookMessageBasePayload
  ): Promise<any> {
    return this.rest.patch(
      `/webhooks/${applicationId}/${interactionToken}/messages/@original`,
      payload
    )
  }

  /**
   * Deletes the initial Interaction response. Returns `204` on success.
   */
  async deleteOriginalInteractionResponse(
    applicationId: string,
    interactionToken: string
  ): Promise<void> {
    return this.rest.delete(
      `/webhooks/${applicationId}/${interactionToken}/messages/@original`
    )
  }

  /**
   * Create a followup message for an Interaction. Functions the same as [Execute Webhook](#DOCS_RESOURCES_WEBHOOK/execute-webhook), but `wait` is always true, and `flags` can be set to `64` in the body to send an ephemeral message.
   */
  async createFollowupMessage(
    applicationId: string,
    interactionToken: string,
    payload: CreateWebhookMessageBasePayload
  ): Promise<any> {
    return this.rest.post(
      `/webhooks/${applicationId}/${interactionToken}`,
      payload
    )
  }

  /**
   * Edits a followup message for an Interaction. Functions the same as [Edit Webhook Message](#DOCS_RESOURCES_WEBHOOK/edit-webhook-message).
   */
  async editFollowupMessage(
    applicationId: string,
    interactionToken: string,
    messageId: string,
    payload: CreateWebhookMessageBasePayload
  ): Promise<any> {
    return this.rest.patch(
      `/webhooks/${applicationId}/${interactionToken}/messages/${messageId}`,
      payload
    )
  }

  /**
   * Deletes a followup message for an Interaction. Returns `204` on success.
   */
  async deleteFollowupMessage(
    applicationId: string,
    interactionToken: string,
    messageId: string
  ): Promise<void> {
    return this.rest.delete(
      `/webhooks/${applicationId}/${interactionToken}/messages/${messageId}`
    )
  }

  /**
   * Returns an [audit log](#DOCS_RESOURCES_AUDIT_LOG/audit-log-object) object for the guild. Requires the 'VIEW_AUDIT_LOG' permission.
   */
  async getGuildAuditLog(
    guildId: string,
    params: {
      userId?: string
      actionType?: AuditLogEvents
      before?: string
      limit?: number
    }
  ): Promise<AuditLogPayload> {
    let q = ''
    const entries = Object.entries(params)
    if (entries.length > 0) {
      q = '?'
      for (const [k, v] of entries) {
        if (v === undefined) continue
        q += `${encodeURIComponent(k)}=${encodeURIComponent(
          v?.toString() ?? ''
        )}`
      }
    }
    return this.rest.get(`/guilds/${guildId}/audit-logs${q}`)
  }

  /**
   * Get a channel by ID. Returns a [channel](#DOCS_RESOURCES_CHANNEL/channel-object) object.
   */
  async getChannel(channelId: string): Promise<ChannelPayload> {
    return this.rest.get(`/channels/${channelId}`)
  }

  /**
   * Update a channel's settings. Requires the `MANAGE_CHANNELS` permission for the guild. Returns a [channel](#DOCS_RESOURCES_CHANNEL/channel-object) on success, and a 400 BAD REQUEST on invalid parameters. Fires a [Channel Update](#DOCS_TOPICS_GATEWAY/channel-update) Gateway event. If modifying a category, individual [Channel Update](#DOCS_TOPICS_GATEWAY/channel-update) events will fire for each child channel that also changes. If modifying permission overwrites, the `MANAGE_ROLES` permission is required. Only permissions your bot has in the guild or channel can be allowed/denied (unless your bot has a `MANAGE_ROLES` overwrite in the channel). All JSON parameters are optional.
   */
  async modifyChannel(
    channelId: string,
    payload: Partial<ChannelPayload>
  ): Promise<ChannelPayload> {
    return this.rest.patch(`/channels/${channelId}`, payload)
  }

  /**
   * Delete a channel, or close a private message. Requires the `MANAGE_CHANNELS` permission for the guild. Deleting a category does not delete its child channels; they will have their `parent_id` removed and a [Channel Update](#DOCS_TOPICS_GATEWAY/channel-update) Gateway event will fire for each of them. Returns a [channel](#DOCS_RESOURCES_CHANNEL/channel-object) object on success. Fires a [Channel Delete](#DOCS_TOPICS_GATEWAY/channel-delete) Gateway event.
   */
  async deleteChannel(channelId: string): Promise<void> {
    return this.rest.delete(`/channels/${channelId}`)
  }

  /**
   * Returns the messages for a channel. If operating on a guild channel, this endpoint requires the `VIEW_CHANNEL` permission to be present on the current user. If the current user is missing the 'READ_MESSAGE_HISTORY' permission in the channel then this will return no messages (since they cannot read the message history). Returns an array of [message](#DOCS_RESOURCES_CHANNEL/message-object) objects on success.
   */
  async getChannelMessages(channelId: string): Promise<MessagePayload[]> {
    return this.rest.get(`/channels/${channelId}/messages`)
  }

  /**
   * Returns a specific message in the channel. If operating on a guild channel, this endpoint requires the 'READ_MESSAGE_HISTORY' permission to be present on the current user. Returns a [message](#DOCS_RESOURCES_CHANNEL/message-object) object on success.
   */
  async getChannelMessage(
    channelId: string,
    messageId: string
  ): Promise<MessagePayload> {
    return this.rest.get(`/channels/${channelId}/messages/${messageId}`)
  }

  async createMessage(
    channelId: string,
    payload: CreateMessagePayload
  ): Promise<MessagePayload> {
    return this.rest.post(`/channels/${channelId}/messages`, payload)
  }

  /**
   * Crosspost a message in a News Channel to following channels. This endpoint requires the 'SEND_MESSAGES' permission, if the current user sent the message, or additionally the 'MANAGE_MESSAGES' permission, for all other messages, to be present for the current user.
   * Returns a [message](#DOCS_RESOURCES_CHANNEL/message-object) object.
   */
  async crosspostMessage(
    channelId: string,
    messageId: string
  ): Promise<MessagePayload> {
    return this.rest.post(
      `/channels/${channelId}/messages/${messageId}/crosspost`
    )
  }

  /**
   * Create a reaction for the message. This endpoint requires the 'READ_MESSAGE_HISTORY' permission to be present on the current user. Additionally, if nobody else has reacted to the message using this emoji, this endpoint requires the 'ADD_REACTIONS' permission to be present on the current user. Returns a 204 empty response on success.
   * The `emoji` must be [URL Encoded](https://en.wikipedia.org/wiki/Percent-encoding) or the request will fail with `10014: Unknown Emoji`.
   */
  async createReaction(
    channelId: string,
    messageId: string,
    emoji: string
  ): Promise<void> {
    return this.rest.put(
      `/channels/${channelId}/messages/${messageId}/reactions/${encodeURIComponent(
        emoji
      )}/@me`
    )
  }

  /**
   * Delete a reaction the current user has made for the message. Returns a 204 empty response on success.
   * The `emoji` must be [URL Encoded](https://en.wikipedia.org/wiki/Percent-encoding) or the request will fail with `10014: Unknown Emoji`.
   */
  async deleteOwnReaction(
    channelId: string,
    messageId: string,
    emoji: string
  ): Promise<void> {
    return this.rest.delete(
      `/channels/${channelId}/messages/${messageId}/reactions/${encodeURIComponent(
        emoji
      )}/@me`
    )
  }

  /**
   * Deletes another user's reaction. This endpoint requires the 'MANAGE_MESSAGES' permission to be present on the current user. Returns a 204 empty response on success.
   * The `emoji` must be [URL Encoded](https://en.wikipedia.org/wiki/Percent-encoding) or the request will fail with `10014: Unknown Emoji`.
   */
  async deleteUserReaction(
    channelId: string,
    messageId: string,
    emoji: string,
    userId: string
  ): Promise<void> {
    return this.rest.delete(
      `/channels/${channelId}/messages/${messageId}/reactions/${encodeURIComponent(
        emoji
      )}/${userId}`
    )
  }

  /**
   * Get a list of users that reacted with this emoji. Returns an array of [user](#DOCS_RESOURCES_USER/user-object) objects on success.
The `emoji` must be [URL Encoded](https://en.wikipedia.org/wiki/Percent-encoding) or the request will fail with `10014: Unknown Emoji`.
   */
  async getReactions(
    channelId: string,
    messageId: string,
    emoji: string
  ): Promise<UserPayload[]> {
    return this.rest.get(
      `/channels/${channelId}/messages/${messageId}/reactions/${encodeURIComponent(
        emoji
      )}`
    )
  }

  /**
   * Deletes all reactions on a message. This endpoint requires the 'MANAGE_MESSAGES' permission to be present on the current user. Fires a [Message Reaction Remove All](#DOCS_TOPICS_GATEWAY/message-reaction-remove-all) Gateway event.
   */
  async deleteAllReactions(
    channelId: string,
    messageId: string
  ): Promise<void> {
    return this.rest.delete(
      `/channels/${channelId}/messages/${messageId}/reactions`
    )
  }

  /**
   * Deletes all the reactions for a given emoji on a message. This endpoint requires the `MANAGE_MESSAGES` permission to be present on the current user. Fires a [Message Reaction Remove Emoji](#DOCS_TOPICS_GATEWAY/message-reaction-remove-emoji) Gateway event.
   * The `emoji` must be [URL Encoded](https://en.wikipedia.org/wiki/Percent-encoding) or the request will fail with `10014: Unknown Emoji`.
   */
  async deleteAllReactionsForEmoji(
    channelId: string,
    messageId: string,
    emoji: string
  ): Promise<any> {
    return this.rest.delete(
      `/channels/${channelId}/messages/${messageId}/reactions/${emoji}`
    )
  }

  /**
   * Edit a previously sent message. The fields `content`, `embed`, `allowed_mentions` and `flags` can be edited by the original message author. Other users can only edit `flags` and only if they have the `MANAGE_MESSAGES` permission in the corresponding channel. When specifying flags, ensure to include all previously set flags/bits in addition to ones that you are modifying. Only `flags` documented in the table below may be modified by users (unsupported flag changes are currently ignored without error).
   * Returns a [message](#DOCS_RESOURCES_CHANNEL/message-object) object. Fires a [Message Update](#DOCS_TOPICS_GATEWAY/message-update) Gateway event.
   */
  async editMessage(
    channelId: string,
    messageId: string,
    payload: EditMessagePayload
  ): Promise<MessagePayload> {
    return this.rest.patch(
      `/channels/${channelId}/messages/${messageId}`,
      payload
    )
  }

  /**
   * Delete a message. If operating on a guild channel and trying to delete a message that was not sent by the current user, this endpoint requires the `MANAGE_MESSAGES` permission. Returns a 204 empty response on success. Fires a [Message Delete](#DOCS_TOPICS_GATEWAY/message-delete) Gateway event.
   */
  async deleteMessage(channelId: string, messageId: string): Promise<void> {
    return this.rest.delete(`/channels/${channelId}/messages/${messageId}`)
  }

  /**
   * Delete multiple messages in a single request. This endpoint can only be used on guild channels and requires the `MANAGE_MESSAGES` permission. Returns a 204 empty response on success. Fires a [Message Delete Bulk](#DOCS_TOPICS_GATEWAY/message-delete-bulk) Gateway event.
   * Any message IDs given that do not exist or are invalid will count towards the minimum and maximum message count (currently 2 and 100 respectively).
   */
  async bulkDeleteMessages(
    channelId: string,
    payload: string[]
  ): Promise<void> {
    return this.rest.post(
      `/channels/${channelId}/messages/bulk-delete`,
      payload
    )
  }

  /**
   * Edit the channel permission overwrites for a user or role in a channel. Only usable for guild channels. Requires the `MANAGE_ROLES` permission. Only permissions your bot has in the guild or channel can be allowed/denied (unless your bot has a `MANAGE_ROLES` overwrite in the channel). Returns a 204 empty response on success. For more information about permissions, see [permissions](#DOCS_TOPICS_PERMISSIONS/permissions).
   */
  async editChannelPermissions(
    channelId: string,
    overwriteId: string,
    payload: OverwritePayload
  ): Promise<void> {
    return this.rest.put(
      `/channels/${channelId}/permissions/${overwriteId}`,
      payload
    )
  }

  /**
   * Returns a list of [invite](#DOCS_RESOURCES_INVITE/invite-object) objects (with [invite metadata](#DOCS_RESOURCES_INVITE/invite-metadata-object)) for the channel. Only usable for guild channels. Requires the `MANAGE_CHANNELS` permission.
   */
  async getChannelInvites(
    channelId: string
  ): Promise<InviteWithMetadataPayload> {
    return this.rest.get(`/channels/${channelId}/invites`)
  }

  /**
   * Create a new [invite](#DOCS_RESOURCES_INVITE/invite-object) object for the channel. Only usable for guild channels. Requires the `CREATE_INSTANT_INVITE` permission. All JSON parameters for this route are optional, however the request body is not. If you are not sending any fields, you still have to send an empty JSON object (`{}`). Returns an [invite](#DOCS_RESOURCES_INVITE/invite-object) object. Fires an [Invite Create](#DOCS_TOPICS_GATEWAY/invite-create) Gateway event.
   */
  async createChannelInvite(
    channelId: string,
    payload: Partial<InvitePayload> = {}
  ): Promise<InvitePayload> {
    return this.rest.post(`/channels/${channelId}/invites`, payload)
  }

  /**
   * Delete a channel permission overwrite for a user or role in a channel. Only usable for guild channels. Requires the `MANAGE_ROLES` permission. Returns a 204 empty response on success. For more information about permissions, see [permissions](#DOCS_TOPICS_PERMISSIONS/permissions)
   */
  async deleteChannelPermission(
    channelId: string,
    overwriteId: string
  ): Promise<void> {
    return this.rest.delete(`/channels/${channelId}/permissions/${overwriteId}`)
  }

  /**
   * Follow a News Channel to send messages to a target channel. Requires the `MANAGE_WEBHOOKS` permission in the target channel. Returns a [followed channel](#DOCS_RESOURCES_CHANNEL/followed-channel-object) object.
   */
  async followNewsChannel(channelId: string): Promise<FollowedChannel> {
    return this.rest.post(`/channels/${channelId}/followers`)
  }

  /**
   * Post a typing indicator for the specified channel. Generally bots should **not** implement this route. However, if a bot is responding to a command and expects the computation to take a few seconds, this endpoint may be called to let the user know that the bot is processing their message. Returns a 204 empty response on success. Fires a [Typing Start](#DOCS_TOPICS_GATEWAY/typing-start) Gateway event.
   */
  async triggerTypingIndicator(channelId: string): Promise<void> {
    return this.rest.post(`/channels/${channelId}/typing`)
  }

  /**
   * Returns all pinned messages in the channel as an array of [message](#DOCS_RESOURCES_CHANNEL/message-object) objects.
   */
  async getPinnedMessages(channelId: string): Promise<MessagePayload[]> {
    return this.rest.get(`/channels/${channelId}/pins`)
  }

  /**
   * Pin a message in a channel. Requires the `MANAGE_MESSAGES` permission. Returns a 204 empty response on success.
   */
  async addPinnedChannelMessage(
    channelId: string,
    messageId: string
  ): Promise<void> {
    return this.rest.put(`/channels/${channelId}/pins/${messageId}`)
  }

  /**
   * Delete a pinned message in a channel. Requires the `MANAGE_MESSAGES` permission. Returns a 204 empty response on success.
   */
  async deletePinnedChannelMessage(
    channelId: string,
    messageId: string
  ): Promise<void> {
    return this.rest.delete(`/channels/${channelId}/pins/${messageId}`)
  }

  /**
   * Adds a recipient to a Group DM using their access token
   */
  async groupDmAddRecipient(channelId: string, userId: string): Promise<any> {
    return this.rest.put(`/channels/${channelId}/recipients/${userId}`)
  }

  /**
   * Removes a recipient from a Group DM
   */
  async groupDmRemoveRecipient(
    channelId: string,
    userId: string
  ): Promise<void> {
    return this.rest.delete(`/channels/${channelId}/recipients/${userId}`)
  }

  /**
   * Returns a list of [emoji](#DOCS_RESOURCES_EMOJI/emoji-object) objects for the given guild.
   */
  async listGuildEmojis(guildId: string): Promise<EmojiPayload[]> {
    return this.rest.get(`/guilds/${guildId}/emojis`)
  }

  /**
   * Returns an [emoji](#DOCS_RESOURCES_EMOJI/emoji-object) object for the given guild and emoji IDs.
   */
  async getGuildEmoji(guildId: string, emojiId: string): Promise<EmojiPayload> {
    return this.rest.get(`/guilds/${guildId}/emojis/${emojiId}`)
  }

  /**
   * Create a new emoji for the guild. Requires the `MANAGE_EMOJIS` permission. Returns the new [emoji](#DOCS_RESOURCES_EMOJI/emoji-object) object on success. Fires a [Guild Emojis Update](#DOCS_TOPICS_GATEWAY/guild-emojis-update) Gateway event.
   */
  async createGuildEmoji(
    guildId: string,
    payload: CreateEmojiPayload
  ): Promise<EmojiPayload> {
    return this.rest.post(`/guilds/${guildId}/emojis`, payload)
  }

  /**
   * Modify the given emoji. Requires the `MANAGE_EMOJIS` permission. Returns the updated [emoji](#DOCS_RESOURCES_EMOJI/emoji-object) object on success. Fires a [Guild Emojis Update](#DOCS_TOPICS_GATEWAY/guild-emojis-update) Gateway event.
   */
  async modifyGuildEmoji(
    guildId: string,
    emojiId: string,
    payload: Partial<EmojiPayload>
  ): Promise<EmojiPayload> {
    return this.rest.patch(`/guilds/${guildId}/emojis/${emojiId}`, payload)
  }

  /**
   * Delete the given emoji. Requires the `MANAGE_EMOJIS` permission. Returns `204 No Content` on success. Fires a [Guild Emojis Update](#DOCS_TOPICS_GATEWAY/guild-emojis-update) Gateway event.
   */
  async deleteGuildEmoji(guildId: string, emojiId: string): Promise<void> {
    return this.rest.delete(`/guilds/${guildId}/emojis/${emojiId}`)
  }

  /**
   * Create a new guild. Returns a [guild](#DOCS_RESOURCES_GUILD/guild-object) object on success. Fires a [Guild Create](#DOCS_TOPICS_GATEWAY/guild-create) Gateway event.
   */
  async createGuild(payload: Partial<GuildPayload>): Promise<GuildPayload> {
    return this.rest.post(`/guilds`, payload)
  }

  /**
   * Returns the [guild](#DOCS_RESOURCES_GUILD/guild-object) object for the given id. If `with_counts` is set to `true`, this endpoint will also return `approximate_member_count` and `approximate_presence_count` for the guild.
   */
  async getGuild(guildId: string): Promise<GuildPayload> {
    return this.rest.get(`/guilds/${guildId}`)
  }

  /**
   * Returns the [guild preview](#DOCS_RESOURCES_GUILD/guild-preview-object) object for the given id. If the user is not in the guild, then the guild must be Discoverable.
   */
  async getGuildPreview(guildId: string): Promise<GuildPreviewPayload> {
    return this.rest.get(`/guilds/${guildId}/preview`)
  }

  /**
   * Modify a guild's settings. Requires the `MANAGE_GUILD` permission. Returns the updated [guild](#DOCS_RESOURCES_GUILD/guild-object) object on success. Fires a [Guild Update](#DOCS_TOPICS_GATEWAY/guild-update) Gateway event.
   */
  async modifyGuild(
    guildId: string,
    payload: Partial<GuildPayload>
  ): Promise<GuildPayload> {
    return this.rest.patch(`/guilds/${guildId}`, payload)
  }

  /**
   * Delete a guild permanently. User must be owner. Returns `204 No Content` on success. Fires a [Guild Delete](#DOCS_TOPICS_GATEWAY/guild-delete) Gateway event.
   */
  async deleteGuild(guildId: string): Promise<void> {
    return this.rest.delete(`/guilds/${guildId}`)
  }

  /**
   * Returns a list of guild [channel](#DOCS_RESOURCES_CHANNEL/channel-object) objects.
   */
  async getGuildChannels(guildId: string): Promise<ChannelPayload[]> {
    return this.rest.get(`/guilds/${guildId}/channels`)
  }

  /**
   * Create a new [channel](#DOCS_RESOURCES_CHANNEL/channel-object) object for the guild. Requires the `MANAGE_CHANNELS` permission. If setting permission overwrites, only permissions your bot has in the guild can be allowed/denied. Setting `MANAGE_ROLES` permission in channels is only possible for guild administrators. Returns the new [channel](#DOCS_RESOURCES_CHANNEL/channel-object) object on success. Fires a [Channel Create](#DOCS_TOPICS_GATEWAY/channel-create) Gateway event.
   */
  async createGuildChannel(
    guildId: string,
    payload: GuildCreateChannelPayload
  ): Promise<ChannelPayload> {
    return this.rest.post(`/guilds/${guildId}/channels`, payload)
  }

  /**
   * Modify the positions of a set of [channel](#DOCS_RESOURCES_CHANNEL/channel-object) objects for the guild. Requires `MANAGE_CHANNELS` permission. Returns a 204 empty response on success. Fires multiple [Channel Update](#DOCS_TOPICS_GATEWAY/channel-update) Gateway events.
   */
  async modifyGuildChannelPositions(
    guildId: string,
    payload: Array<{ id: string; position: number }>
  ): Promise<void> {
    return this.rest.patch(`/guilds/${guildId}/channels`, payload)
  }

  /**
   * Returns a [guild member](#DOCS_RESOURCES_GUILD/guild-member-object) object for the specified user.
   */
  async getGuildMember(
    guildId: string,
    userId: string
  ): Promise<MemberPayload> {
    return this.rest.get(`/guilds/${guildId}/members/${userId}`)
  }

  /**
   * Returns a list of [guild member](#DOCS_RESOURCES_GUILD/guild-member-object) objects that are members of the guild.
   */
  async listGuildMembers(guildId: string, params: { limit?: number, after?: string }): Promise<MemberPayload[]> {
    if (params?.limit !== undefined) {
      if (params.limit < 1 || params.limit > 1000) throw new Error('Limit should be a number between 1 and 1000')
    }

    return this.rest.get(`/guilds/${guildId}/members`, params)
  }

  /**
   * Returns a list of [guild member](#DOCS_RESOURCES_GUILD/guild-member-object) objects whose username or nickname starts with a provided string.
   */
  async searchGuildMembers(guildId: string, params: { query: string, limit?: number }): Promise<MemberPayload[]> {
    if (params?.query === undefined) {
      throw new Error('Query is a required parameter')
    }

    if (params.limit !== undefined) {
      if (params.limit < 1 || params.limit > 1000) throw new Error('Limit should be a number between 1 and 1000')
    }
    
    return this.rest.get(`/guilds/${guildId}/members/search`, params)
  }

  /**
   * Adds a user to the guild, provided you have a valid oauth2 access token for the user with the `guilds.join` scope. Returns a 201 Created with the [guild member](#DOCS_RESOURCES_GUILD/guild-member-object) as the body, or 204 No Content if the user is already a member of the guild. Fires a [Guild Member Add](#DOCS_TOPICS_GATEWAY/guild-member-add) Gateway event.
   * For guilds with [Membership Screening](#DOCS_RESOURCES_GUILD/membership-screening-object) enabled, this endpoint will default to adding new members as `pending` in the [guild member object](#DOCS_RESOURCES_GUILD/guild-member-object). Members that are `pending` will have to complete membership screening before they become full members that can talk.
   */
  async addGuildMember(guildId: string, userId: string): Promise<any> {
    return this.rest.put(`/guilds/${guildId}/members/${userId}`)
  }

  /**
   * Modify attributes of a [guild member](#DOCS_RESOURCES_GUILD/guild-member-object). Returns a 200 OK with the [guild member](#DOCS_RESOURCES_GUILD/guild-member-object) as the body. Fires a [Guild Member Update](#DOCS_TOPICS_GATEWAY/guild-member-update) Gateway event. If the `channel_id` is set to null, this will force the target user to be disconnected from voice.
   */
  async modifyGuildMember(
    guildId: string,
    userId: string,
    payload: Partial<MemberPayload>
  ): Promise<MemberPayload> {
    return this.rest.patch(`/guilds/${guildId}/members/${userId}`, payload)
  }

  /**
   * Modifies the nickname of the current user in a guild. Returns a 200 with the nickname on success. Fires a [Guild Member Update](#DOCS_TOPICS_GATEWAY/guild-member-update) Gateway event.
   */
  async modifyCurrentUserNick(
    guildId: string,
    payload: { nick?: string | null }
  ): Promise<any> {
    return this.rest.patch(`/guilds/${guildId}/members/@me/nick`, payload)
  }

  /**
   * Adds a role to a [guild member](#DOCS_RESOURCES_GUILD/guild-member-object). Requires the `MANAGE_ROLES` permission. Returns a 204 empty response on success. Fires a [Guild Member Update](#DOCS_TOPICS_GATEWAY/guild-member-update) Gateway event.
   */
  async addGuildMemberRole(
    guildId: string,
    userId: string,
    roleId: string
  ): Promise<void> {
    return this.rest.put(`/guilds/${guildId}/members/${userId}/roles/${roleId}`)
  }

  /**
   * Removes a role from a [guild member](#DOCS_RESOURCES_GUILD/guild-member-object). Requires the `MANAGE_ROLES` permission. Returns a 204 empty response on success. Fires a [Guild Member Update](#DOCS_TOPICS_GATEWAY/guild-member-update) Gateway event.
   */
  async removeGuildMemberRole(
    guildId: string,
    userId: string,
    roleId: string
  ): Promise<void> {
    return this.rest.delete(
      `/guilds/${guildId}/members/${userId}/roles/${roleId}`
    )
  }

  /**
   * Remove a member from a guild. Requires `KICK_MEMBERS` permission. Returns a 204 empty response on success. Fires a [Guild Member Remove](#DOCS_TOPICS_GATEWAY/guild-member-remove) Gateway event.
   */
  async removeGuildMember(guildId: string, userId: string): Promise<void> {
    return this.rest.delete(`/guilds/${guildId}/members/${userId}`)
  }

  /**
   * Returns a list of [ban](#DOCS_RESOURCES_GUILD/ban-object) objects for the users banned from this guild. Requires the `BAN_MEMBERS` permission.
   */
  async getGuildBans(guildId: string): Promise<GuildBanPayload[]> {
    return this.rest.get(`/guilds/${guildId}/bans`)
  }

  /**
   * Returns a [ban](#DOCS_RESOURCES_GUILD/ban-object) object for the given user or a 404 not found if the ban cannot be found. Requires the `BAN_MEMBERS` permission.
   */
  async getGuildBan(guildId: string, userId: string): Promise<GuildBanPayload> {
    return this.rest.get(`/guilds/${guildId}/bans/${userId}`)
  }

  /**
   * Create a guild ban, and optionally delete previous messages sent by the banned user. Requires the `BAN_MEMBERS` permission. Returns a 204 empty response on success. Fires a [Guild Ban Add](#DOCS_TOPICS_GATEWAY/guild-ban-add) Gateway event.
   */
  async createGuildBan(
    guildId: string,
    userId: string,
    payload: GuildBanAddPayload
  ): Promise<void> {
    return this.rest.put(`/guilds/${guildId}/bans/${userId}`, payload)
  }

  /**
   * Remove the ban for a user. Requires the `BAN_MEMBERS` permissions. Returns a 204 empty response on success. Fires a [Guild Ban Remove](#DOCS_TOPICS_GATEWAY/guild-ban-remove) Gateway event.
   */
  async removeGuildBan(guildId: string, userId: string): Promise<void> {
    return this.rest.delete(`/guilds/${guildId}/bans/${userId}`)
  }

  /**
   * Returns a list of [role](#DOCS_TOPICS_PERMISSIONS/role-object) objects for the guild.
   */
  async getGuildRoles(guildId: string): Promise<RolePayload[]> {
    return this.rest.get(`/guilds/${guildId}/roles`)
  }

  /**
   * Create a new [role](#DOCS_TOPICS_PERMISSIONS/role-object) for the guild. Requires the `MANAGE_ROLES` permission. Returns the new [role](#DOCS_TOPICS_PERMISSIONS/role-object) object on success. Fires a [Guild Role Create](#DOCS_TOPICS_GATEWAY/guild-role-create) Gateway event. All JSON params are optional.
   */
  async createGuildRole(
    guildId: string,
    payload: GuildCreateRolePayload
  ): Promise<RolePayload> {
    return this.rest.post(`/guilds/${guildId}/roles`, payload)
  }

  /**
   * Modify the positions of a set of [role](#DOCS_TOPICS_PERMISSIONS/role-object) objects for the guild. Requires the `MANAGE_ROLES` permission. Returns a list of all of the guild's [role](#DOCS_TOPICS_PERMISSIONS/role-object) objects on success. Fires multiple [Guild Role Update](#DOCS_TOPICS_GATEWAY/guild-role-update) Gateway events.
   * This endpoint takes a JSON array of parameters in the following format:
   */
  async modifyGuildRolePositions(
    guildId: string,
    payload: Array<{ id: string; position: number }>
  ): Promise<any> {
    return this.rest.patch(`/guilds/${guildId}/roles`, payload)
  }

  /**
   * Modify a guild role. Requires the `MANAGE_ROLES` permission. Returns the updated [role](#DOCS_TOPICS_PERMISSIONS/role-object) on success. Fires a [Guild Role Update](#DOCS_TOPICS_GATEWAY/guild-role-update) Gateway event.
   */
  async modifyGuildRole(
    guildId: string,
    roleId: string,
    payload: RoleModifyPayload
  ): Promise<RolePayload> {
    return this.rest.patch(`/guilds/${guildId}/roles/${roleId}`, payload)
  }

  /**
   * Delete a guild role. Requires the `MANAGE_ROLES` permission. Returns a 204 empty response on success. Fires a [Guild Role Delete](#DOCS_TOPICS_GATEWAY/guild-role-delete) Gateway event.
   */
  async deleteGuildRole(guildId: string, roleId: string): Promise<void> {
    return this.rest.delete(`/guilds/${guildId}/roles/${roleId}`)
  }

  /**
   * Returns an object with one 'pruned' key indicating the number of members that would be removed in a prune operation. Requires the `KICK_MEMBERS` permission.
   * By default, prune will not remove users with roles. You can optionally include specific roles in your prune by providing the `include_roles` parameter. Any inactive user that has a subset of the provided role(s) will be counted in the prune and users with additional roles will not.
   */
  async getGuildPruneCount(guildId: string): Promise<GuildPruneCountPayload> {
    return this.rest.get(`/guilds/${guildId}/prune`)
  }

  /**
   * Begin a prune operation. Requires the `KICK_MEMBERS` permission. Returns an object with one 'pruned' key indicating the number of members that were removed in the prune operation. For large guilds it's recommended to set the `compute_prune_count` option to `false`, forcing 'pruned' to `null`. Fires multiple [Guild Member Remove](#DOCS_TOPICS_GATEWAY/guild-member-remove) Gateway events.
   * By default, prune will not remove users with roles. You can optionally include specific roles in your prune by providing the `include_roles` parameter. Any inactive user that has a subset of the provided role(s) will be included in the prune and users with additional roles will not.
   */
  async beginGuildPrune(
    guildId: string,
    payload: GuildBeginPrunePayload
  ): Promise<any> {
    return this.rest.post(`/guilds/${guildId}/prune`, payload)
  }

  /**
   * Returns a list of [voice region](#DOCS_RESOURCES_VOICE/voice-region-object) objects for the guild. Unlike the similar `/voice` route, this returns VIP servers when the guild is VIP-enabled.
   */
  async getGuildVoiceRegions(guildId: string): Promise<VoiceRegion[]> {
    return this.rest.get(`/guilds/${guildId}/regions`)
  }

  /**
   * Returns a list of [invite](#DOCS_RESOURCES_INVITE/invite-object) objects (with [invite metadata](#DOCS_RESOURCES_INVITE/invite-metadata-object)) for the guild. Requires the `MANAGE_GUILD` permission.
   */
  async getGuildInvites(guildId: string): Promise<InviteWithMetadataPayload[]> {
    return this.rest.get(`/guilds/${guildId}/invites`)
  }

  /**
   * Returns a list of [integration](#DOCS_RESOURCES_GUILD/integration-object) objects for the guild. Requires the `MANAGE_GUILD` permission.
   */
  async getGuildIntegrations(
    guildId: string
  ): Promise<GuildIntegrationPayload[]> {
    return this.rest.get(`/guilds/${guildId}/integrations`)
  }

  /**
   * Delete the attached [integration](#DOCS_RESOURCES_GUILD/integration-object) object for the guild. Deletes any associated webhooks and kicks the associated bot if there is one. Requires the `MANAGE_GUILD` permission. Returns a 204 empty response on success. Fires a [Guild Integrations Update](#DOCS_TOPICS_GATEWAY/guild-integrations-update) Gateway event.
   */
  async deleteGuildIntegration(
    guildId: string,
    integrationId: string
  ): Promise<void> {
    return this.rest.delete(`/guilds/${guildId}/integrations/${integrationId}`)
  }

  /**
   * Returns a [guild widget](#DOCS_RESOURCES_GUILD/guild-widget-object) object. Requires the `MANAGE_GUILD` permission.
   */
  async getGuildWidgetSettings(guildId: string): Promise<GuildWidgetPayload> {
    return this.rest.get(`/guilds/${guildId}/widget`)
  }

  /**
   * Modify a [guild widget](#DOCS_RESOURCES_GUILD/guild-widget-object) object for the guild. All attributes may be passed in with JSON and modified. Requires the `MANAGE_GUILD` permission. Returns the updated [guild widget](#DOCS_RESOURCES_GUILD/guild-widget-object) object.
   */
  async modifyGuildWidget(
    guildId: string,
    payload: Partial<GuildWidgetPayload>
  ): Promise<GuildWidgetPayload> {
    return this.rest.patch(`/guilds/${guildId}/widget`, payload)
  }

  /**
   * Returns the widget for the guild.
   */
  async getGuildWidget(guildId: string): Promise<any> {
    return this.rest.get(`/guilds/${guildId}/widget.json`)
  }

  /**
   * Returns a partial [invite](#DOCS_RESOURCES_INVITE/invite-object) object for guilds with that feature enabled. Requires the `MANAGE_GUILD` permission. `code` will be null if a vanity url for the guild is not set.
   */
  async getGuildVanityURL(
    guildId: string
  ): Promise<Partial<InviteWithMetadataPayload>> {
    return this.rest.get(`/guilds/${guildId}/vanity-url`)
  }

  /**
   * Returns a PNG image widget for the guild. Requires no permissions or authentication.
   */
  getGuildWidgetImage(guildId: string): string {
    return `/guilds/${guildId}/widget.png`
  }

  /**
   * Returns an [invite](#DOCS_RESOURCES_INVITE/invite-object) object for the given code.
   */
  async getInvite(inviteCode: string): Promise<InvitePayload> {
    return this.rest.get(`/invites/${inviteCode}`)
  }

  /**
   * Delete an invite. Requires the `MANAGE_CHANNELS` permission on the channel this invite belongs to, or `MANAGE_GUILD` to remove any invite across the guild. Returns an [invite](#DOCS_RESOURCES_INVITE/invite-object) object on success. Fires a [Invite Delete](#DOCS_TOPICS_GATEWAY/invite-delete) Gateway event.
   */
  async deleteInvite(inviteCode: string): Promise<void> {
    return this.rest.delete(`/invites/${inviteCode}`)
  }

  /**
   * Returns a [template](#DOCS_RESOURCES_TEMPLATE/template-object) object for the given code.
   */
  async getTemplate(templateCode: string): Promise<TemplatePayload> {
    return this.rest.get(`/guilds/templates/${templateCode}`)
  }

  /**
   * Create a new guild based on a template. Returns a [guild](#DOCS_RESOURCES_GUILD/guild-object) object on success. Fires a [Guild Create](#DOCS_TOPICS_GATEWAY/guild-create) Gateway event.
   */
  async createGuildFromTemplate(
    templateCode: string,
    payload: Partial<GuildPayload>
  ): Promise<any> {
    return this.rest.post(`/guilds/templates/${templateCode}`, payload)
  }

  /**
   * Returns an array of [template](#DOCS_RESOURCES_TEMPLATE/template-object) objects. Requires the `MANAGE_GUILD` permission.
   */
  async getGuildTemplates(guildId: string): Promise<TemplatePayload[]> {
    return this.rest.get(`/guilds/${guildId}/templates`)
  }

  /**
   * Creates a template for the guild. Requires the `MANAGE_GUILD` permission. Returns the created [template](#DOCS_RESOURCES_TEMPLATE/template-object) object on success.
   */
  async createGuildTemplate(
    guildId: string,
    payload: any
  ): Promise<TemplatePayload> {
    return this.rest.post(`/guilds/${guildId}/templates`, payload)
  }

  /**
   * Syncs the template to the guild's current state. Requires the `MANAGE_GUILD` permission. Returns the [template](#DOCS_RESOURCES_TEMPLATE/template-object) object on success.
   */
  async syncGuildTemplate(
    guildId: string,
    templateCode: string
  ): Promise<TemplatePayload> {
    return this.rest.put(`/guilds/${guildId}/templates/${templateCode}`)
  }

  /**
   * Modifies the template's metadata. Requires the `MANAGE_GUILD` permission. Returns the [template](#DOCS_RESOURCES_TEMPLATE/template-object) object on success.
   */
  async modifyGuildTemplate(
    guildId: string,
    templateCode: string,
    payload: Partial<TemplatePayload>
  ): Promise<TemplatePayload> {
    return this.rest.patch(
      `/guilds/${guildId}/templates/${templateCode}`,
      payload
    )
  }

  /**
   * Deletes the template. Requires the `MANAGE_GUILD` permission. Returns the deleted [template](#DOCS_RESOURCES_TEMPLATE/template-object) object on success.
   */
  async deleteGuildTemplate(
    guildId: string,
    templateCode: string
  ): Promise<void> {
    return this.rest.delete(`/guilds/${guildId}/templates/${templateCode}`)
  }

  /**
   * Returns the [user](#DOCS_RESOURCES_USER/user-object) object of the requester's account. For OAuth2, this requires the `identify` scope, which will return the object _without_ an email, and optionally the `email` scope, which returns the object _with_ an email.
   */
  async getCurrentUser(): Promise<UserPayload> {
    return this.rest.get(`/users/@me`)
  }

  /**
   * Returns a [user](#DOCS_RESOURCES_USER/user-object) object for a given user ID.
   */
  async getUser(userId: string): Promise<UserPayload> {
    return this.rest.get(`/users/${userId}`)
  }

  /**
   * Modify the requester's user account settings. Returns a [user](#DOCS_RESOURCES_USER/user-object) object on success.
   */
  async modifyCurrentUser(payload: {
    username?: string
    avatar?: string | null
  }): Promise<UserPayload> {
    return this.rest.patch(`/users/@me`, payload)
  }

  /**
   * Returns a list of partial [guild](#DOCS_RESOURCES_GUILD/guild-object) objects the current user is a member of. Requires the `guilds` OAuth2 scope.
   */
  async getCurrentUserGuilds(): Promise<Partial<GuildPayload>> {
    return this.rest.get(`/users/@me/guilds`)
  }

  /**
   * Leave a guild. Returns a 204 empty response on success.
   */
  async leaveGuild(guildId: string): Promise<void> {
    return this.rest.delete(`/users/@me/guilds/${guildId}`)
  }

  /**
   * Returns a list of [DM channel](#DOCS_RESOURCES_CHANNEL/channel-object) objects. For bots, this is no longer a supported method of getting recent DMs, and will return an empty array.
   */
  async getUserDMs(): Promise<ChannelPayload[]> {
    return this.rest.get(`/users/@me/channels`)
  }

  /**
   * Create a new DM channel with a user. Returns a [DM channel](#DOCS_RESOURCES_CHANNEL/channel-object) object.
   */
  async createDM(payload: { recipient_id: string }): Promise<ChannelPayload> {
    return this.rest.post(`/users/@me/channels`, payload)
  }

  /**
   * Create a new group DM channel with multiple users. Returns a [DM channel](#DOCS_RESOURCES_CHANNEL/channel-object) object. This endpoint was intended to be used with the now-deprecated GameBridge SDK. DMs created with this endpoint will not be shown in the Discord client
   */
  async createGroupDM(payload: {
    access_tokens: string[]
    nicks: Dict<string>
  }): Promise<ChannelPayload> {
    return this.rest.post(`/users/@me/channels`, payload)
  }

  /**
   * Returns a list of [connection](#DOCS_RESOURCES_USER/connection-object) objects. Requires the `connections` OAuth2 scope.
   */
  async getUserConnections(): Promise<any> {
    return this.rest.get(`/users/@me/connections`)
  }

  /**
   * Returns an array of [voice region](#DOCS_RESOURCES_VOICE/voice-region-object) objects that can be used when creating servers.
   */
  async listVoiceRegions(): Promise<VoiceRegion[]> {
    return this.rest.get(`/voice/regions`)
  }

  /**
   * Create a new webhook. Requires the `MANAGE_WEBHOOKS` permission. Returns a [webhook](#DOCS_RESOURCES_WEBHOOK/webhook-object) object on success. Webhook names follow our naming restrictions that can be found in our [Usernames and Nicknames](#DOCS_RESOURCES_USER/usernames-and-nicknames) documentation, with the following additional stipulations:
   * - Webhook names cannot be: 'clyde'
   */
  async createWebhook(
    channelId: string,
    payload: { name?: string; avatar?: string }
  ): Promise<WebhookPayload> {
    return this.rest.post(`/channels/${channelId}/webhooks`, payload)
  }

  /**
   * Returns a list of channel [webhook](#DOCS_RESOURCES_WEBHOOK/webhook-object) objects. Requires the `MANAGE_WEBHOOKS` permission.
   */
  async getChannelWebhooks(channelId: string): Promise<WebhookPayload[]> {
    return this.rest.get(`/channels/${channelId}/webhooks`)
  }

  /**
   * Returns a list of guild [webhook](#DOCS_RESOURCES_WEBHOOK/webhook-object) objects. Requires the `MANAGE_WEBHOOKS` permission.
   */
  async getGuildWebhooks(guildId: string): Promise<WebhookPayload[]> {
    return this.rest.get(`/guilds/${guildId}/webhooks`)
  }

  /**
   * Returns the new [webhook](#DOCS_RESOURCES_WEBHOOK/webhook-object) object for the given id.
   */
  async getWebhook(webhookId: string): Promise<WebhookPayload[]> {
    return this.rest.get(`/webhooks/${webhookId}`)
  }

  /**
   * Same as above, except this call does not require authentication and returns no user in the webhook object.
   */
  async getWebhookWithToken(
    webhookId: string,
    webhookToken: string
  ): Promise<WebhookPayload> {
    return this.rest.get(`/webhooks/${webhookId}/${webhookToken}`)
  }

  /**
   * Modify a webhook. Requires the `MANAGE_WEBHOOKS` permission. Returns the updated [webhook](#DOCS_RESOURCES_WEBHOOK/webhook-object) object on success.
   */
  async modifyWebhook(
    webhookId: string,
    payload: { name?: string; avatar?: string | null }
  ): Promise<WebhookPayload> {
    return this.rest.patch(`/webhooks/${webhookId}`, payload)
  }

  /**
   * Same as above, except this call does not require authentication, does not accept a `channel_id` parameter in the body, and does not return a user in the webhook object.
   */
  async modifyWebhookWithToken(
    webhookId: string,
    webhookToken: string,
    payload: { name?: string; avatar?: string | null }
  ): Promise<WebhookPayload> {
    return this.rest.patch(`/webhooks/${webhookId}/${webhookToken}`, payload)
  }

  /**
   * Delete a webhook permanently. Requires the `MANAGE_WEBHOOKS` permission. Returns a 204 NO CONTENT response on success.
   */
  async deleteWebhook(webhookId: string): Promise<void> {
    return this.rest.delete(`/webhooks/${webhookId}`)
  }

  /**
   * Same as above, except this call does not require authentication.
   */
  async deleteWebhookWithToken(
    webhookId: string,
    webhookToken: string
  ): Promise<void> {
    return this.rest.delete(`/webhooks/${webhookId}/${webhookToken}`)
  }

  async executeWebhook(
    webhookId: string,
    webhookToken: string,
    payload: CreateWebhookMessagePayload
  ): Promise<MessagePayload> {
    return this.rest.post(`/webhooks/${webhookId}/${webhookToken}`, payload)
  }

  async executeSlackCompatibleWebhook(
    webhookId: string,
    webhookToken: string,
    payload: any
  ): Promise<any> {
    return this.rest.post(
      `/webhooks/${webhookId}/${webhookToken}/slack`,
      payload
    )
  }

  async executeGitHubCompatibleWebhook(
    webhookId: string,
    webhookToken: string,
    payload: any
  ): Promise<any> {
    return this.rest.post(
      `/webhooks/${webhookId}/${webhookToken}/github`,
      payload
    )
  }

  /**
   * Edits a previously-sent webhook message from the same token. Returns a [message](#DOCS_RESOURCES_CHANNEL/message-object) object on success.
   */
  async editWebhookMessage(
    webhookId: string,
    webhookToken: string,
    messageId: string,
    payload: CreateWebhookMessageBasePayload
  ): Promise<MessagePayload> {
    return this.rest.patch(
      `/webhooks/${webhookId}/${webhookToken}/messages/${messageId}`,
      payload
    )
  }

  async getGateway(): Promise<{ url: string }> {
    return this.rest.get(`/gateway`)
  }

  async getGatewayBot(): Promise<GatewayBotPayload> {
    return this.rest.get(`/gateway/bot`)
  }

  /**
   * Returns the bot's OAuth2 [application object](#DOCS_TOPICS_OAUTH2/application-object) without `flags`.
   */
  async getCurrentApplicationInformation(): Promise<ApplicationPayload> {
    return this.rest.get(`/oauth2/applications/@me`)
  }

  /**
   * Returns info about the current authorization. Requires authentication with a bearer token.
   */
  async getCurrentAuthorizationInformation(): Promise<any> {
    return this.rest.get(`/oauth2/@me`)
  }

  /**
   * Creates a new public thread from an existing message. Returns a channel on success, and a 400 BAD REQUEST on invalid parameters. Fires a Thread Create Gateway event.
   */
  async startPublicThread(
    channelId: string,
    messageId: string,
    payload: CreateThreadPayload
  ): Promise<ThreadChannelPayload> {
    return this.rest.post(
      `/channels/${channelId}/messages/${messageId}/threads`,
      payload
    )
  }

  /**
   * Creates a new private thread. Returns a channel on success, and a 400 BAD REQUEST on invalid parameters. Fires a Thread Create Gateway event.
   */
  async startPrivateThread(
    channelId: string,
    payload: CreateThreadPayload
  ): Promise<ThreadChannelPayload> {
    return this.rest.post(`/channels/${channelId}/threads`, payload)
  }

  /**
   * Adds the current user to a thread. Returns a 204 empty response on success. Also requires the thread is not archived. Fires a Thread Members Update Gateway event.
   */
  async joinThread(channelId: string): Promise<undefined> {
    return this.rest.post(`/channels/${channelId}/thread-members/@me`)
  }

  /**
   * Adds another user to a thread. Requires the ability to send messages in the thread. Also requires the thread is not archived. Returns a 204 empty response on success. Fires a Thread Members Update Gateway event.
   */
  async addUserToThread(channelId: string, userId: string): Promise<undefined> {
    return this.rest.post(`/channels/${channelId}/thread-members/${userId}`)
  }

  /**
   * Removes the current user from a thread. Returns a 204 empty response on success. Fires a Thread Members Update Gateway event.
   */
  async leaveThread(channelId: string): Promise<void> {
    return this.rest.delete(`/channels/${channelId}/thread-members/@me`)
  }

  /**
   * Removes another user from a thread. Requires the MANAGE_THREADS permission or that you are the creator of the thread. Also requires the thread is not archived. Returns a 204 empty response on success. Fires a Thread Members Update Gateway event.
   */
  async removeUserFromThread(channelId: string, userId: string): Promise<void> {
    return this.rest.delete(`/channels/${channelId}/thread-members/${userId}`)
  }

  /**
   * Returns archived threads in the channel that are public. When called on a GUILD_TEXT channel, returns threads of type PUBLIC_THREAD. When called on a GUILD_NEWS channel returns threads of type NEWS_THREAD. Threads are ordered by archive_timestamp, in descending order. Requires the READ_MESSAGE_HISTORY permission.
   */
  async getPublicArchivedThreads(
    channelId: string,
    params: { before?: string; limit?: number } = {}
  ): Promise<{
    threads: ThreadChannelPayload[]
    members: ThreadMemberPayload[]
    has_more: boolean
  }> {
    const qs = queryString(params)
    return this.rest.get(
      `/channels/${channelId}/threads/archived/public${
        qs.length !== 0 ? `?${qs}` : ''
      }`
    )
  }

  /**
   * Returns archived threads in the channel that are of type PRIVATE_THREAD. Threads are ordered by archive_timestamp, in descending order. Requires both the READ_MESSAGE_HISTORY and MANAGE_THREADS permissions.
   */
  async getPrivateArchivedThreads(
    channelId: string,
    params: { before?: string; limit?: number } = {}
  ): Promise<{
    threads: ThreadChannelPayload[]
    members: ThreadMemberPayload[]
    has_more: boolean
  }> {
    const qs = queryString(params)
    return this.rest.get(
      `/channels/${channelId}/threads/archived/private${
        qs.length !== 0 ? `?${qs}` : ''
      }`
    )
  }

  /**
   * Returns archived threads in the channel that are of type PRIVATE_THREAD, and the user has joined. Threads are ordered by their id, in descending order. Requires the READ_MESSAGE_HISTORY permission.
   */
  async getJoinedPrivateArchivedThreads(
    channelId: string,
    params: { before?: string; limit?: number } = {}
  ): Promise<{
    threads: ThreadChannelPayload[]
    members: ThreadMemberPayload[]
    has_more: boolean
  }> {
    const qs = queryString(params)
    return this.rest.get(
      `/channels/${channelId}/users/@me/threads/archived/private${
        qs.length !== 0 ? `?${qs}` : ''
      }`
    )
  }

  /** Returns all active threads in the channel, including public and private threads. Threads are ordered by their id, in descending order. Requires the READ_MESSAGE_HISTORY permission. */
  async getActiveThreads(
    channelId: string,
    params: { before?: string; limit?: number } = {}
  ): Promise<{
    threads: ThreadChannelPayload[]
    members: ThreadMemberPayload[]
    has_more: boolean
  }> {
    const qs = queryString(params)
    return this.rest.get(
      `/channels/${channelId}/threads/active${qs.length !== 0 ? `?${qs}` : ''}`
    )
  }

  /** Returns array of thread members objects that are members of the thread. */
  async getThreadMembers(channelId: string): Promise<ThreadMemberPayload[]> {
    return this.rest.get(`/channels/${channelId}/thread-members`)
  }
}
