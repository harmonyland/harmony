import type {
  ApplicationCommandHandler,
  AutocompleteHandler,
  ComponentInteractionHandler
} from './client.ts'

export class ApplicationCommandsModule {
  name: string = ''
  commands: ApplicationCommandHandler[] = []
  autocomplete: AutocompleteHandler[] = []
  components: ComponentInteractionHandler[] = []

  add(handler: ApplicationCommandHandler): this {
    this.commands.push(handler)
    return this
  }
}

export { ApplicationCommandsModule as SlashModule }
