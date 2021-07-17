import type { SlashCommandHandler } from './slashClient.ts'

export class SlashModule {
  name: string = ''
  commands: SlashCommandHandler[] = []

  constructor() {
    if ((this as any)._decoratedSlash !== undefined) {
      ;(this as any).commands = (this as any)._decoratedSlash
    }
  }

  add(handler: SlashCommandHandler): SlashModule {
    this.commands.push(handler)
    return this
  }
}
