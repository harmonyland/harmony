// I hate linter
/* eslint-disable */

import {
  ButtonStyle,
  Client,
  MessageComponents,
  SlashCommandPartial
} from '../mod.ts'
import { TOKEN } from './config.ts'

const client = new Client()

console.log('Connecting...')
await client.connect(TOKEN, ['GUILDS', 'GUILD_MESSAGES'])
console.log('Ready!')

client.slash.handle('button', (d) => {
  d.reply({
    content: 'Button Components',
    components: new MessageComponents().row((e) =>
      e
        .button({
          label: 'Primary',
          customID: 'test',
          style: ButtonStyle.Primary
        })
        .button({
          label: 'Secondary',
          customID: 'test',
          style: ButtonStyle.Secondary
        })
        .button({
          label: 'Success',
          customID: 'test',
          style: ButtonStyle.Success
        })
        .button({
          label: 'Destructive',
          customID: 'test',
          style: ButtonStyle.Destructive
        })
        .button({
          label: 'Link',
          url: 'https://google.com',
          style: ButtonStyle.Link
        })
    )
  })
})

client.slash.handle('select', (d) => {
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

client.slash.handle('test', (d) => {
  d.reply('Hmm', { ephemeral: true }).then(() => {
    setTimeout(() => {
      d.deleteResponse()
    }, 1000)
  })
})

const commands: SlashCommandPartial[] = [
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
const current = await client.slash.commands.guild(GUILD)

await client.slash.commands.bulkEdit(
  commands.map((e: any) => {
    let c
    if ((c = current.find((c) => c.id === e.id))) {
      e.id = c.id
    }
    return e
  }),
  GUILD
)
