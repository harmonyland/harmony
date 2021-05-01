import { InteractionType } from '../../mod.ts'
import { Interaction } from '../structures/interactions.ts'
import { SlashCommandInteraction } from '../structures/slash.ts'

export function isSlashCommandInteraction(
  d: Interaction
): d is SlashCommandInteraction {
  return d.type === InteractionType.APPLICATION_COMMAND
}
