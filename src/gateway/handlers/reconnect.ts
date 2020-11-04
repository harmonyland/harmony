import { Gateway } from "../index.ts"
import { GatewayEventHandler } from "../index.ts"

export const reconnect: GatewayEventHandler = async (gateway: Gateway, d: any) => {
    gateway.reconnect()
}