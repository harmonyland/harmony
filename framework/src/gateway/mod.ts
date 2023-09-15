import type { GatewayHandler } from "../../types/gateway.ts";
import channelCreate from "./handlers/channelCreate.ts";
import channelDelete from "./handlers/channelDelete.ts";
import guildCreate from "./handlers/guildCreate.ts";
import messageCreate from "./handlers/messageCreate.ts";
import ready from "./handlers/ready.ts";

// deno-lint-ignore no-explicit-any
export const GatewayHandlers: { [K: string]: GatewayHandler<any> } = {
  MESSAGE_CREATE: messageCreate,
  READY: ready,
  GUILD_CREATE: guildCreate,
  CHANNEL_CREATE: channelCreate,
  CHANNEL_DELETE: channelDelete,
};
