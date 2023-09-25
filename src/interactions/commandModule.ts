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

  constructor() {
    if ((this as any)._decoratedAppCmd !== undefined) {
      this.commands = (this as any)._decoratedAppCmd
    }

    if ((this as any)._decoratedAutocomplete !== undefined) {
      this.autocomplete = (this as any)._decoratedAutocomplete
    }

    if ((this as any)._decoratedComponents !== undefined) {
      this.components = (this as any)._decoratedComponents
    }
  }

  add(handler: ApplicationCommandHandler): this {
    this.commands.push(handler)
    return this
  }
}

export { ApplicationCommandsModule as SlashModule }
