import { Gateway, GatewayEventHandler } from "../index.ts";

export const reconnect: GatewayEventHandler = async (
  gateway: Gateway,
  d: any,
) => {
  gateway.reconnect();
};
