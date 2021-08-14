import { Client, Intents, event, slash } from '../mod.ts'
import { ApplicationCommandInteraction } from '../src/structures/applicationCommand.ts'
import { ApplicationCommandOptionType as Type } from '../src/types/applicationCommand.ts'
import { TOKEN, GUILD } from './config.ts'

export class MyClient extends Client {
  @event() ready(): void {
    console.log(`Logged in as ${this.user?.tag}!`)
    this.slash.commands.bulkEdit(
      [
        {
          name: 'test',
          description: 'Test command.',
          options: [
            {
              name: 'user',
              type: Type.USER,
              description: 'User'
            },
            {
              name: 'role',
              type: Type.ROLE,
              description: 'Role'
            },
            {
              name: 'channel',
              type: Type.CHANNEL,
              description: 'Channel'
            },
            {
              name: 'string',
              type: Type.STRING,
              description: 'String'
            }
          ]
        },
        {
          name: 'test2',
          description: 'Test command with a group and subcommands.',
          options: [
            {
              name: 'group',
              description: 'Test group.',
              type: Type.SUB_COMMAND_GROUP,
              options: [
                {
                  name: 'sub1',
                  description: 'Test subcommand 1.',
                  type: Type.SUB_COMMAND
                },
                {
                  name: 'sub2',
                  description: 'Test subcommand 2.',
                  type: Type.SUB_COMMAND
                }
              ]
            }
          ]
        }
      ],
      GUILD
    )
    this.slash.commands.bulkEdit([])
  }

  @slash() test(d: ApplicationCommandInteraction): void {
    console.log(d.resolved)
  }

  @event() raw(evt: string, d: any): void {
    if (evt === 'INTERACTION_CREATE') console.log(evt, d?.data?.resolved)
  }
}

const client = new MyClient({
  presence: {
    status: 'dnd',
    activity: { name: 'Slash Commands', type: 'LISTENING' }
  }
})

client.connect(TOKEN, Intents.None)
