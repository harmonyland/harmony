//Being Written by Choi Donghan, Catry

import {
  DISCORD_API_URL,
  DISCORD_API_VERSION,
  DISCORD_CDN_URL
} from '../consts/urlsAndVersions.ts'

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
const GUILD_ROLE = (guildID: string, roleID: string) =>
  `${DISCORD_API_URL}/v${DISCORD_API_VERSION}/guilds/${guildID}/roles/${roleID}`
const GUILD_ROLES = (guildID: string) =>
  `${DISCORD_API_URL}/v${DISCORD_API_VERSION}/guilds/${guildID}/roles`
const GUILD_MEMBER_ROLE = (guildID: string, memberID: string, roleID: string) =>
  `${DISCORD_API_URL}/v${DISCORD_API_VERSION}/guilds/${guildID}/members/${memberID}/roles/${roleID}`
const GUILD_INTEGRATION = (guildID: string, integrationID: string) =>
  `${DISCORD_API_URL}/v${DISCORD_API_VERSION}/guilds/${guildID}/integrations/${integrationID}`
const GUILD_INTEGRATIONS = (guildID: string) =>
  `${DISCORD_API_URL}/v${DISCORD_API_VERSION}/guilds/${guildID}/integrations`
const GUILD_INTEGARTION_SYNC = (guildID: string) =>
  `${DISCORD_API_URL}/v${DISCORD_API_VERSION}/guilds/${guildID}/integrations?include_appilications=true`

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
const MESSAGE_REACTION = (channelID: string, messageID: string, emoji: string) =>
  `${DISCORD_API_URL}/v${DISCORD_API_VERSION}/channels/${channelID}/messages/${messageID}/reactions/${emoji}/@me`

//Emoji Endpoints
const EMOJI = (guildID: string, emojiID: string) =>
  `${DISCORD_API_URL}/v${DISCORD_API_VERSION}//guilds/${guildID}/emojis/${emojiID}`
const EMOJIS = (guildID: string) =>
  `${DISCORD_API_URL}/v${DISCORD_API_VERSION}//guilds/${guildID}/emojis`

//User Endpoints
const USER = (userID: string) =>
  `${DISCORD_API_URL}/v${DISCORD_API_VERSION}/users/${userID}`
const USER_CREATE_DM = () =>
  `${DISCORD_API_URL}/v${DISCORD_API_VERSION}/users/@me/channels`

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

//Voice Endpoint
const VOICE_REGIONS= (guildID: string) =>
  `${DISCORD_API_URL}/v${DISCORD_API_VERSION}/guilds/${guildID}/regions`