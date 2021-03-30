import {
  SlashCommandsManager,
  SlashClient,
  SlashCommandHandlerCallback
} from './src/models/slashClient.ts'
import { InteractionResponseType, InteractionType } from './src/types/slash.ts'

export interface DeploySlashInitOptions {
  env?: boolean
  publicKey?: string
  token?: string
  id?: string
}

let client: SlashClient
let commands: SlashCommandsManager

export function init(options: DeploySlashInitOptions): void {
  if (client !== undefined) throw new Error('Already initialized')
  if (options.env === true) {
    options.publicKey = Deno.env.get('PUBLIC_KEY')
    options.token = Deno.env.get('TOKEN')
    options.id = Deno.env.get('ID')
  }

  if (options.publicKey === undefined)
    throw new Error('Public Key not provided')

  client = new SlashClient({
    id: options.id,
    token: options.token,
    publicKey: options.publicKey
  })

  commands = client.commands

  const cb = async (evt: {
    respondWith: CallableFunction
    request: Request
  }): Promise<void> => {
    try {
      const d = await client.verifyFetchEvent({
        respondWith: (...args: any[]) => evt.respondWith(...args),
        request: evt.request,
      })
      if (d === false) {
        await evt.respondWith(
          new Response('Not Authorized', {
            status: 400
          })
        )
        return
      }

      if (d.type === InteractionType.PING) {
        await d.respond({ type: InteractionResponseType.PONG })
        client.emit('ping')
        return
      }

      await (client as any)._process(d)
    } catch (e) {
      console.log(e)
      await client.emit('interactionError', e)
    }
  }

  addEventListener('fetch', cb as any)
}

export function handle(
  cmd:
    | string
    | {
      name: string
      parent?: string
      group?: string
      guild?: string
    },
  handler: SlashCommandHandlerCallback
): void {
  const handle = {
    name: typeof cmd === 'string' ? cmd : cmd.name,
    handler,
    ...(typeof cmd === 'string' ? {} : cmd)
  }

  if (typeof handle.name === 'string' && handle.name.includes(' ') && handle.parent === undefined && handle.group === undefined) {
    const parts = handle.name.split(/ +/).filter(e => e !== '')
    if (parts.length > 3 || parts.length < 1) throw new Error('Invalid command name')
    const root = parts.shift() as string
    const group = parts.length === 3 ? parts.shift() : undefined
    const sub = parts.shift()

    handle.name = sub ?? root
    handle.group = group
    handle.parent = sub === undefined ? undefined : root
  }

  client.handle(handle)
}

export { commands, client }
export * from './src/types/slash.ts'
export * from './src/structures/slash.ts'
export * from './src/models/slashClient.ts'
