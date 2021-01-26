import { SlashCommand } from '../../models/slashClient.ts'
import { ApplicationCommandPayload } from '../../types/gateway.ts'
import { Gateway, GatewayEventHandler } from '../index.ts'

export const applicationCommandDelete: GatewayEventHandler = async (
  gateway: Gateway,
  d: ApplicationCommandPayload
) => {
  const guild =
    d.guild_id === undefined
      ? undefined
      : await gateway.client.guilds.get(d.guild_id)
  const cmd = new SlashCommand(gateway.client.slash.commands, d, guild)
  gateway.client.emit('slashCommandDelete', cmd)
}
