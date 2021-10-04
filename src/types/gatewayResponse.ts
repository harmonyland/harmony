import type { GatewayOpcodes, GatewayEvents } from './gateway.ts'

/**
 * Gateway response from Discord.
 *
 */
export interface GatewayResponse {
  op: GatewayOpcodes
  // untyped JSON
  d: any
  s?: number
  t?: GatewayEvents
}
