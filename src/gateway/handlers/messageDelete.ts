import type { TextChannel } from '../../structures/textChannel.ts'
import type { MessageDeletePayload } from '../../types/gateway.ts'
import type { Gateway, GatewayEventHandler } from '../mod.ts'

export const messageDelete: GatewayEventHandler = async (
  gateway: Gateway,
  d: MessageDeletePayload
) => {
  const channel = await gateway.client.channels.get<TextChannel>(d.channel_id)
  // if (channel === undefined)
  //   // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  //   channel = (await gateway.client.channels.fetch(d.channel_id)) as TextChannel
  if (channel === undefined) return
  const message = await channel.messages.get(d.id)
  if (message === undefined)
    return gateway.client.emit('messageDeleteUncached', d)
  await channel.messages._delete(d.id)
  gateway.client.emit('messageDelete', message)
}
