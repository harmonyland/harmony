import { Client, Intents } from '../../mod.ts'
import { Embed } from '../structures/embed.ts'
import { SlashCommandOptionType } from '../types/slash.ts'
import { TOKEN } from './config.ts'

const client = new Client()

client.on('ready', () => {
  console.log('Logged in!')
  client.slash.commands
    .create(
      {
        name: 'send',
        description: 'Send a Message through Bot!',
        options: [
          {
            name: 'content',
            description: 'Message to send',
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
        }).catch(() => {})
      } catch (e) {
        d.respond({
          content: '```js\n' + `${e.stack}` + '\n```'
        })
      }
    }
    return
  } else if (d.name === 'hug') {
    const id = d.data.options.find((e) => e.name === 'user')?.value as string
    const user = (await client.users.get(id)) ?? (await client.users.fetch(id))
    const url = await fetch('https://nekos.life/api/v2/img/hug')
      .then((r) => r.json())
      .then((e) => e.url)

    d.respond({
      embeds: [
        new Embed()
          .setTitle(`${d.user.username} hugged ${user?.username}!`)
          .setImage({ url })
          .setColor(0x2f3136)
      ]
    })
    return
  } else if (d.name === 'send') {
    d.respond({
      content: d.data.options.find((e) => e.name === 'content')?.value as string
    })
    return
  }
  await d.respond({
    content: `Hi, ${d.member.user.username}! You used /${d.name}`
  })
})

client.connect(TOKEN, Intents.None)
