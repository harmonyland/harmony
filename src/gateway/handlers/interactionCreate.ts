import { Interaction } from '../../structures/slash.ts'
import { InteractionPayload } from '../../types/slash.ts'
import { Gateway, GatewayEventHandler } from '../index.ts'

export const interactionCreate: GatewayEventHandler = async (
  gateway: Gateway,
  d: InteractionPayload
) => {
  const interaction = new Interaction(gateway.client, d)
  gateway.client.emit('interactionCreate', interaction)
}
