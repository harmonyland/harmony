import { Interaction } from './src/structures/interactions.ts'
import {
  ApplicationCommandsManager,
  InteractionsClient,
  ApplicationCommandHandler,
  ApplicationCommandHandlerCallback,
  AutocompleteHandlerCallback
} from './src/interactions/mod.ts'
import {
  InteractionResponseType,
  InteractionType
} from './src/types/interactions.ts'
import { ApplicationCommandType } from './src/types/applicationCommand.ts'

export interface DeploySlashInitOptions {
  env?: boolean
  publicKey?: string
  token?: string
  path?: string
}

/** Current Slash Client being used to handle commands */
let client: InteractionsClient
/** Manage Slash Commands right in Deploy */
let commands: ApplicationCommandsManager

/**
 * Initialize Slash Commands Handler for [Deno Deploy](https://deno.com/deploy).
 * Easily create Serverless Slash Commands on the fly.
 *
 * **Examples**
 *
 * ```ts
 * init({
 *   publicKey: "my public key",
 *   token: "my bot's token", // only required if you want to manage slash commands in code
 * })
 * ```
 *
 * ```ts
 * // takes up `PUBLIC_KEY` and `TOKEN` from ENV
 * init({ env: true })
 * ```
 *
 * @param options Initialization options
 */
export function init(options: { env: boolean; path?: string }): void
export function init(options: {
  publicKey: string
  token?: string
  path?: string
}): void
export function init(options: DeploySlashInitOptions): void {
  if (client !== undefined) throw new Error('Already initialized')
  if (options.env === true) {
    options.publicKey = Deno.env.get('PUBLIC_KEY')
    options.token = Deno.env.get('TOKEN')
  }

  if (options.publicKey === undefined)
    throw new Error('Public Key not provided')

  client = new InteractionsClient({
    token: options.token,
    publicKey: options.publicKey
  })

  commands = client.commands

  const requestHandler = async (request: Request): Promise<Response> => {
    if (options.path !== undefined) {
      if (new URL(request.url).pathname !== options.path)
        return new Response('Bad Request', {
          status: 400
        })
    }
    try {
      const interaction = await client.verifyFetchEvent({
        request,
        respondWith: (res: Response) => {
          return res
        }
      })
      if (!interaction) {
        // ... unauthorized
        return new Response('Not Authorized', {
          status: 400
        })
      }
      if (interaction.type === InteractionType.PING) {
        await interaction.respond({ type: InteractionResponseType.PONG })
        await client.emit('ping')
      }

      await client._process(interaction)
      return new Response('Error', {
        status: 500
      })
    } catch (e) {
      client.emit('interactionError', e as Error)
      return new Response('Error', {
        status: 500
      })
    }
  }
  Deno.serve(requestHandler)
}

/**
 * Register Slash Command handler.
 *
 * Example:
 *
 * ```ts
 * handle("ping", (interaction) => {
 *   interaction.reply("Pong!")
 * })
 * ```
 *
 * Also supports Sub Command and Group handling out of the box!
 * ```ts
 * handle("command-name group-name sub-command", (i) => {
 *   // ...
 * })
 *
 * handle("command-name sub-command", (i) => {
 *   // ...
 * })
 * ```
 *
 * @param cmd Command to handle. Either Handler object or command name followed by handler function in next parameter.
 * @param handler Handler function (required if previous argument was command name)
 */
export function handle(
  cmd: string,
  handler: ApplicationCommandHandlerCallback
): void
export function handle(cmd: ApplicationCommandHandler): void
export function handle(
  cmd: string,
  handler: ApplicationCommandHandlerCallback,
  type: ApplicationCommandType | keyof typeof ApplicationCommandType
): void
export function handle(
  cmd: string | ApplicationCommandHandler,
  handler?: ApplicationCommandHandlerCallback,
  type?: ApplicationCommandType | keyof typeof ApplicationCommandType
): void {
  if (client === undefined)
    throw new Error('Interaction Client not initialized. Call `init` first')

  if (
    typeof cmd === 'string' &&
    typeof handler === 'function' &&
    typeof type !== 'undefined'
  ) {
    client.handle(cmd, handler, type)
  } else if (typeof cmd === 'string' && typeof handler === 'function') {
    client.handle(cmd, handler)
  } else if (typeof cmd === 'object') {
    client.handle(cmd)
  } else throw new Error('Invalid overload for `handle` function')
}

export function autocomplete(
  cmd: string,
  option: string,
  callback: AutocompleteHandlerCallback
): void {
  client.autocomplete(cmd, option, callback)
}

/** Listen for Interactions Event */
export function interactions(
  requestHandler: (i: Interaction) => Promise<Response>
): void {
  client.on('interaction', requestHandler)
}

export { commands, client }
export * from './src/types/applicationCommand.ts'
export * from './src/types/interactions.ts'
export * from './src/structures/applicationCommand.ts'
export * from './src/interactions/mod.ts'
export * from './src/types/channel.ts'
export * from './src/structures/interactions.ts'
export * from './src/structures/message.ts'
export * from './src/structures/embed.ts'
export * from './src/types/messageComponents.ts'
alfiecrawford@Alfies-Air harmony-main % npx prettier deploy.ts -o output.txt
[warn] Ignored unknown option -o=output.txt. Did you mean -c?
import { Interaction } from './src/structures/interactions.ts'
import {
  ApplicationCommandsManager,
  InteractionsClient,
  ApplicationCommandHandler,
  ApplicationCommandHandlerCallback,
  AutocompleteHandlerCallback
} from './src/interactions/mod.ts'
import {
  InteractionResponseType,
  InteractionType
} from './src/types/interactions.ts'
import { ApplicationCommandType } from './src/types/applicationCommand.ts'

export interface DeploySlashInitOptions {
  env?: boolean
  publicKey?: string
  token?: string
  path?: string
}

/** Current Slash Client being used to handle commands */
let client: InteractionsClient
/** Manage Slash Commands right in Deploy */
let commands: ApplicationCommandsManager

/**
 * Initialize Slash Commands Handler for [Deno Deploy](https://deno.com/deploy).
 * Easily create Serverless Slash Commands on the fly.
 *
 * **Examples**
 *
 * ```ts
 * init({
 *   publicKey: "my public key",
 *   token: "my bot's token", // only required if you want to manage slash commands in code
 * })
 * ```
 *
 * ```ts
 * // takes up `PUBLIC_KEY` and `TOKEN` from ENV
 * init({ env: true })
 * ```
 *
 * @param options Initialization options
 */
export function init(options: { env: boolean; path?: string }): void
export function init(options: {
  publicKey: string
  token?: string
  path?: string
}): void
export function init(options: DeploySlashInitOptions): void {
  if (client !== undefined) throw new Error('Already initialized')
  if (options.env === true) {
    options.publicKey = Deno.env.get('PUBLIC_KEY')
    options.token = Deno.env.get('TOKEN')
  }

  if (options.publicKey === undefined)
    throw new Error('Public Key not provided')

  client = new InteractionsClient({
    token: options.token,
    publicKey: options.publicKey
  })

  commands = client.commands

  const requestHandler = async (request: Request): Promise<Response> => {
    if (options.path !== undefined) {
      if (new URL(request.url).pathname !== options.path)
        return new Response('Bad Request', {
          status: 400
        })
    }
    try {
      const interaction = await client.verifyFetchEvent({
        request,
        respondWith: (res: Response) => {
          return res
        }
      })
      if (!interaction) {
        // ... unauthorized
        return new Response('Not Authorized', {
          status: 400
        })
      }
      if (interaction.type === InteractionType.PING) {
        await interaction.respond({ type: InteractionResponseType.PONG })
        await client.emit('ping')
      }

      await client._process(interaction)
      return new Response('Error', {
        status: 500
      })
    } catch (e) {
      client.emit('interactionError', e as Error)
      return new Response('Error', {
        status: 500
      })
    }
  }
  Deno.serve(requestHandler)
}

/**
 * Register Slash Command handler.
 *
 * Example:
 *
 * ```ts
 * handle("ping", (interaction) => {
 *   interaction.reply("Pong!")
 * })
 * ```
 *
 * Also supports Sub Command and Group handling out of the box!
 * ```ts
 * handle("command-name group-name sub-command", (i) => {
 *   // ...
 * })
 *
 * handle("command-name sub-command", (i) => {
 *   // ...
 * })
 * ```
 *
 * @param cmd Command to handle. Either Handler object or command name followed by handler function in next parameter.
 * @param handler Handler function (required if previous argument was command name)
 */
export function handle(
  cmd: string,
  handler: ApplicationCommandHandlerCallback
): void
export function handle(cmd: ApplicationCommandHandler): void
export function handle(
  cmd: string,
  handler: ApplicationCommandHandlerCallback,
  type: ApplicationCommandType | keyof typeof ApplicationCommandType
): void
export function handle(
  cmd: string | ApplicationCommandHandler,
  handler?: ApplicationCommandHandlerCallback,
  type?: ApplicationCommandType | keyof typeof ApplicationCommandType
): void {
  if (client === undefined)
    throw new Error('Interaction Client not initialized. Call `init` first')

  if (
    typeof cmd === 'string' &&
    typeof handler === 'function' &&
    typeof type !== 'undefined'
  ) {
    client.handle(cmd, handler, type)
  } else if (typeof cmd === 'string' && typeof handler === 'function') {
    client.handle(cmd, handler)
  } else if (typeof cmd === 'object') {
    client.handle(cmd)
  } else throw new Error('Invalid overload for `handle` function')
}

export function autocomplete(
  cmd: string,
  option: string,
  callback: AutocompleteHandlerCallback
): void {
  client.autocomplete(cmd, option, callback)
}

/** Listen for Interactions Event */
export function interactions(
  requestHandler: (i: Interaction) => Promise<Response>
): void {
  client.on('interaction', requestHandler)
}

export { commands, client }
export * from './src/types/applicationCommand.ts'
export * from './src/types/interactions.ts'
export * from './src/structures/applicationCommand.ts'
export * from './src/interactions/mod.ts'
export * from './src/types/channel.ts'
export * from './src/structures/interactions.ts'
export * from './src/structures/message.ts'
export * from './src/structures/embed.ts'
export * from './src/types/messageComponents.ts'
