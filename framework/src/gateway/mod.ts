import { GatewayHandler } from "../../types/gateway.ts";
import messageCreate from "./messageCreate.ts";

// deno-lint-ignore no-explicit-any
export const GatewayHandlers: { [K: string]: GatewayHandler<any> } = {
  MESSAGE_CREATE: messageCreate,
};
