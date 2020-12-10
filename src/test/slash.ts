import { Client, Intents } from '../../mod.ts'
import { SlashCommandOptionType } from '../types/slash.ts'
import { TOKEN } from './config.ts'

const client = new Client()

client.on('ready', () => {
  console.log('Logged in!')
  client.slash.commands
    .create(
      {
        name: 'eval',
        description: 'Run some JS code!',
        options: [
          {
            name: 'code',
            description: 'Code to run',
            type: SlashCommandOptionType.STRING,
            required: true
          }
        ]
      },
      '783319033205751809'
    )
    .then(console.log)
})

client.on('interactionCreate', async (d) => {
  if (d.name === 'eval') {
    if (d.user.id !== '422957901716652033') {
      d.respond({
        content: 'This command can only be used by owner!'
      })
    } else {
      const code = d.data.options.find((e) => e.name === 'code')
        ?.value as string
      try {
        // eslint-disable-next-line no-eval
        let evaled = eval(code)
        if (evaled instanceof Promise) evaled = await evaled
        if (typeof evaled === 'object') evaled = Deno.inspect(evaled)
        let res = `${evaled}`.substring(0, 1990)
        while (client.token !== undefined && res.includes(client.token)) {
          res = res.replace(client.token, '[REMOVED]')
        }
        d.respond({
          content: '```js\n' + `${res}` + '\n```'
        })
      } catch (e) {
        d.respond({
          content: '```js\n' + `${e.stack}` + '\n```'
        })
      }
    }
    return
  }
  await d.respond({
    content: `Hi, ${d.member.user.username}!`,
    flags: 64
  })
})

client.connect(TOKEN, Intents.None)
