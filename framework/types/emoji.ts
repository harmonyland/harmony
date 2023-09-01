import type { EmojiPayload } from "../../types/mod.ts";

export interface EmojiPayloadWithGuildID extends EmojiPayload {
  guild_id: string;
}
