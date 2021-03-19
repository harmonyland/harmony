import { Member } from '../../structures/member.ts'
import { Interaction } from '../../structures/slash.ts'
import { GuildTextBasedChannel } from '../../structures/guildTextChannel.ts'
import { InteractionPayload } from '../../types/slash.ts'
import { Gateway, GatewayEventHandler } from '../index.ts'

export const interactionCreate: GatewayEventHandler = async (
  gateway: Gateway,
  d: InteractionPayload
) => {
  const guild = await gateway.client.guilds.get(d.guild_id)
  if (guild === undefined) return

  await guild.members.set(d.member.user.id, d.member)
  const member = ((await guild.members.get(
    d.member.user.id
  )) as unknown) as Member

  const channel =
    (await gateway.client.channels.get<GuildTextBasedChannel>(d.channel_id)) ??
    (await gateway.client.channels.fetch<GuildTextBasedChannel>(d.channel_id))

  const interaction = new Interaction(gateway.client, d, {
    member,
    guild,
    channel
  })
  gateway.client.emit('interactionCreate', interaction)
}
