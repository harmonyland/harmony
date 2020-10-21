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
const GUILD_ICON = (guildID: string, iconID: string) =>
  `${DISCORD_API_URL}/v${DISCORD_API_VERSION}/guilds/${guildID}/${iconID}`
const GUILD_BANNER = (guildID: string, iconID: string) =>
  `${DISCORD_CDN_URL}/${guildID}/${iconID}`
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
const MESSAGE_REACTION = (
  channelID: string,
  messageID: string,
  emoji: string
) =>
  `${DISCORD_API_URL}/v${DISCORD_API_VERSION}/channels/${channelID}/messages/${messageID}/reactions/${emoji}/@me`

//User Endpoints
const USER = (userID: string) =>
  `${DISCORD_API_URL}/v${DISCORD_API_VERSION}/users/${userID}`
const USER_AVATAR_DEFAULT = (iconID: number) =>
  `${DISCORD_API_URL}/v${DISCORD_API_VERSION}/embed/avatars${iconID}.png`
const USER_AVATAR = (userID: string, iconID: string) =>
  `${DISCORD_API_URL}/v${DISCORD_API_VERSION}/avatars/${userID}/${iconID}.png`
const USER_CREATE_DM = () =>
  `${DISCORD_API_URL}/v${DISCORD_API_VERSION}/users/@me/channels`
