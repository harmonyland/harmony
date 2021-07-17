import type { Gateway, GatewayEventHandler } from '../mod.ts'
import type { TextChannel } from '../../structures/textChannel.ts'
import type { ChannelPinsUpdatePayload } from '../../types/gateway.ts'

export const channelPinsUpdate: GatewayEventHandler = async (
  gateway: Gateway,
  d: ChannelPinsUpdatePayload
) => {
  const before: TextChannel | undefined =
    await gateway.client.channels.get<TextChannel>(d.channel_id)

  if (before !== undefined) {
    const raw = await gateway.client.channels._get(d.channel_id)
    if (raw === undefined) return
    await gateway.client.channels.set(
      raw.id,
      Object.assign(raw, { last_pin_timestamp: d.last_pin_timestamp })
    )
    const after = (await gateway.client.channels.get(
      d.channel_id
    )) as unknown as TextChannel
    gateway.client.emit('channelPinsUpdate', before, after)
  }
}
