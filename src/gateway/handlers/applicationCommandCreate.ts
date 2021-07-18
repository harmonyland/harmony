import { SlashCommand } from '../../interactions/slashCommand.ts'
import { ApplicationCommandPayload } from '../../types/gateway.ts'
import type { Gateway, GatewayEventHandler } from '../mod.ts'

export const applicationCommandCreate: GatewayEventHandler = async (
  gateway: Gateway,
  d: ApplicationCommandPayload
) => {
  const guild =
    d.guild_id === undefined
      ? undefined
      : await gateway.client.guilds.get(d.guild_id)
  const cmd = new SlashCommand(gateway.client.slash.commands, d, guild)
  gateway.client.emit('slashCommandCreate', cmd)
}
