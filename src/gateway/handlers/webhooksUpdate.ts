import type { Gateway, GatewayEventHandler } from '../mod.ts'
import type { WebhooksUpdatePayload } from '../../types/gateway.ts'

export const webhooksUpdate: GatewayEventHandler = async (
  gateway: Gateway,
  d: WebhooksUpdatePayload
) => {
  const guild = await gateway.client.guilds.get(d.guild_id)
  if (guild === undefined) return

  const channel = await guild.channels.get(
    d.channel_id
  )
  if (channel === undefined)
    gateway.client.emit('webhooksUpdateUncached', guild, d.channel_id)
  else gateway.client.emit('webhooksUpdate', guild, channel)
}
