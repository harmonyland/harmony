import { Guild } from '../../structures/guild.ts'
import { Member } from '../../structures/member.ts'
import { Role } from '../../structures/role.ts'
import {
  Interaction,
  InteractionApplicationCommandResolved,
  InteractionChannel
} from '../../structures/slash.ts'
import { GuildTextChannel } from '../../structures/textChannel.ts'
import { User } from '../../structures/user.ts'
import { InteractionPayload } from '../../types/slash.ts'
import { UserPayload } from '../../types/user.ts'
import { Permissions } from '../../utils/permissions.ts'
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

  if (d.member !== undefined)
    await guild?.members.set(d.member.user.id, d.member)
  const member =
    d.member !== undefined
      ? (((await guild?.members.get(d.member.user.id)) as unknown) as Member)
      : undefined
  if (d.user !== undefined) await gateway.client.users.set(d.user.id, d.user)
  const dmUser =
    d.user !== undefined ? await gateway.client.users.get(d.user.id) : undefined

  const user = member !== undefined ? member.user : dmUser
  if (user === undefined) return

  const channel =
    (await gateway.client.channels.get<GuildTextChannel>(d.channel_id)) ??
    (await gateway.client.channels.fetch<GuildTextChannel>(d.channel_id))

  const resolved: InteractionApplicationCommandResolved = {
    users: {},
    channels: {},
    members: {},
    roles: {}
  }

  if (d.data?.resolved !== undefined) {
    for (const [id, data] of Object.entries(d.data.resolved.users ?? {})) {
      await gateway.client.users.set(id, data)
      resolved.users[id] = ((await gateway.client.users.get(
        id
      )) as unknown) as User
      if (resolved.members[id] !== undefined)
        resolved.users[id].member = resolved.members[id]
    }

    for (const [id, data] of Object.entries(d.data.resolved.members ?? {})) {
      const roles = await guild?.roles.array()
      let permissions = new Permissions(Permissions.DEFAULT)
      if (roles !== undefined) {
        const mRoles = roles.filter(
          (r) => (data?.roles?.includes(r.id) as boolean) || r.id === guild?.id
        )
        permissions = new Permissions(mRoles.map((r) => r.permissions))
      }
      data.user = (d.data.resolved.users?.[id] as unknown) as UserPayload
      resolved.members[id] = new Member(
        gateway.client,
        data,
        resolved.users[id],
        guild as Guild,
        permissions
      )
    }

    for (const [id, data] of Object.entries(d.data.resolved.roles ?? {})) {
      if (guild !== undefined) {
        await guild.roles.set(id, data)
        resolved.roles[id] = ((await guild.roles.get(id)) as unknown) as Role
      } else {
        resolved.roles[id] = new Role(
          gateway.client,
          data,
          (guild as unknown) as Guild
        )
      }
    }

    for (const [id, data] of Object.entries(d.data.resolved.channels ?? {})) {
      resolved.channels[id] = new InteractionChannel(gateway.client, data)
    }
  }

  const interaction = new Interaction(gateway.client, d, {
    member,
    guild,
    channel,
    user,
    resolved
  })
  gateway.client.emit('interactionCreate', interaction)
}
