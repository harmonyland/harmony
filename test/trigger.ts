/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable no-control-regex */
import { Client, Embed } from '../mod.ts'
import { TOKEN } from './config.ts'

const client = new Client({
  token: TOKEN,
  intents: ['GUILDS', 'GUILD_MESSAGES']
})

const NAME_MATCH = /[^a-zA-Z0-9_]/
const STD_REGEX = /\/?std(@[\x00-\x2e\x30-\xff]+)?\/([a-zA-Z0-9]+)(\/[\S\s]+)?/
const X_REGEX = /\/?x\/([a-zA-Z0-9]+)(@[\x00-\x2e\x30-\xff]+)?(\/[\S\s]+)?/

export async function fetchModule(name: string): Promise<any> {
  if (name.match(NAME_MATCH) !== null) return null
  return fetch(`https://api.deno.land/modules/${name}`, {
    credentials: 'omit',
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:83.0) Gecko/20100101 Firefox/83.0',
      Accept: 'application/json',
      'Accept-Language': 'en-US,en;q=0.5',
      Pragma: 'no-cache',
      'Cache-Control': 'no-cache'
    },
    referrer: 'https://deno.land/x',
    mode: 'cors'
  })
    .then((res) => {
      if (res.status !== 200) throw new Error('not found')
      return res
    })
    .then((r) => r.json())
    .then((json) => {
      if (!json.success) throw new Error('failed')
      return json
    })
    .then((data) => data.data)
    .catch(() => null)
}

client.on('messageCreate', async (msg) => {
  if (msg.author.bot === true) return

  let match
  if (
    (match = msg.content.match(STD_REGEX)) ||
    (match = msg.content.match(X_REGEX))
  ) {
    let x = match[0].trim()

    if (!x.startsWith('/')) x = `/${x}`

    let type
    if (x.startsWith('/std')) {
      x = x.slice(4)
      type = 'std'
    } else {
      x = x.slice(3)
      type = 'x'
    }

    x = x.trim()
    const name = x.split('/')[0].split('@')[0]
    const mod = await fetchModule(type === 'std' ? 'std' : name)
    if (mod === null) return

    msg.channel.send(
      new Embed()
        .setColor('#7289DA')
        .setURL(
          `https://deno.land/${type}${
            x.startsWith('/') || x.startsWith('@') ? '' : '/'
          }${x}`
        )
        .setTitle(
          `${type}${x.startsWith('/') || x.startsWith('@') ? '' : '/'}${x}`
        )
        .setDescription(mod.description ?? 'No description.')
        .setFooter(`${mod.star_count ?? 0}`, 'https://kokoro.pw/colleague.png')
    )
  }
})

console.log('Connecting...')
client.connect().then(() => console.log('Ready!'))
