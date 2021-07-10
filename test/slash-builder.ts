import { Client, Intents, event } from '../mod.ts'
import { SlashBuilder, SlashOption } from '../src/interactions/slashCommand.ts'
import { TOKEN, GUILD } from './config.ts'

export class MyClient extends Client {
  @event() ready(): void {
    console.log(`Logged in as ${this.user?.tag}!`)
    this.slash.commands.bulkEdit(
      [
        new SlashBuilder('test')
          .description('Test command made with builder.')
          .option(
            SlashOption.subCommandGroup({
              name: 'group',
              description: 'Group description.',
              options: [
                SlashOption.subCommand({
                  name: 'sub',
                  description: 'Subcommand description.',
                  options: [
                    SlashOption.bool({ name: 'bool' }),
                    SlashOption.channel({ name: 'channel' }),
                    SlashOption.number({ name: 'number' }),
                    SlashOption.role({ name: 'role' }),
                    SlashOption.string({ name: 'string' }),
                    SlashOption.user({ name: 'user' })
                  ]
                })
              ]
            })
          )
          .export()
      ],
      GUILD
    )
    this.slash.commands.bulkEdit([])
  }
}

const client = new MyClient({
  presence: {
    status: 'dnd',
    activity: { name: 'Slash Commands', type: 'LISTENING' }
  }
})

client.connect(TOKEN, Intents.None)
