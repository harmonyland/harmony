/**
 * Make sure to run with a tsconfig with these `compilerOptions`:
 *
 * `"jsx": "react"`
 * `"jsxFactory": "BotUI.createElement"`
 * `"jsxFragmentFactory": "fragment"`
 *
 * else TSX compilation won't work.
 */
import {
  Client,
  BotUI,
  fragment,
  ActionRow,
  Button,
  InteractionResponseType
} from '../mod.ts'
import { TOKEN } from './config.ts'

const client = new Client({
  token: TOKEN,
  intents: ['GUILDS', 'GUILD_MESSAGES']
})

client.on('messageCreate', (msg) => {
  if (msg.content === '!cookie') {
    msg.channel.send({
      content: 'Cookie: 0',
      components: (
        <>
          <ActionRow>
            <Button id="cookie" style="success" emoji={{ name: '🍪' }} />
          </ActionRow>
        </>
      )
    })
  }
})

client.on('interactionCreate', (d) => {
  // disabling linter because if i add === true then type guard doesn't work
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (d.isMessageComponent()) {
    if (d.customID === 'cookie') {
      d.respond({
        type: InteractionResponseType.UPDATE_MESSAGE,
        content: `Cookie: ${
          Number(d.message.content.replaceAll(/\D/g, '')) + 1
        }`
      })
    }
  }
})

client.connect().then(() => console.log('Connected!'))
