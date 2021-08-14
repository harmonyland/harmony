// I hate linter
/* eslint-disable */

import {
  ButtonStyle,
  Client,
  MessageComponents,
  ApplicationCommandPartial
} from '../mod.ts'
import { MessageComponentType } from '../src/types/messageComponents.ts'
import { TOKEN } from './config.ts'

const client = new Client()

console.log('Connecting...')
await client.connect(TOKEN, ['GUILDS', 'GUILD_MESSAGES'])
console.log('Ready!')

client.on('messageCreate', (msg) => {
  if (msg.content === '!select') {
    msg.reply('Hello Components', {
      components: [
        {
          type: MessageComponentType.ActionRow,
          components: [
            {
              customID: 'test',
              type: MessageComponentType.Select,
              options: [
                {
                  label: 'Label 1',
                  value: 'Value 1'
                },
                {
                  label: 'Label 2',
                  value: 'Value 2'
                }
              ]
            }
          ]
        }
      ]
    })
  }
})

client.interactions.handle('button', (d) => {
  d.reply({
    content: 'Button Components',
    flags: 64,
    components: new MessageComponents()
      .row((e) =>
        e
          .button({
            label: 'Primary',
            customID: 'test',
            style: 'PRIMARY'
          })
          .button({
            label: 'Secondary',
            customID: 'test',
            style: 'SECONDARY'
          })
          .button({
            label: 'Success',
            customID: 'test',
            style: 'SUCCESS'
          })
          .button({
            label: 'Danger',
            customID: 'test',
            style: 'DANGER'
          })
          .button({
            label: 'Link',
            url: 'https://google.com',
            style: 'LINK'
          })
      )
      .row((e) =>
        e.select({
          customID: 'test',
          options: [
            {
              label: 'Label 1',
              value: 'Value 1'
            },
            {
              label: 'Label 2',
              value: 'Value 2'
            }
          ]
        })
      )
  })
})

client.interactions.handle('select', (d) => {
  d.reply('Select Component', {
    components: new MessageComponents().row((e) =>
      e.select({
        customID: 'test',
        options: [
          { label: 'Label 1', value: 'Value 1' },
          { label: 'Label 2', value: 'Value 2' }
        ]
      })
    )
  })
})

client.interactions.handle('test', (d) => {
  d.reply('Hmm', { ephemeral: true }).then(() => {
    setTimeout(() => {
      d.deleteResponse()
    }, 1000)
  })
})

const commands: ApplicationCommandPartial[] = [
  {
    name: 'button',
    description: 'Sends Button component'
  },
  {
    name: 'select',
    description: 'Sends Select component'
  },
  {
    name: 'test',
    description: 'Test slash command'
  }
]

const GUILD = '837903552570720307'
const current = await client.interactions.commands.guild(GUILD)

await client.interactions.commands.bulkEdit(
  commands.map((e: any) => {
    let c
    if ((c = current.find((c) => c.id === e.id))) {
      e.id = c.id
    }
    return e
  }),
  GUILD
)
