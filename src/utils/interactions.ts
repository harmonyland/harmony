import { InteractionType, MessageComponentInteraction } from '../../mod.ts'
import { Interaction } from '../structures/interactions.ts'
import { ApplicationCommandInteraction } from '../structures/applicationCommand.ts'

export function isApplicationCommandInteraction(
  d: Interaction
): d is ApplicationCommandInteraction {
  return d.type === InteractionType.APPLICATION_COMMAND
}

export function isMessageComponentInteraction(
  d: Interaction
): d is MessageComponentInteraction {
  return d.type === InteractionType.MESSAGE_COMPONENT
}
