import * as harmony from '../mod.ts'
import { TOKEN } from './config.ts'

const client = new harmony.Client({
  token: TOKEN,
  intents: ['GUILDS']
})

client.on('interactionCreate', (d) => {})

client.interactions.handle(
  'View Embeds JSON',
  (d) => {
    return d.reply(
      `\`\`\`json\n${JSON.stringify(d.targetMessage!.embeds, null, 2)}\n\`\`\``,
      { ephemeral: true }
    )
  },
  'MESSAGE'
)

client.interactions.handle(
  'View User JSON',
  (d) => {
    const user = d.targetUser!
    return d.reply(
      `\`\`\`json\n${JSON.stringify(
        // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
        d.data.resolved?.users?.[user.id]!,
        null,
        2
      )}\n\`\`\``,
      { ephemeral: true }
    )
  },
  'USER'
)

client.interactions.handle('ping', (d) => {
  return d.reply('Pong!', { ephemeral: true })
})

client.interactions.handle('test test', (d) => {
  return d.reply('Test worked!', { ephemeral: true })
})

client.interactions.commands.bulkEdit(
  [
    {
      name: 'ping',
      description: 'Ping command!'
    },
    {
      name: 'test',
      description: 'Test command',
      options: [
        {
          type: 'SUB_COMMAND',
          name: 'test',
          description: 'Test sub command'
        }
      ]
    },
    {
      name: 'View Embeds JSON',
      type: 'MESSAGE'
    },
    {
      name: 'View User JSON',
      type: 'USER'
    }
  ],
  '796721933098024960'
)

client.connect().then(() => console.log('Connected!'))
