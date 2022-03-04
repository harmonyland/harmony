import { Client } from '../mod.ts'
import { TOKEN } from './config.ts'

const client = new Client({
  token: TOKEN,
  intents: ['GUILDS']
})

client.interactions.handle('modal', (i) => {
  return i.showModal({
    title: 'Test Modal',
    customID: 'test_modal',
    components: [
      {
        type: 'ACTION_ROW',
        components: [
          {
            type: 'TEXT_INPUT',
            customID: 'text_input_short',
            label: 'Short text',
            style: 'SHORT',
            placeholder: 'Enter something short'
          }
        ]
      },
      {
        type: 'ACTION_ROW',
        components: [
          {
            type: 'TEXT_INPUT',
            customID: 'text_input_para',
            label: 'Paragraph input',
            style: 'PARAGRAPH',
            placeholder: 'Enter a thicc story'
          }
        ]
      }
    ]
  })
})

client.on('interactionCreate', (i) => {
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (i.isModalSubmit()) {
    return i.reply(
      `Short text: ${
        i.getComponent('text_input_short')!.value
      }\nParagraph input: ${i.getComponent('text_input_para')!.value}`
    )
  }
})

if (Deno.args.includes('sync') === true) {
  await client.interactions.commands.bulkEdit(
    [
      {
        name: 'modal',
        description: 'Opens test modal.'
      }
    ],
    '783319033205751809'
  )
  console.log('Synced commands!')
}

client.interactions.on('interactionError', console.error)

await client.connect()
console.log('Connected!')
