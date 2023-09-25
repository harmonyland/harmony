import {
  Client,
  Intents,
  event,
  slash,
  messageComponent,
  MessageComponentInteraction,
  SlashCommandInteraction,
  modalHandler,
  ModalSubmitInteraction
} from '../mod.ts'
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
            },
            {
              name: 'number',
              type: Type.NUMBER,
              description: 'Number'
            },
            {
              name: 'numberclamp',
              type: Type.NUMBER,
              description: 'Clamped number',
              minValue: 69,
              maxValue: 73
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
        },
        {
          name: 'test3',
          description: 'Test command with a message component decorators.'
        },
        {
          name: 'test4',
          description: 'Test command with a modal decorators.'
        }
      ],
      GUILD
    )
    this.interactions.commands.bulkEdit([])
  }

  @slash() test4(d: SlashCommandInteraction): void {
    d.showModal({
      title: 'Test',
      customID: 'modal_id',
      components: [
        {
          type: 1,
          components: [
            {
              type: 4,
              customID: 'text_field_id',
              placeholder: 'Test',
              label: 'Test',
              style: 1
            }
          ]
        }
      ]
    })
  }

  @modalHandler('modal_id') modal(d: ModalSubmitInteraction): void {
    d.reply(JSON.stringify(d.data.components))
  }

  @slash() test3(d: SlashCommandInteraction): void {
    d.reply({
      components: [
        {
          type: 1,
          components: [
            {
              type: 2,
              customID: 'button_id',
              label: 'Test',
              style: 1
            }
          ]
        }
      ]
    })
  }

  @slash() test(d: ApplicationCommandInteraction): void {
    console.log(d.resolved)
    console.log(d.options)
  }

  @messageComponent('button_id') cid(d: MessageComponentInteraction): void {
    d.reply('Working as intented')
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

client.interactions.on('interactionError', (d) => {
  console.log(d)
})

client.connect(TOKEN, Intents.None)
