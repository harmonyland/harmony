import type { GuildForumChannelPayload } from "../../../../types/mod.ts";
import { Mixin } from "../../../deps.ts";
import type { GuildForumTag } from "../../../types/forum.ts";
import { GuildTextBasedChannel } from "./guildTextBasedChannel.ts";
import { GuildThreadAvailableChannel } from "./guildThreadAvailableChannel.ts";

export class GuildForumChannel extends Mixin(
  GuildThreadAvailableChannel<GuildForumChannelPayload>,
  GuildTextBasedChannel<GuildForumChannelPayload>,
) {
  // get defaultReactionEmoji(): Emoji {
  // TODO: add emoji
  // }
  get defaultSortOrder() {
    return this.payload.default_auto_archive_duration;
  }
  get defaultForumLayout() {
    return this.payload.default_auto_archive_duration;
  }
  get availableTags(): GuildForumTag {
    return {
      id: this.payload.available_tags.id,
      name: this.payload.available_tags.name,
      moderated: this.payload.available_tags.moderated,
      // TODO: add emoji
    };
  }
}
