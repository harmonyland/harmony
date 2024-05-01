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
  SPOTIFY = "spotify",
  SKYPE = "skype",
  STEAM = "steam",
  TIKTOK = "tiktok",
  TWITCH = "twitch",
  TWITTER = "twitter", // i miss twitter
  X = "twitter",
  XBOX = "xbox",
  YOUTUBE = "youtube",
}

export interface ConnectionPayload {
  id: snowflake;
  name: string;
  type: Services;
  revoked?: boolean;
  integrations?: IntegrationPayload[];
  verified: boolean;
  friend_sync: boolean;
  show_activity: boolean;
  two_way_link: boolean;
  visibility: VisibilityType;
}

export enum VisibilityType {
  NONE = 0,
  EVERYONE = 1,
}

export interface ApplicationRoleConnectionPayload {
  platform_name: string | null;
  platform_username: string | null;
  metadata: ApplicationRoleConnectionMetadata;
}

export interface EditApplicationRoleConnectionPayload {
  platform_name?: string;
  platform_username?: string;
  metadata?: ApplicationRoleConnectionMetadata;
}
