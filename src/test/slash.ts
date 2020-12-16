import { Client, Intents, event, slash } from '../../mod.ts'
import { Embed } from '../structures/embed.ts'
import { Interaction } from '../structures/slash.ts'
import { TOKEN } from './config.ts'

export class MyClient extends Client {
  @event()
  ready(): void {
    console.log(`Logged in as ${this.user?.tag}!`)
  }

  @slash()
  send(d: Interaction): void {
    d.respond({
      content: d.data.options.find((e) => e.name === 'content')?.value
    })
  }

  @slash()
  async eval(d: Interaction): Promise<void> {
    if (
      d.user.id !== '422957901716652033' &&
      d.user.id !== '682849186227552266'
    ) {
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
  }

  @slash()
  async hug(d: Interaction): Promise<void> {
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
  }

  @slash()
  async kiss(d: Interaction): Promise<void> {
    const id = d.data.options.find((e) => e.name === 'user')?.value as string
    const user = (await client.users.get(id)) ?? (await client.users.fetch(id))
    const url = await fetch('https://nekos.life/api/v2/img/kiss')
      .then((r) => r.json())
      .then((e) => e.url)

    d.respond({
      embeds: [
        new Embed()
          .setTitle(`${d.user.username} kissed ${user?.username}!`)
          .setImage({ url })
          .setColor(0x2f3136)
      ]
    })
  }

  @slash('ping')
  pingCmd(d: Interaction): void {
    d.respond({
      content: `Pong!`
    })
  }
}

const client = new MyClient()
client.connect(TOKEN, Intents.None)
