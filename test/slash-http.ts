import { SlashClient } from '../mod.ts'
import { SLASH_ID, SLASH_PUB_KEY, SLASH_TOKEN } from './config.ts'
import { listenAndServe } from './deps.ts'

const slash = new SlashClient({
  id: SLASH_ID,
  token: SLASH_TOKEN,
  publicKey: SLASH_PUB_KEY
})

await slash.commands.bulkEdit([
  {
    name: 'ping',
    description: 'Just ping!'
  }
])

const options = { port: 8000 }
console.log('Listen on port: ' + options.port.toString())
listenAndServe(options, async (req) => {
  const d = await slash.verifyServerRequest(req)
  if (d === false) return req.respond({ status: 401, body: 'not authorized' })

  console.log(d)
  if (d.type === 1) return d.respond({ type: 1 })
  d.reply('Pong!')
})
