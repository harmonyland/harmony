import { Member } from '../../structures/member.ts'
import { Interaction } from '../../structures/slash.ts'
import { GuildTextChannel } from '../../structures/textChannel.ts'
import { InteractionPayload } from '../../types/slash.ts'
import { Gateway, GatewayEventHandler } from '../index.ts'

export const interactionCreate: GatewayEventHandler = async (
  gateway: Gateway,
  d: InteractionPayload
) => {
  // NOTE(DjDeveloperr): Mason once mentioned that channel_id can be optional in Interaction.
  // This case can be seen in future proofing Interactions, and one he mentioned was
  // that bots will be able to add custom context menus. In that case, Interaction will not have it.
  // Ref: https://github.com/discord/discord-api-docs/pull/2568/files#r569025697
  if (d.channel_id === undefined) return

  const guild =
    d.guild_id === undefined
      ? undefined
      : await gateway.client.guilds.get(d.guild_id)
  if (guild === undefined) return

  if (d.member !== undefined)
    await guild.members.set(d.member.user.id, d.member)
  const member =
    d.member !== undefined
      ? (((await guild.members.get(d.member.user.id)) as unknown) as Member)
      : undefined
  if (d.user !== undefined) await gateway.client.users.set(d.user.id, d.user)
  const dmUser =
    d.user !== undefined ? await gateway.client.users.get(d.user.id) : undefined

  const user = member !== undefined ? member.user : dmUser
  if (user === undefined) return

  const channel =
    (await gateway.client.channels.get<GuildTextChannel>(d.channel_id)) ??
    (await gateway.client.channels.fetch<GuildTextChannel>(d.channel_id))

  const interaction = new Interaction(gateway.client, d, {
    member,
    guild,
    channel,
    user
  })
  gateway.client.emit('interactionCreate', interaction)
}
