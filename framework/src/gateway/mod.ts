import { GatewayHandler } from "../../types/gateway.ts";
import messageCreate from "./messageCreate.ts";

// deno-lint-ignore no-explicit-any
export const GatewayHandlers: { [key: string]: GatewayHandler<any> } = {
  MESSAGE_CREATE: messageCreate,
};
