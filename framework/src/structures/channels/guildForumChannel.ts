import type { GuildForumChannelPayload } from "../../../../types/mod.ts";
import { Mixin } from "../../../deps.ts";
import type { GuildForumTag } from "../../../types/forum.ts";
import { Emoji } from "../emojis/mod.ts";
import { GuildTextBasedChannel } from "./guildTextBasedChannel.ts";
import { GuildThreadAvailableChannel } from "./guildThreadAvailableChannel.ts";

export class GuildForumChannel extends Mixin(
  GuildThreadAvailableChannel<GuildForumChannelPayload>,
  GuildTextBasedChannel<GuildForumChannelPayload>,
) {
  get defaultReactionEmoji(): Emoji | undefined {
    if (this.payload.default_reaction_emoji) {
      if (this.payload.default_reaction_emoji.emoji_id !== null) {
        return this.client.emojis.get(
          this.payload.default_reaction_emoji.emoji_id,
        );
      } else if (this.payload.default_reaction_emoji.emoji_name !== null) {
        return new Emoji(this.client, {
          id: null,
          name: this.payload.default_reaction_emoji.emoji_name,
        });
      }
    }
    return undefined;
  }
  get defaultSortOrder() {
    return this.payload.default_auto_archive_duration;
  }
  get defaultForumLayout() {
    return this.payload.default_auto_archive_duration;
  }
  get availableTags(): GuildForumTag {
    let result: Emoji;

    if (this.payload.available_tags.emoji_id !== null) {
      result = this.client.emojis.get(
        this.payload.available_tags.emoji_id,
      )!;
    } else if (this.payload.available_tags.emoji_name !== null) {
      result = new Emoji(this.client, {
        id: null,
        name: this.payload.available_tags.emoji_name,
      });
    }

    return {
      id: this.payload.available_tags.id,
      name: this.payload.available_tags.name,
      moderated: this.payload.available_tags.moderated,
      emoji: result!,
    };
  }
}
