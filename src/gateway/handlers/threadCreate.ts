import type { Gateway, GatewayEventHandler } from '../mod.ts'
import type { ThreadChannelPayload } from '../../types/channel.ts'

export const threadCreate: GatewayEventHandler = async (
  gateway: Gateway,
  d: ThreadChannelPayload
) => {
  const guild = await gateway.client.guilds.get(d.guild_id)
  if (guild === undefined) return
  await guild.threads.set(d.id, d)
  const thread = await guild.threads.get(d.id)
  gateway.client.emit('threadCreate', thread)
}
