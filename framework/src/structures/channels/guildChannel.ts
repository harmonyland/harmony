import { Channel } from "./channel.ts";
import type { GuildChannelPayload } from "../../../../types/mod.ts";

export class GuildChannel<P extends GuildChannelPayload> extends Channel<P> {
  get guildID(): string {
    return this.payload.guild_id;
  }
  get name(): string {
    return this.payload.name;
  }
  get position(): number {
    return this.payload.position;
  }
  // get permissionOverwrites(): Overwrite[] {
  //   return this.payload.permission_overwrites;
  // }
  get nsfw(): boolean {
    return this.payload.nsfw;
  }
  get parentID(): string | null {
    return this.payload.parent_id;
  }
  get topic(): string | null {
    return this.payload.topic;
  }
}
