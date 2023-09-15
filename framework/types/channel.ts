import { ChannelType } from "../../mod.ts";
import type {
  DMChannel,
  GroupDMChannel,
  GuildAnnouncementChannel,
  GuildCategory,
  GuildForumChannel,
  GuildStageChannel,
  GuildTextChannel,
  GuildVoiceChannel,
} from "../src/structures/channels/mod.ts";

export type GuildTextBasedChannels =
  | GuildAnnouncementChannel
  | GuildForumChannel
  | GuildTextChannel
  | GuildVoiceChannel;

export type GuildThreadAvailableChannels =
  | GuildAnnouncementChannel
  | GuildForumChannel
  | GuildTextChannel;

export type GuildVoiceBasedChannels =
  | GuildStageChannel
  | GuildVoiceChannel;

export type GuildChannels =
  | GuildTextBasedChannels
  | GuildVoiceBasedChannels
  | GuildThreadAvailableChannels
  | GuildCategory;

export type DMChannels = DMChannel | GroupDMChannel;

export type VoiceChannels = GuildVoiceBasedChannels | DMChannels;

export type TextChannels = GuildTextBasedChannels | DMChannels;

export type EveryChannels = GuildChannels | DMChannels;

export const isGuildChannel = (
  channel: EveryChannels,
): channel is GuildChannels => {
  return [
    ChannelType.ANNOUNCEMENT_THREAD,
    ChannelType.GUILD_ANNOUNCEMENT,
    ChannelType.GUILD_CATEGORY,
    ChannelType.GUILD_DIRECTORY,
    ChannelType.GUILD_FORUM,
    ChannelType.GUILD_PRIVATE_THREAD,
    ChannelType.GUILD_PUBLIC_THREAD,
    ChannelType.GUILD_STAGE_VOICE,
    ChannelType.GUILD_TEXT,
    ChannelType.GUILD_VOICE,
  ].includes(channel.type);
};

export const isDMChannel = (channel: EveryChannels): channel is DMChannels => {
  return [ChannelType.DM, ChannelType.GROUP_DM].includes(channel.type);
};

export const isTextChannel = (
  channel: EveryChannels,
): channel is TextChannels => {
  return [
    ChannelType.DM,
    ChannelType.GROUP_DM,
    ChannelType.ANNOUNCEMENT_THREAD,
    ChannelType.GUILD_ANNOUNCEMENT,
    ChannelType.GUILD_FORUM,
    ChannelType.GUILD_PRIVATE_THREAD,
    ChannelType.GUILD_PUBLIC_THREAD,
    ChannelType.GUILD_TEXT,
    ChannelType.GUILD_VOICE,
  ].includes(
    channel.type,
  );
};

export const isThreadAvailableChannel = (
  channel: EveryChannels,
): channel is GuildThreadAvailableChannels => {
  return [
    ChannelType.GUILD_ANNOUNCEMENT,
    ChannelType.GUILD_FORUM,
    ChannelType.GUILD_TEXT,
  ].includes(channel.type);
};

export const isVoiceChannel = (
  channel: EveryChannels,
): channel is VoiceChannels => {
  return [
    ChannelType.DM,
    ChannelType.GROUP_DM,
    ChannelType.GUILD_STAGE_VOICE,
    ChannelType.GUILD_VOICE,
  ].includes(channel.type);
};
