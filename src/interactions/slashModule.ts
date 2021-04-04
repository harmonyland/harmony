import { SlashCommandHandler } from './slashClient.ts'

export class SlashModule {
  name: string = ''
  commands: SlashCommandHandler[] = []
  _decoratedSlash?: SlashCommandHandler[]

  constructor() {
    if (this._decoratedSlash !== undefined) {
      this.commands = this._decoratedSlash
    }
  }

  add(handler: SlashCommandHandler): SlashModule {
    this.commands.push(handler)
    return this
  }
}
