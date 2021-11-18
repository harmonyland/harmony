import { GuildFeature } from "./guild.ts";

export interface GuildPreviewPayload {
  id: string;
  name: string;
  icon: string | null;
  splash: string | null;
  discovery_splash: string | null;
  // emojis: EmojiPayload[];
  features: GuildFeature[];
  approximate_member_count: number;
  approximate_presence_count: number;
  description: string | null;
}

export interface GuildWidgetPayload {
  enabled: boolean;
  channel_id: string | null;
}
