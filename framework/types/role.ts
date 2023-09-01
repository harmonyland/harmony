import type { RolePayload } from "../../types/mod.ts";

export interface RolePayloadWithGuildID extends RolePayload {
  guild_id: string;
}
