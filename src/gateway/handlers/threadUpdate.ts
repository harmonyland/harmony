import type { Gateway, GatewayEventHandler } from '../mod.ts'
import type { ThreadChannelPayload } from '../../types/channel.ts'

export const threadUpdate: GatewayEventHandler = async (
  gateway: Gateway,
  d: ThreadChannelPayload
) => {
  const guild = await gateway.client.guilds.get(d.guild_id)
  if (guild === undefined) return
  const old = await guild.threads.get(d.id)
  await guild.threads.set(d.id, d)
  const thread = (await guild.threads.get(d.id))!

  if (old === undefined) {
    gateway.client.emit('threadUpdateUncached', thread)
  } else {
    gateway.client.emit('threadUpdate', old, thread)
  }
}
