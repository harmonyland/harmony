import { GatewayOpcodes } from '../types/gatewayTypes'

/**
 * Gateway response from Discord.
 *
 */
interface GatewayResponse {
  op: GatewayOpcodes
  d: any
  s?: number
  t?: string
}

export { GatewayResponse }
