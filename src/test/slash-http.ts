import { SlashClient } from '../../mod.ts'
import { SLASH_ID, SLASH_PUB_KEY, SLASH_TOKEN } from './config.ts'
import { listenAndServe } from 'https://deno.land/std@0.90.0/http/server.ts'

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
  const verify = await slash.verifyServerRequest(req)
  if (verify === false)
    return req.respond({ status: 401, body: 'not authorized' })

  const respond = async (d: any): Promise<void> =>
    req.respond({
      status: 200,
      body: JSON.stringify(d),
      headers: new Headers({
        'content-type': 'application/json'
      })
    })

  const body = JSON.parse(
    new TextDecoder('utf-8').decode(await Deno.readAll(req.body))
  )
  if (body.type === 1) return await respond({ type: 1 })
  await respond({
    type: 4,
    data: {
      content: 'Pong!'
    }
  })
})
