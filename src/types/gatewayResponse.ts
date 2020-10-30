import { GatewayOpcodes, GatewayEvents } from '../types/gatewayTypes.ts'

/**
 * Gateway response from Discord.
 *
 */
export interface GatewayResponse {
  op: GatewayOpcodes
  d: any
  s?: number
  t?: GatewayEvents
}
