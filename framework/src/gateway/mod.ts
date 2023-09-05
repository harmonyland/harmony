import type { GatewayHandler } from "../../types/gateway.ts";
import messageCreate from "./messageCreate.ts";
import ready from "./ready.ts";

// deno-lint-ignore no-explicit-any
export const GatewayHandlers: { [K: string]: GatewayHandler<any> } = {
  MESSAGE_CREATE: messageCreate,
  READY: ready,
};
