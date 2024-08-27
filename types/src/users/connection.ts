import { ApplicationRoleConnectionMetadata } from "../applications/mod.ts";
import { snowflake } from "../common.ts";
import { IntegrationPayload } from "../guilds/integration.ts";

export enum Services {
  BATTLENET = "battlenet",
  BUNGIE_NET = "bungie",
  EBAY = "ebay",
  EPIC_GAMES = "epicgames",
  FACEBOOK = "facebook",
  GITHUB = "github",
  INSTAGRAM = "instagram",
  LEAGUE_OF_LEGENDS = "leagueoflegends",
  PAYPAL = "paypal",
  PLAYSTATION_NETWORK = "playstation",
  REDDIT = "reddit",
  RIOT_GAMES = "riotgames",
  SKYPE = "skype",
  SPOTIFY = "spotify",
  STEAM = "steam",
  TIKTOK = "tiktok",
  TWITCH = "twitch",
  TWITTER = "twitter", // i miss twitter
  X = "twitter",
  XBOX = "xbox",
  YOUTUBE = "youtube",
}

export interface ConnectionPayload {
  friend_sync: boolean;
  id: snowflake;
  integrations?: IntegrationPayload[];
  name: string;
  revoked?: boolean;
  show_activity: boolean;
  two_way_link: boolean;
  type: Services;
  verified: boolean;
  visibility: VisibilityType;
}

export enum VisibilityType {
  NONE = 0,
  EVERYONE = 1,
}

export interface ApplicationRoleConnectionPayload {
  metadata: ApplicationRoleConnectionMetadata;
  platform_name: null | string;
  platform_username: null | string;
}

export interface EditApplicationRoleConnectionPayload {
  metadata?: ApplicationRoleConnectionMetadata;
  platform_name?: string;
  platform_username?: string;
}
