import type {
  ApplicationCommandHandler,
  AutocompleteHandler
} from './client.ts'

export class ApplicationCommandsModule {
  name: string = ''
  commands: ApplicationCommandHandler[] = []
  autocomplete: AutocompleteHandler[] = []

  constructor() {
    if ((this as any)._decoratedAppCmd !== undefined) {
      this.commands = (this as any)._decoratedAppCmd
    }

    if ((this as any)._decoratedAutocomplete !== undefined) {
      this.autocomplete = (this as any)._decoratedAutocomplete
    }
  }

  add(handler: ApplicationCommandHandler): this {
    this.commands.push(handler)
    return this
  }
}

export { ApplicationCommandsModule as SlashModule }
