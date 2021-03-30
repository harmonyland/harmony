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
      const d = await client.verifyFetchEvent(evt)
      if (d === false) {
        await evt.respondWith(
          new Response(null, {
            status: 400
          })
        )
        return
      }

      if (d.type === InteractionType.PING) {
        await d.respond({ type: InteractionResponseType.PONG })
        return
      }

      await (client as any)._process(d)
    } catch (e) {
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
  client.handle({
    name: typeof cmd === 'string' ? cmd : cmd.name,
    handler,
    ...(typeof cmd === 'string' ? {} : cmd)
  })
}

export { commands, client }
export * from './src/types/slash.ts'
export * from './src/structures/slash.ts'
export * from './src/models/slashClient.ts'
