import { IntegrationPayload } from "../guilds/integration.ts";

export interface ConnectionPayload {
  id: string;
  name: string;
  type:
    | "battlenet"
    | "ebay"
    | "epicgames"
    | "facebook"
    | "github"
    | "instagram"
    | "leagueoflegends"
    | "paypal"
    | "playstation"
    | "reddit"
    | "riotgames"
    | "spotify"
    | "skype"
    | "steam"
    | "tiktok"
    | "twitch"
    | "twitter"
    | "xbox"
    | "youtube";
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
