import type { GuildCategoryPayload } from "../../../../types/mod.ts";
import { GuildChannel } from "./guildChannel.ts";

export class GuildCategory extends GuildChannel<GuildCategoryPayload> {}
