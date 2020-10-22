import { GatewayOpcodes, GatewayEvents } from '../types/gatewayTypes.ts'

/**
 * Gateway response from Discord.
 *
 */
interface GatewayResponse {
  op: GatewayOpcodes
  d: any
  s?: number
  t?: GatewayEvents
}

export { GatewayResponse }
