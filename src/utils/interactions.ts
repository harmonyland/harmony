import { InteractionType, MessageComponentInteraction } from '../../mod.ts'
import { Interaction } from '../structures/interactions.ts'
import { SlashCommandInteraction } from '../structures/slash.ts'

export function isSlashCommandInteraction(
  d: Interaction
): d is SlashCommandInteraction {
  return d.type === InteractionType.APPLICATION_COMMAND
}

export function isMessageComponentInteraction(
  d: Interaction
): d is MessageComponentInteraction {
  return d.type === InteractionType.MESSAGE_COMPONENT
}
