import { GuildPayload } from "../../types/mod.ts";
import { SelectivePartial } from "./utils.ts";

export type LightGuildPayload = SelectivePartial<
  GuildPayload,
  "roles" | "emojis"
>;
