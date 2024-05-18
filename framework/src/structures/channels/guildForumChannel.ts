import type { GuildForumChannelPayload } from "../../../../types/mod.ts";
import { Mixin } from "../../../deps.ts";
import type { GuildForumTag } from "../../../types/forum.ts";
import type { Client } from "../../client/mod.ts";
import { Emoji } from "../emojis/mod.ts";
import { GuildTextBasedChannel } from "./guildTextBasedChannel.ts";
import { GuildThreadAvailableChannel } from "./guildThreadAvailableChannel.ts";

const GuildForumChannelSuper:
  & (abstract new (
    client: Client,
    payload: GuildForumChannelPayload,
  ) => GuildThreadAvailableChannel & GuildTextBasedChannel)
  & Pick<
    typeof GuildThreadAvailableChannel,
    keyof typeof GuildThreadAvailableChannel
  >
  & Pick<typeof GuildTextBasedChannel, keyof typeof GuildTextBasedChannel> =
    Mixin(
      GuildThreadAvailableChannel,
      GuildTextBasedChannel,
    );

export class GuildForumChannel extends GuildForumChannelSuper {
  payload: GuildForumChannelPayload;
  constructor(client: Client, payload: GuildForumChannelPayload) {
    super(client, payload);
    this.payload = payload;
  }

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
  get availableTags(): GuildForumTag[] {
    return this.payload.available_tags.map((t) => {
      let result: Emoji;

      if (t.emoji_id !== null) {
        result = this.client.emojis.get(
          t.emoji_id,
        )!;
      } else if (t.emoji_name !== null) {
        result = new Emoji(this.client, {
          id: null,
          name: t.emoji_name,
        });
      }

      return {
        id: t.id,
        name: t.name,
        moderated: t.moderated,
        emoji: result!,
      };
    });
  }
}
