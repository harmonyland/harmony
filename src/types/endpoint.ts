//Written by Choi Donghan, Catry

import {
  DISCORD_API_URL,
  DISCORD_API_VERSION,
  DISCORD_CDN_URL
} from '../consts/urlsAndVersions'

//Guild Endpoints
const GUILDS = `${DISCORD_API_URL}/v${DISCORD_API_VERSION}/guilds`
const GUILD = (guildID: string) =>
  `${DISCORD_API_URL}/v${DISCORD_API_VERSION}/guilds/${guildID}`
const GUILD_AUDIT_LOGS = (guildID: string) =>
  `${DISCORD_API_URL}/v${DISCORD_API_VERSION}/guilds/${guildID}/audit-logs`
const GUILD_WIDGET = (guildID: string) =>
  `${DISCORD_API_URL}/v${DISCORD_API_VERSION}/guilds/${guildID}/widget`
const GUILD_EMOJI = (guildID: string, emoji_id: string) =>
  `${DISCORD_API_URL}/v${DISCORD_API_VERSION}/guilds/${guildID}/emojis/${emoji_id}`
const GUILD_EMOJIS = (guildID: string) =>
  `${DISCORD_API_URL}/v${DISCORD_API_VERSION}/guilds/${guildID}/emojis`
const GUILD_REGIONS = (guildID: string) =>
  `${DISCORD_API_URL}/v${DISCORD_API_VERSION}/guilds/${guildID}/regions`
const GUILD_ROLE = (guildID: string, roleID: string) =>
  `${DISCORD_API_URL}/v${DISCORD_API_VERSION}/guilds/${guildID}/roles/${roleID}`
const GUILD_ROLES = (guildID: string) =>
  `${DISCORD_API_URL}/v${DISCORD_API_VERSION}/guilds/${guildID}/roles`
const GUILD_INTEGRATION = (guildID: string, integrationID: string) =>
  `${DISCORD_API_URL}/v${DISCORD_API_VERSION}/guilds/${guildID}/integrations/${integrationID}`
const GUILD_INTEGRATIONS = (guildID: string) =>
  `${DISCORD_API_URL}/v${DISCORD_API_VERSION}/guilds/${guildID}/integrations`
const GUILD_INTEGARTION_SYNC = (guildID: string) =>
  `${DISCORD_API_URL}/v${DISCORD_API_VERSION}/guilds/${guildID}/integrations?include_appilications=true`
const GUILD_BAN = (guildID: string, userID: string) =>
  `${DISCORD_API_URL}/v${DISCORD_API_VERSION}/guilds/${guildID}/bans/${userID}`
const GUILD_BANS = (guildID: string) =>
  `${DISCORD_API_URL}/v${DISCORD_API_VERSION}/guilds/${guildID}/bans`
const GUILD_CHANNEL = (channelID: string) =>
  `${DISCORD_API_URL}/v${DISCORD_API_VERSION}/channels/${channelID}`
const GUILD_CHANNELS = (guildID: string, channelID: string) =>
  `${DISCORD_API_URL}/v${DISCORD_API_VERSION}/guilds/${guildID}/channels`
const GUILD_MEMBER = (guildID: string, memberID: string) =>
  `${DISCORD_API_URL}/v${DISCORD_API_VERSION}/guilds/${guildID}/members/${memberID}`
const GUILD_MEMBER_ROLE = (guildID: string, memberID: string, roleID: string) =>
  `${DISCORD_API_URL}/v${DISCORD_API_VERSION}/guilds/${guildID}/members/${memberID}/roles/${roleID}`
const GUILD_INVITES = (guildID: string) => 
  `${DISCORD_API_URL}/v${DISCORD_API_VERSION}/guilds/${guildID}/invites`
const GUILD_LEAVE = (guildID: string) =>
  `${DISCORD_API_URL}/v${DISCORD_API_VERSION}/users/@me/guilds/${guildID}`
const GUILD_PRUNE = (guildID: string) =>
  `${DISCORD_API_URL}/v${DISCORD_API_VERSION}/guilds/${guildID}/prune`
const VANITY_URL = (guildID: string) =>
  `${DISCORD_API_URL}/v${DISCORD_API_VERSION}/guilds/${guildID}/vanity-url`


//Channel Endpoints
const CHANNEL = (channelID: string) =>
  `${DISCORD_API_URL}/v${DISCORD_API_VERSION}/channels/${channelID}`
const CHANNELS = (channelID: string) =>
  `${DISCORD_API_URL}/v${DISCORD_API_VERSION}/guilds/${channelID}/channels`
const CHANNEL_MESSAGES = (channelID: string) =>
  `${DISCORD_API_URL}/v${DISCORD_API_VERSION}/channels/${channelID}/messages`
const CHANNEL_MESSAGE = (channelID: string, messageID: string) =>
  `${DISCORD_API_URL}/v${DISCORD_API_VERSION}/channels/${channelID}/messages/${messageID}`
const CHANNEL_CROSSPOST = (channelID: string, messageID: string) =>
  `${DISCORD_API_URL}/v${DISCORD_API_VERSION}/channels/${channelID}/messages/${messageID}/crosspost`
const MESSAGE_REACTIONS = (channelID: string, messageID: string) =>
  `${DISCORD_API_URL}/v${DISCORD_API_VERSION}/channels/${channelID}/messages/${messageID}/reactions`
const MESSAGE_REACTION = (channelID: string, messageID: string, emoji: string) =>
  `${DISCORD_API_URL}/v${DISCORD_API_VERSION}/channels/${channelID}/messages/${messageID}/reactions/${emoji}`
const MESSAGE_REACTION_ME = (channelID: string, messageID: string, emojiID: string) =>
  `${DISCORD_API_URL}/v${DISCORD_API_VERSION}/channels/${channelID}/messages/${messageID}/reactions/${emojiID}/@me`
const MESSAGE_REACTION_USER = (channelID: string, messageID: string, emojiID: string, userID: string) =>
  `${DISCORD_API_URL}/v${DISCORD_API_VERSION}/channels/${channelID}/messages/${messageID}/reactions/${emojiID}/${userID}`
const CHANNEL_BULK_DELETE = (channelID: string) =>
  `${DISCORD_API_URL}/v${DISCORD_API_VERSION}/channels/${channelID}/messages/bulk-delete`
const CHANNEL_FOLLOW = (channelID: string) =>
  `${DISCORD_API_URL}/v${DISCORD_API_VERSION}/channels/${channelID}/followers`
const CHANNEL_INVITES = (channelID: string) =>
  `${DISCORD_API_URL}/v${DISCORD_API_VERSION}/channels/${channelID}/invites`
const CHANNEL_PINS = (channelID: string) => 
  `${DISCORD_API_URL}/v${DISCORD_API_VERSION}/channels/${channelID}/pins`

//User Endpoints
const CURRENT_USER = `${DISCORD_API_URL}/v${DISCORD_API_VERSION}/users/@me`
const CURRENT_USER_GUILDS = `${DISCORD_API_URL}/v${DISCORD_API_VERSION}/users/@me/guilds`
const USER_DM = `${DISCORD_API_URL}/v${DISCORD_API_VERSION}/users/@me/channels`
const USER_CONNECTIONS = `${DISCORD_API_URL}/v${DISCORD_API_VERSION}/users/@me/connections`
const LEAVE_GUILD = (guildID: string) =>
  `${DISCORD_API_URL}/v${DISCORD_API_VERSION}/users/@me/guilds/${guildID}`
const USER = (userID: string) =>
  `${DISCORD_API_URL}/v${DISCORD_API_VERSION}/users/${userID}`



//Webhook Endpoints
const CHANNEL_WEBHOOKS = (channelID: string) =>
  `${DISCORD_API_URL}/v${DISCORD_API_VERSION}/channels/${channelID}/webhooks`
const GUILD_WEBHOOK = (guildID: string) =>
  `${DISCORD_API_URL}/v${DISCORD_API_VERSION}/guilds/${guildID}/webhooks`
const WEBHOOK = (webhookID: string) =>
  `${DISCORD_API_URL}/v${DISCORD_API_VERSION}/webhooks/${webhookID}`
const WEBHOOK_WITH_TOKEN = (webhookID: string, webhookTOKEN: string) =>
  `${DISCORD_API_URL}/v${DISCORD_API_VERSION}/webhooks/${webhookID}/${webhookTOKEN}`
const SLACK_WEBHOOK = (webhookID: string, webhookTOKEN: string) =>
  `${DISCORD_API_URL}/v${DISCORD_API_VERSION}/webhooks/${webhookID}/${webhookTOKEN}/slack`
const GITHUB_WEBHOOK = (webhookID: string, webhookTOKEN: string) =>
  `${DISCORD_API_URL}/v${DISCORD_API_VERSION}/webhooks/${webhookID}/${webhookTOKEN}/github`

//Gateway Endpoints
const GATEWAY = `${DISCORD_API_URL}/v${DISCORD_API_VERSION}/gateway`
const GATEWAY_BOT = `${DISCORD_API_URL}/v${DISCORD_API_VERSION}/gateway/bot`

//CDN Endpoints
const CUSTOM_EMOJI = (emojiID: string) => 
  `${DISCORD_CDN_URL}/emojis/${emojiID}.png`
const GUILD_ICON = (guildID: string, iconID: number) =>
  `${DISCORD_CDN_URL}/icons/${guildID}/${iconID}.png`
const GUILD_SPLASH = (guildID: string, guildSPLASH: string) =>
  `${DISCORD_CDN_URL}/splashes/${guildID}/${guildSPLASH}.png`
const GUILD_DISCOVERY_SPLASH = (guildID: string, guildDiscoverySplash: string) =>
  `${DISCORD_CDN_URL}/discovery-splashes/${guildID}/${guildDiscoverySplash}.png	`
const GUILD_BANNER = (guildID: string, guildBANNER: string) =>
  `${DISCORD_CDN_URL}/banners/${guildID}/${guildBANNER}.png`
const DEFAULT_USER_AVATAR = (iconID: string) =>
  `${DISCORD_CDN_URL}/embed/avatars/${iconID}.png`
const USER_AVATAR = (userID: string, iconID: string) =>
  `${DISCORD_CDN_URL}/avatars/${userID}/${iconID}.png`
const APPLICATION_ASSET = (applicationID: string, assetID: number) =>
  `${DISCORD_CDN_URL}/app-icons/${applicationID}/${assetID}.png`
const ACHIEVEMENT_ICON = (applicationID: string, achievementID: string,  iconHASH: string) =>
  `${DISCORD_CDN_URL}/app-assets/${applicationID}/achievements/${achievementID}/icons/${iconHASH}.png`
const TEAM_ICON = (teamID: string, iconID: string) =>
  `${DISCORD_CDN_URL}/team-icons/${teamID}/${iconID}.png`