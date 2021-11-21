/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Client } from '../mod.ts'
import { TOKEN } from './config.ts'

const FILE = new URL('./pokemon.json', import.meta.url)

try {
  await Deno.lstat(FILE)
} catch (e) {
  await Deno.writeFile(
    FILE,
    await fetch(
      'https://raw.githubusercontent.com/jalyna/oakdex-pokedex/master/data/pokemon.json'
    )
      .then((e) => e.arrayBuffer())
      .then((e) => new Uint8Array(e))
  )
}

const data = JSON.parse(await Deno.readTextFile(FILE))
const names = Object.keys(data)

const client = new Client({
  token: TOKEN,
  intents: []
})

const clean = (x: string): string => x.replaceAll(/^[a-zA-Z0-9]/g, '')

client.interactions.autocomplete('choose', 'pokemon', (d) => {
  const value = clean(d.focusedOption.value ?? '')

  return d.autocomplete(
    names
      .filter((e) => clean(e).startsWith(value))
      .filter((_, i) => i < 10)
      .map((e) => ({ name: e, value: e }))
  )
})

client.interactions.handle('choose', (d) =>
  d.reply(`${d.option('pokemon')}`, { ephemeral: true })
)

if (Deno.args.includes('sync')) {
  client.interactions.commands.bulkEdit(
    [
      {
        name: 'choose',
        description: 'Choose a Pokemon',
        options: [
          {
            type: 'STRING',
            name: 'pokemon',
            autocomplete: true,
            description: 'Pokemon to choose.',
            required: true
          }
        ]
      }
    ],
    '783319033205751809'
  )
}

client.connect().then(() => console.log('Connected!'))
