/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { Guild } from '../../structures/guild.ts'
import { Member } from '../../structures/member.ts'
import {
  InteractionApplicationCommandResolved,
  ApplicationCommandInteraction
} from '../../structures/applicationCommand.ts'
import { MessageComponentInteraction } from '../../structures/messageComponents.ts'
import {
  Interaction,
  InteractionChannel
} from '../../structures/interactions.ts'
import { GuildTextBasedChannel } from '../../structures/guildTextChannel.ts'
import {
  InteractionPayload,
  InteractionType
} from '../../types/interactions.ts'
import { UserPayload } from '../../types/user.ts'
import { Permissions } from '../../utils/permissions.ts'
import type { Gateway, GatewayEventHandler } from '../mod.ts'
import { User } from '../../structures/user.ts'
import { Role } from '../../structures/role.ts'
import { RolePayload } from '../../types/role.ts'
import {
  InteractionApplicationCommandData,
  InteractionChannelPayload
} from '../../types/applicationCommand.ts'
import { Message } from '../../structures/message.ts'
import { TextChannel } from '../../structures/textChannel.ts'
import { MessagePayload } from '../../types/channel.ts'
import { GuildPayload, MemberPayload } from '../../types/guild.ts'
import { AutocompleteInteraction } from '../../structures/autocompleteInteraction.ts'
import { ModalSubmitInteraction } from '../../structures/modalSubmitInteraction.ts'

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
      : (await gateway.client.guilds.get(d.guild_id)) ??
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        new Guild(gateway.client, {
          unavailable: true,
          id: d.guild_id
        } as GuildPayload)

  if (d.member !== undefined)
    await guild?.members.set(d.member.user.id, d.member)
  const member =
    d.member !== undefined
      ? (await guild?.members.get(d.member.user.id))! ??
        new Member(
          gateway.client,
          d.member!,
          new User(gateway.client, d.member.user),
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
          guild!,
          new Permissions(d.member.permissions)
        )
      : undefined
  if (member !== undefined) {
    member.permissions.bitfield = BigInt(d.member!.permissions!)
  }
  if (d.user !== undefined) await gateway.client.users.set(d.user.id, d.user)
  const dmUser =
    d.user !== undefined ? await gateway.client.users.get(d.user.id) : undefined

  const user = member !== undefined ? member.user : dmUser
  if (user === undefined) return

  const channel = await gateway.client.channels.get<GuildTextBasedChannel>(
    d.channel_id
  )

  const resolved: InteractionApplicationCommandResolved = {
    users: {},
    channels: {},
    members: {},
    roles: {},
    messages: {}
  }

  if ((d.data as InteractionApplicationCommandData)?.resolved !== undefined) {
    for (const [id, data] of Object.entries(
      (d.data as InteractionApplicationCommandData)?.resolved?.users ?? {}
    )) {
      await gateway.client.users.set(id, data as UserPayload)
      resolved.users[id] = (await gateway.client.users.get(
        id
      )) as unknown as User
      if (resolved.members[id] !== undefined)
        resolved.users[id].member = resolved.members[id]
    }

    for (const [id, data] of Object.entries(
      (d.data as InteractionApplicationCommandData)?.resolved?.members ?? {}
    )) {
      const roles = await guild?.roles.array()
      let permissions = new Permissions(Permissions.DEFAULT)
      if (roles !== undefined) {
        const mRoles = roles.filter(
          (r) => (data?.roles?.includes(r.id) as boolean) || r.id === guild?.id
        )
        permissions = new Permissions(mRoles.map((r) => r.permissions))
      }
      ;(data as MemberPayload).user = (
        d.data as InteractionApplicationCommandData
      ).resolved?.users?.[id] as unknown as UserPayload
      resolved.members[id] = new Member(
        gateway.client,
        data,
        resolved.users[id],
        guild as Guild,
        permissions
      )
    }

    for (const [id, data] of Object.entries(
      (d.data as InteractionApplicationCommandData).resolved?.roles ?? {}
    )) {
      if (guild !== undefined) {
        await guild.roles.set(id, data as RolePayload)
        resolved.roles[id] = (await guild.roles.get(id)) as unknown as Role
      } else {
        resolved.roles[id] = new Role(
          gateway.client,
          data,
          guild as unknown as Guild
        )
      }
    }

    for (const [id, data] of Object.entries(
      (d.data as InteractionApplicationCommandData).resolved?.channels ?? {}
    )) {
      resolved.channels[id] = new InteractionChannel(
        gateway.client,
        data as InteractionChannelPayload
      )
    }

    for (const [id, data] of Object.entries(
      (d.data as InteractionApplicationCommandData).resolved?.messages ?? {}
    )) {
      const channel = await gateway.client.channels.get<TextChannel>(
        data.channel_id
      )
      await channel?.messages.set(data.id, data)
      await gateway.client.users.set(data.author.id, data.author)
      resolved.messages[id] = new Message(
        gateway.client,
        data as MessagePayload,
        channel!,
        (await gateway.client.users.get(data.author.id))!
      )
    }
  }

  let message: Message | undefined
  if (d.message !== undefined) {
    const channel = (await gateway.client.channels.get<TextChannel>(
      d.message.channel_id
    ))!
    await gateway.client.users.set(d.message.author.id, d.message.author)
    message = new Message(
      gateway.client,
      d.message,
      channel,
      (d.message.author !== undefined
        ? new User(gateway.client, d.message.author)
        : undefined)! // skip author for now since ephemeral messages don't have it
    )
    await message.mentions.fromPayload(d.message)
  }

  let interaction
  if (d.type === InteractionType.APPLICATION_COMMAND) {
    interaction = new ApplicationCommandInteraction(gateway.client, d, {
      member,
      guild,
      channel,
      user,
      resolved
    })
  } else if (d.type === InteractionType.AUTOCOMPLETE) {
    interaction = new AutocompleteInteraction(gateway.client, d, {
      member,
      guild,
      channel,
      user,
      resolved
    })
  } else if (d.type === InteractionType.MESSAGE_COMPONENT) {
    interaction = new MessageComponentInteraction(gateway.client, d, {
      member,
      guild,
      channel,
      user,
      message
    })
  } else if (d.type === InteractionType.MODAL_SUBMIT) {
    interaction = new ModalSubmitInteraction(gateway.client, d, {
      member,
      guild,
      channel,
      user
    })
  } else {
    interaction = new Interaction(gateway.client, d, {
      member,
      guild,
      channel,
      user,
      message
    })
  }

  gateway.client.emit('interactionCreate', interaction)
}
