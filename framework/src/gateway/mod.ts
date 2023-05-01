import { GatewayHandler } from "../../types/gateway.ts";
import messageCreate from "./messageCreate.ts";

export const GatewayHandlers: { [key: string]: GatewayHandler<any> } = {
  MESSAGE_CREATE: messageCreate,
};
