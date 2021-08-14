import type { ApplicationCommandHandler } from './client.ts'

export class ApplicationCommandsModule {
  name: string = ''
  commands: ApplicationCommandHandler[] = []

  constructor() {
    if ((this as any)._decoratedAppCmd !== undefined) {
      ;(this as any).commands = (this as any)._decoratedAppCmd
    }
  }

  add(handler: ApplicationCommandHandler): this {
    this.commands.push(handler)
    return this
  }
}

export { ApplicationCommandsModule as SlashModule }
