import { ApplicationCommand } from '../../interactions/applicationCommand.ts'
import { ApplicationCommandPayload } from '../../types/applicationCommand.ts'
import type { Gateway, GatewayEventHandler } from '../mod.ts'

export const applicationCommandUpdate: GatewayEventHandler = async (
  gateway: Gateway,
  d: ApplicationCommandPayload
) => {
  const guild =
    d.guild_id === undefined
      ? undefined
      : await gateway.client.guilds.get(d.guild_id)
  const cmd = new ApplicationCommand(
    gateway.client.interactions.commands,
    d,
    guild
  )
  gateway.client.emit('slashCommandUpdate', cmd)
  gateway.client.emit('applicationCommandUpdate', cmd)
}
