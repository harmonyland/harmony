import {
  ApplicationCommandChoice,
  InteractionApplicationCommandOption
} from '../types/applicationCommand.ts'
import { InteractionResponseType } from '../types/interactions.ts'
import { ApplicationCommandInteraction } from './applicationCommand.ts'

export class AutocompleteInteraction extends ApplicationCommandInteraction {
  get focusedOption(): InteractionApplicationCommandOption {
    return this.options.find((e) => e.focused === true)!
  }

  /** Respond with APPLICATION_COMMAND_AUTOCOMPLETE_RESULT */
  async autocomplete(choices: ApplicationCommandChoice[]): Promise<void> {
    await this.respond({
      type: InteractionResponseType.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT,
      choices
    })
  }
}
