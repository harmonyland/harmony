import type { Emoji } from "../src/structures/emojis/mod.ts";

export interface GuildForumTag {
  id: string;
  name: string;
  moderated: boolean;
  emoji: Emoji;
}
