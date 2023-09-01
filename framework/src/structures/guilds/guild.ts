import type {
  DefaultMessageNotificationLevel,
  ExplicitContentFilterLevel,
  MFALevel,
  VerificationLevel,
} from "../../../../types/mod.ts";
import { LightGuildPayload } from "../../../types/guild.ts";
import { Client } from "../../client/mod.ts";
import { GuildEmojisManager } from "../../managers/guildEmojis.ts";
import { GuildRolesManager } from "../../managers/guildRoles.ts";
import { UnavailableGuild } from "./unavaliable.ts";

export class Guild extends UnavailableGuild {
  roles: GuildRolesManager;
  emojis: GuildEmojisManager;
  constructor(client: Client, payload: LightGuildPayload) {
    // TODO: think about fill methods
    super(client, payload);
    this.roles = new GuildRolesManager(client, client.roles, payload.id);
    if (payload.roles) {
      this.roles._fill(payload.roles);
    }
    this.emojis = new GuildEmojisManager(client, client.emojis, payload.id);
    if (payload.emojis) {
      this.emojis._fill(payload.emojis);
    }
  }

  get name(): string {
    return this.payload.name;
  }
  get icon(): string | null {
    return this.payload.icon;
  }
  get iconHash(): string | null | undefined {
    return this.payload.icon_hash;
  }
  get splash(): string | null {
    return this.payload.splash;
  }
  get discoverySplash(): string | null {
    return this.payload.discovery_splash;
  }
  get owner(): boolean | undefined {
    return this.payload.owner;
  }
  get ownerID(): string {
    return this.payload.owner_id;
  }
  get permissions(): string | undefined {
    return this.payload.permissions;
  }
  get region(): string | null | undefined {
    return this.payload.region;
  }
  get afkChannelID(): string | null {
    return this.payload.afk_channel_id;
  }
  get afkTimeout(): number {
    return this.payload.afk_timeout;
  }
  get widgetEnabled(): boolean | null {
    return this.payload.widget_enabled;
  }
  get widgetChannelID(): string | null | undefined {
    return this.payload.widget_channel_id;
  }
  get verificationLevel(): VerificationLevel {
    return this.payload.verification_level;
  }
  get defaultMessageNotifications(): DefaultMessageNotificationLevel {
    return this.payload.default_message_notifications;
  }
  get explicitContentFilter(): ExplicitContentFilterLevel {
    return this.payload.explicit_content_filter;
  }
  get features(): string[] {
    return this.payload.features;
  }
  get mfaLevel(): MFALevel {
    return this.payload.mfa_level;
  }
  get applicationID(): string | null {
    return this.payload.application_id;
  }
  get systemChannelID(): string | null {
    return this.payload.system_channel_id;
  }
  get systemChannelFlags(): number {
    return this.payload.system_channel_flags;
  }
  get rulesChannelID(): string | null {
    return this.payload.rules_channel_id;
  }
  get joinedAt(): string | undefined {
    return this.payload.joined_at;
  }
  get large(): boolean | undefined {
    return this.payload.large;
  }
  get memberCount(): number | undefined {
    return this.payload.member_count;
  }
  get voiceStates(): string[] {
    return this.payload.voice_states;
  }
  get members(): string[] {
    return this.payload.members;
  }
  get channels(): string[] {
    return this.payload.channels;
  }
  get threads(): string[] {
    return this.payload.threads;
  }
  get presences(): string[] {
    return this.payload.presences;
  }
  get maxPresences(): number | null {
    return this.payload.max_presences;
  }
  get maxMembers(): number | null {
    return this.payload.max_members;
  }
  get vanityURLCode(): string | null {
    return this.payload.vanity_url_code;
  }
  get description(): string | null {
    return this.payload.description;
  }
  get banner(): string | null {
    return this.payload.banner;
  }
  get premiumTier(): number {
    return this.payload.premium_tier;
  }
  get premiumSubscriptionCount(): number | null {
    return this.payload.premium_subscription_count;
  }
  get preferredLocale(): string {
    return this.payload.preferred_locale;
  }
  get publicUpdatesChannelID(): string | null {
    return this.payload.public_updates_channel_id;
  }
  get maxVideoChannelUsers(): number | null {
    return this.payload.max_video_channel_users;
  }
  get maxStageVideoChannelUsers(): number | null {
    return this.payload.max_stage_video_channel_users;
  }
  get approximateMemberCount(): number | null {
    return this.payload.approximate_member_count;
  }
  get approximatePresenceCount(): number | null {
    return this.payload.approximate_presence_count;
  }
  get welcomeScreen(): string | null {
    return this.payload.welcome_screen;
  }
  get nsfwLevel(): number {
    return this.payload.nsfw_level;
  }
  get stageInstances(): string[] {
    return this.payload.stage_instances;
  }
  get stickers(): string[] {
    return this.payload.stickers;
  }
  get guildScheduledEvents(): string[] {
    return this.payload.guild_scheduled_events;
  }
  get premiumProgressBarEnabled(): boolean {
    return this.payload.premium_progress_bar_enabled;
  }
}
