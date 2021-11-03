import { Constants } from './constants.ts'

// Guild Endpoints
const GUILDS = (): string =>
  `${Constants.DISCORD_API_URL}/v${Constants.DISCORD_API_VERSION}/guilds`
const GUILD = (guildID: string): string =>
  `${Constants.DISCORD_API_URL}/v${Constants.DISCORD_API_VERSION}/guilds/${guildID}`
const GUILD_AUDIT_LOGS = (guildID: string): string =>
  `${Constants.DISCORD_API_URL}/v${Constants.DISCORD_API_VERSION}/guilds/${guildID}/audit-logs`
const GUILD_WIDGET = (guildID: string): string =>
  `${Constants.DISCORD_API_URL}/v${Constants.DISCORD_API_VERSION}/guilds/${guildID}/widget`
const GUILD_EMOJI = (guildID: string, emojiID: string): string =>
  `${Constants.DISCORD_API_URL}/v${Constants.DISCORD_API_VERSION}/guilds/${guildID}/emojis/${emojiID}`
const GUILD_EMOJIS = (guildID: string): string =>
  `${Constants.DISCORD_API_URL}/v${Constants.DISCORD_API_VERSION}/guilds/${guildID}/emojis`
const GUILD_ROLE = (guildID: string, roleID: string): string =>
  `${Constants.DISCORD_API_URL}/v${Constants.DISCORD_API_VERSION}/guilds/${guildID}/roles/${roleID}`
const GUILD_ROLES = (guildID: string): string =>
  `${Constants.DISCORD_API_URL}/v${Constants.DISCORD_API_VERSION}/guilds/${guildID}/roles`
const GUILD_INTEGRATION = (guildID: string, integrationID: string): string =>
  `${Constants.DISCORD_API_URL}/v${Constants.DISCORD_API_VERSION}/guilds/${guildID}/integrations/${integrationID}`
const GUILD_INTEGRATIONS = (guildID: string): string =>
  `${Constants.DISCORD_API_URL}/v${Constants.DISCORD_API_VERSION}/guilds/${guildID}/integrations`
const GUILD_INTEGRATIONS_SYNC = (guildID: string): string =>
  `${Constants.DISCORD_API_URL}/v${Constants.DISCORD_API_VERSION}/guilds/${guildID}/integrations?include_applications=true`
const GUILD_BAN = (guildID: string, userID: string): string =>
  `${Constants.DISCORD_API_URL}/v${Constants.DISCORD_API_VERSION}/guilds/${guildID}/bans/${userID}`
const GUILD_BANS = (guildID: string): string =>
  `${Constants.DISCORD_API_URL}/v${Constants.DISCORD_API_VERSION}/guilds/${guildID}/bans`
const GUILD_CHANNEL = (channelID: string): string =>
  `${Constants.DISCORD_API_URL}/v${Constants.DISCORD_API_VERSION}/channels/${channelID}`
const GUILD_CHANNELS = (guildID: string): string =>
  `${Constants.DISCORD_API_URL}/v${Constants.DISCORD_API_VERSION}/guilds/${guildID}/channels`
const GUILD_MEMBER = (guildID: string, memberID: string): string =>
  `${Constants.DISCORD_API_URL}/v${Constants.DISCORD_API_VERSION}/guilds/${guildID}/members/${memberID}`
const GUILD_MEMBERS = (guildID: string): string =>
  `${Constants.DISCORD_API_URL}/v${Constants.DISCORD_API_VERSION}/guilds/${guildID}/members`
const GUILD_MEMBER_ROLE = (
  guildID: string,
  memberID: string,
  roleID: string
): string =>
  `${Constants.DISCORD_API_URL}/v${Constants.DISCORD_API_VERSION}/guilds/${guildID}/members/${memberID}/roles/${roleID}`
const GUILD_INVITES = (guildID: string): string =>
  `${Constants.DISCORD_API_URL}/v${Constants.DISCORD_API_VERSION}/guilds/${guildID}/invites`
const GUILD_LEAVE = (guildID: string): string =>
  `${Constants.DISCORD_API_URL}/v${Constants.DISCORD_API_VERSION}/users/@me/guilds/${guildID}`
const GUILD_PRUNE = (guildID: string): string =>
  `${Constants.DISCORD_API_URL}/v${Constants.DISCORD_API_VERSION}/guilds/${guildID}/prune`
const GUILD_VANITY_URL = (guildID: string): string =>
  `${Constants.DISCORD_API_URL}/v${Constants.DISCORD_API_VERSION}/guilds/${guildID}/vanity-url`
const GUILD_NICK = (guildID: string): string =>
  `${Constants.DISCORD_API_URL}/v${Constants.DISCORD_API_VERSION}/guilds/${guildID}/members/@me/nick`
const GUILD_WIDGET_IMAGE = (guildID: string): string =>
  `${Constants.DISCORD_API_URL}/v${Constants.DISCORD_API_VERSION}/guilds/${guildID}/widget.png`
const GUILD_PREVIEW = (guildID: string): string =>
  `${Constants.DISCORD_API_URL}/v${Constants.DISCORD_API_VERSION}/guilds/${guildID}/preview`

// Channel Endpoints
const CHANNEL = (channelID: string): string =>
  `${Constants.DISCORD_API_URL}/v${Constants.DISCORD_API_VERSION}/channels/${channelID}`
const CHANNELS = (channelID: string): string =>
  `${Constants.DISCORD_API_URL}/v${Constants.DISCORD_API_VERSION}/guilds/${channelID}/channels`
const CHANNEL_MESSAGE = (channelID: string, messageID: string): string =>
  `${Constants.DISCORD_API_URL}/v${Constants.DISCORD_API_VERSION}/channels/${channelID}/messages/${messageID}`
const CHANNEL_MESSAGES = (channelID: string): string =>
  `${Constants.DISCORD_API_URL}/v${Constants.DISCORD_API_VERSION}/channels/${channelID}/messages`
const CHANNEL_CROSSPOST = (channelID: string, messageID: string): string =>
  `${Constants.DISCORD_API_URL}/v${Constants.DISCORD_API_VERSION}/channels/${channelID}/messages/${messageID}/crosspost`
const MESSAGE_REACTIONS = (channelID: string, messageID: string): string =>
  `${Constants.DISCORD_API_URL}/v${Constants.DISCORD_API_VERSION}/channels/${channelID}/messages/${messageID}/reactions`
const MESSAGE_REACTION = (
  channelID: string,
  messageID: string,
  emoji: string
): string =>
  `${Constants.DISCORD_API_URL}/v${Constants.DISCORD_API_VERSION}/channels/${channelID}/messages/${messageID}/reactions/${emoji}`
const MESSAGE_REACTION_ME = (
  channelID: string,
  messageID: string,
  emojiID: string
): string =>
  `${Constants.DISCORD_API_URL}/v${Constants.DISCORD_API_VERSION}/channels/${channelID}/messages/${messageID}/reactions/${emojiID}/@me`
const MESSAGE_REACTION_USER = (
  channelID: string,
  messageID: string,
  emojiID: string,
  userID: string
): string =>
  `${Constants.DISCORD_API_URL}/v${Constants.DISCORD_API_VERSION}/channels/${channelID}/messages/${messageID}/reactions/${emojiID}/${userID}`
const CHANNEL_BULK_DELETE = (channelID: string): string =>
  `${Constants.DISCORD_API_URL}/v${Constants.DISCORD_API_VERSION}/channels/${channelID}/messages/bulk-delete`
const CHANNEL_FOLLOW = (channelID: string): string =>
  `${Constants.DISCORD_API_URL}/v${Constants.DISCORD_API_VERSION}/channels/${channelID}/followers`
const CHANNEL_INVITES = (channelID: string): string =>
  `${Constants.DISCORD_API_URL}/v${Constants.DISCORD_API_VERSION}/channels/${channelID}/invites`
const CHANNEL_PIN = (channelID: string, messageID: string): string =>
  `${Constants.DISCORD_API_URL}/v${Constants.DISCORD_API_VERSION}/channels/${channelID}/pins/${messageID}`
const CHANNEL_PINS = (channelID: string): string =>
  `${Constants.DISCORD_API_URL}/v${Constants.DISCORD_API_VERSION}/channels/${channelID}/pins`
const CHANNEL_PERMISSION = (channelID: string, overrideID: string): string =>
  `${Constants.DISCORD_API_URL}/v${Constants.DISCORD_API_VERSION}/channels/${channelID}/permissions/${overrideID}`
const CHANNEL_TYPING = (channelID: string): string =>
  `${Constants.DISCORD_API_URL}/v${Constants.DISCORD_API_VERSION}/channels/${channelID}/typing`
const GROUP_RECIPIENT = (channelID: string, userID: string): string =>
  `${Constants.DISCORD_API_URL}/v${Constants.DISCORD_API_VERSION}/channels/${channelID}/recipient/${userID}`

// User Endpoints
const CURRENT_USER = (): string =>
  `${Constants.DISCORD_API_URL}/v${Constants.DISCORD_API_VERSION}/users/@me`
const CURRENT_USER_GUILDS = (): string =>
  `${Constants.DISCORD_API_URL}/v${Constants.DISCORD_API_VERSION}/users/@me/guilds`
const USER_DM = (): string =>
  `${Constants.DISCORD_API_URL}/v${Constants.DISCORD_API_VERSION}/users/@me/channels`
const USER_CONNECTIONS = (): string =>
  `${Constants.DISCORD_API_URL}/v${Constants.DISCORD_API_VERSION}/users/@me/connections`
const LEAVE_GUILD = (guildID: string): string =>
  `${Constants.DISCORD_API_URL}/v${Constants.DISCORD_API_VERSION}/users/@me/guilds/${guildID}`
const USER = (userID: string): string =>
  `${Constants.DISCORD_API_URL}/v${Constants.DISCORD_API_VERSION}/users/${userID}`

// Webhook Endpoints
const CHANNEL_WEBHOOKS = (channelID: string): string =>
  `${Constants.DISCORD_API_URL}/v${Constants.DISCORD_API_VERSION}/channels/${channelID}/webhooks`
const GUILD_WEBHOOK = (guildID: string): string =>
  `${Constants.DISCORD_API_URL}/v${Constants.DISCORD_API_VERSION}/guilds/${guildID}/webhooks`
const WEBHOOK = (webhookID: string): string =>
  `${Constants.DISCORD_API_URL}/v${Constants.DISCORD_API_VERSION}/webhooks/${webhookID}`
const WEBHOOK_WITH_TOKEN = (webhookID: string, webhookTOKEN: string): string =>
  `${Constants.DISCORD_API_URL}/v${Constants.DISCORD_API_VERSION}/webhooks/${webhookID}/${webhookTOKEN}`
const SLACK_WEBHOOK = (webhookID: string, webhookTOKEN: string): string =>
  `${Constants.DISCORD_API_URL}/v${Constants.DISCORD_API_VERSION}/webhooks/${webhookID}/${webhookTOKEN}/slack`
const GITHUB_WEBHOOK = (webhookID: string, webhookTOKEN: string): string =>
  `${Constants.DISCORD_API_URL}/v${Constants.DISCORD_API_VERSION}/webhooks/${webhookID}/${webhookTOKEN}/github`

// Gateway Endpoints
const GATEWAY = (): string =>
  `${Constants.DISCORD_API_URL}/v${Constants.DISCORD_API_VERSION}/gateway`
const GATEWAY_BOT = (): string =>
  `${Constants.DISCORD_API_URL}/v${Constants.DISCORD_API_VERSION}/gateway/bot`

// CDN Endpoints
const CUSTOM_EMOJI = (emojiID: string): string =>
  `${Constants.DISCORD_CDN_URL}/emojis/${emojiID}`
const GUILD_ICON = (guildID: string, iconID: string): string =>
  `${Constants.DISCORD_CDN_URL}/icons/${guildID}/${iconID}`
const GUILD_SPLASH = (guildID: string, guildSPLASH: string): string =>
  `${Constants.DISCORD_CDN_URL}/splashes/${guildID}/${guildSPLASH}`
const GUILD_DISCOVERY_SPLASH = (
  guildID: string,
  guildDiscoverySplash: string
): string =>
  `${Constants.DISCORD_CDN_URL}/discovery-splashes/${guildID}/${guildDiscoverySplash}`
const GUILD_BANNER = (guildID: string, guildBANNER: string): string =>
  `${Constants.DISCORD_CDN_URL}/banners/${guildID}/${guildBANNER}`
const DEFAULT_USER_AVATAR = (iconID: string): string =>
  `${Constants.DISCORD_CDN_URL}/embed/avatars/${iconID}`
const USER_AVATAR = (userID: string, iconID: string): string =>
  `${Constants.DISCORD_CDN_URL}/avatars/${userID}/${iconID}`
const GUILD_MEMBER_AVATAR = (
  guildID: string,
  userID: string,
  iconID: string
): string =>
  `${Constants.DISCORD_CDN_URL}/guilds/${guildID}/users/${userID}/avatars/${iconID}`
const APPLICATION_ASSET = (applicationID: string, assetID: string): string =>
  `${Constants.DISCORD_CDN_URL}/app-icons/${applicationID}/${assetID}`
const ACHIEVEMENT_ICON = (
  applicationID: string,
  achievementID: string,
  iconHASH: string
): string =>
  `${Constants.DISCORD_CDN_URL}/app-assets/${applicationID}/achievements/${achievementID}/icons/${iconHASH}`
const TEAM_ICON = (teamID: string, iconID: string): string =>
  `${Constants.DISCORD_CDN_URL}/team-icons/${teamID}/${iconID}`
const ROLE_ICON = (roleID: string, iconID: string): string =>
  `${Constants.DISCORD_CDN_URL}/role-icons/${roleID}/${iconID}`

// Emoji Endpoints
const EMOJI = (guildID: string, emojiID: string): string =>
  `${Constants.DISCORD_API_URL}/v${Constants.DISCORD_API_VERSION}/guilds/${guildID}/emojis/${emojiID}`

// Template Endpoint
const TEMPLATE = (templateCODE: string): string =>
  `${Constants.DISCORD_API_URL}/v${Constants.DISCORD_API_VERSION}/guilds/templates/${templateCODE}`

// Invite Endpoint
const INVITE = (inviteCODE: string): string =>
  `${Constants.DISCORD_API_URL}/v${Constants.DISCORD_API_VERSION}/invites/${inviteCODE}`

// Voice Endpoint
const VOICE_REGIONS = (guildID: string): string =>
  `${Constants.DISCORD_API_URL}/v${Constants.DISCORD_API_VERSION}/guilds/${guildID}/regions`

// Client User Endpoint
const CLIENT_USER = (): string =>
  `${Constants.DISCORD_API_URL}/v${Constants.DISCORD_API_VERSION}/users/@me`

const APPLICATION_COMMANDS = (id: string): string =>
  `${Constants.DISCORD_API_URL}/v${Constants.DISCORD_API_VERSION}/applications/${id}/commands`

const APPLICATION_COMMAND = (id: string, cmdID: string): string =>
  `${Constants.DISCORD_API_URL}/v${Constants.DISCORD_API_VERSION}/applications/${id}/commands/${cmdID}`

const APPLICATION_GUILD_COMMANDS = (id: string, guildID: string): string =>
  `${Constants.DISCORD_API_URL}/v${Constants.DISCORD_API_VERSION}/applications/${id}/guilds/${guildID}/commands`

const APPLICATION_GUILD_COMMAND = (
  id: string,
  guildID: string,
  cmdID: string
): string =>
  `${Constants.DISCORD_API_URL}/v${Constants.DISCORD_API_VERSION}/applications/${id}/guilds/${guildID}/commands/${cmdID}`

const WEBHOOK_MESSAGE = (id: string, token: string, msgID: string): string =>
  `${Constants.DISCORD_API_URL}/v${Constants.DISCORD_API_VERSION}/webhooks/${id}/${token}/messages/${msgID}`

const INTERACTION_CALLBACK = (id: string, token: string): string =>
  `${Constants.DISCORD_API_URL}/v${Constants.DISCORD_API_VERSION}/interactions/${id}/${token}/callback`

export {
  INTERACTION_CALLBACK,
  APPLICATION_COMMAND,
  APPLICATION_GUILD_COMMAND,
  WEBHOOK_MESSAGE,
  APPLICATION_COMMANDS,
  APPLICATION_GUILD_COMMANDS,
  GUILDS,
  GUILD,
  GUILD_AUDIT_LOGS,
  GUILD_WIDGET,
  GUILD_EMOJI,
  GUILD_ROLE,
  GUILD_ROLES,
  GUILD_INTEGRATION,
  GUILD_INTEGRATIONS,
  GUILD_INTEGRATIONS_SYNC,
  GUILD_WIDGET_IMAGE,
  GUILD_BAN,
  GUILD_BANS,
  GUILD_CHANNEL,
  GUILD_CHANNELS,
  GUILD_MEMBER,
  GUILD_MEMBERS,
  GUILD_MEMBER_ROLE,
  GUILD_INVITES,
  GUILD_LEAVE,
  GUILD_PRUNE,
  GUILD_VANITY_URL,
  GUILD_NICK,
  GUILD_PREVIEW,
  CHANNEL,
  CHANNELS,
  CHANNEL_MESSAGE,
  CHANNEL_MESSAGES,
  CHANNEL_CROSSPOST,
  MESSAGE_REACTIONS,
  MESSAGE_REACTION,
  MESSAGE_REACTION_ME,
  MESSAGE_REACTION_USER,
  CHANNEL_BULK_DELETE,
  CHANNEL_FOLLOW,
  CHANNEL_INVITES,
  CHANNEL_PIN,
  CHANNEL_PINS,
  CHANNEL_PERMISSION,
  GUILD_EMOJIS,
  CHANNEL_TYPING,
  GROUP_RECIPIENT,
  CURRENT_USER,
  CURRENT_USER_GUILDS,
  USER_DM,
  USER_CONNECTIONS,
  LEAVE_GUILD,
  USER,
  CHANNEL_WEBHOOKS,
  GUILD_WEBHOOK,
  WEBHOOK,
  WEBHOOK_WITH_TOKEN,
  SLACK_WEBHOOK,
  GITHUB_WEBHOOK,
  GATEWAY,
  GATEWAY_BOT,
  CUSTOM_EMOJI,
  GUILD_ICON,
  GUILD_SPLASH,
  CLIENT_USER,
  GUILD_DISCOVERY_SPLASH,
  GUILD_BANNER,
  DEFAULT_USER_AVATAR,
  USER_AVATAR,
  GUILD_MEMBER_AVATAR,
  APPLICATION_ASSET,
  ACHIEVEMENT_ICON,
  TEAM_ICON,
  ROLE_ICON,
  EMOJI,
  TEMPLATE,
  INVITE,
  VOICE_REGIONS
}
