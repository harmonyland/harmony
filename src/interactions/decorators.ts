import {
  ApplicationCommandHandler,
  ApplicationCommandHandlerCallback,
  AutocompleteHandler,
  AutocompleteHandlerCallback,
  InteractionsClient
} from './client.ts'
import type { Client } from '../client/mod.ts'
import { ApplicationCommandsModule } from './commandModule.ts'
import { ApplicationCommandInteraction } from '../structures/applicationCommand.ts'
import { GatewayIntents } from '../types/gateway.ts'
import { ApplicationCommandType } from '../types/applicationCommand.ts'

/**  Type extension that adds the `_decoratedAppCmd` list. */
interface DecoratedAppExt {
  _decoratedAppCmd?: ApplicationCommandHandler[]
  _decoratedAutocomplete?: AutocompleteHandler[]
}

// Maybe a better name for this would be `ApplicationCommandBase` or `ApplicationCommandObject` or something else
type ApplicationCommandClient =
  | Client
  | InteractionsClient
  | ApplicationCommandsModule

// See above
type ApplicationCommandClientExt = ApplicationCommandClient & DecoratedAppExt

type CommandValidationCondition = (
  i: ApplicationCommandInteraction
) => boolean | Promise<boolean>

interface CommandValidation {
  condition: CommandValidationCondition
  action?: string | ApplicationCommandHandlerCallback
}

type ApplicationCommandDecorator = (
  client: ApplicationCommandClientExt,
  prop: string,
  desc: TypedPropertyDescriptor<ApplicationCommandHandlerCallback>
) => void

type AutocompleteDecorator = (
  client: ApplicationCommandClientExt,
  prop: string,
  desc: TypedPropertyDescriptor<AutocompleteHandlerCallback>
) => void

/**
 * Wraps the command handler with a validation function.
 * @param desc property descriptor
 * @param validation validation function and action to show or call if validation fails
 * @returns wrapped function
 */
function wrapConditionApplicationCommandHandler(
  desc: TypedPropertyDescriptor<ApplicationCommandHandlerCallback>,
  validation: CommandValidation
): ApplicationCommandHandlerCallback {
  if (typeof desc.value !== 'function') {
    throw new Error('The decorator requires a function')
  }
  const { condition, action } = validation

  const original = desc.value
  return async function (
    this: ApplicationCommandClient,
    i: ApplicationCommandInteraction
  ) {
    if (!(await condition(i))) {
      // condition not met
      if (typeof action === 'string') {
        i.reply(action)
      } else if (typeof action === 'function') {
        action(i)
      }
      return
    } // condition met
    return original.call(this, i)
  }
}

/**
 * Decorator to add a autocomplete interaction handler.
 *
 * Example:
 * ```ts
 * class MyClient extends Client {
 *   // ...
 *
 *   @autocomplete("search", "query")
 *   searchCompletions(i: AutocompleteInteraction) {
 *     // ...
 *   }
 * }
 * ```
 *
 * @param command Command name of which options' to provide autocompletions for. Can be `*` (all).
 * @param option Option name to handle autocompletions for. Can be `*` (all).
 */
export function autocomplete(
  command: string,
  option: string
): AutocompleteDecorator {
  return function (
    client: ApplicationCommandClientExt,
    _prop: string,
    desc: TypedPropertyDescriptor<AutocompleteHandlerCallback>
  ) {
    if (client._decoratedAutocomplete === undefined)
      client._decoratedAutocomplete = []
    if (typeof desc.value !== 'function') {
      throw new Error('@autocomplete decorator requires a function')
    } else
      client._decoratedAutocomplete.push({
        cmd: command,
        option,
        handler: desc.value
      })
  }
}

/**
 * Decorator to create a Slash Command handler.
 *
 * Example:
 * ```ts
 * class MyClient extends Client {
 *   // ...
 *
 *   @slash("my-command")
 *   myCommand(i: ApplicationCommandInteraction) {
 *     return i.reply("Hello, World!");
 *   }
 * }
 * ```
 *
 * Note that the name parameter is optional in this decorator,
 * it can also be inferred from the method name you define and
 * use decorator on.
 *
 * If you want to split these decorators into different
 * files, you can use these in classes extending
 * `ApplicationCommandsModule` and then use
 * `client.interactions.loadModule`.
 *
 * For handling sub-commands or grouped sub-commands, look
 * into docs for `subslash` and `groupslash`.
 */
export function slash(
  name?: string,
  guild?: string
): ApplicationCommandDecorator {
  return function (
    client: ApplicationCommandClientExt,
    prop: string,
    desc: TypedPropertyDescriptor<ApplicationCommandHandlerCallback>
  ) {
    if (client._decoratedAppCmd === undefined) client._decoratedAppCmd = []
    if (typeof desc.value !== 'function') {
      throw new Error('@slash decorator requires a function')
    } else
      client._decoratedAppCmd.push({
        name: name ?? prop,
        guild,
        handler: desc.value
      })
  }
}

/**
 * Decorator to create a Sub-Command Command handler for a
 * Slash Command.
 *
 * Example:
 * ```ts
 * class MyClient extends Client {
 *   // ...
 *
 *   @subslash("config", "reset")
 *   configReset(i: ApplicationCommandInteraction) {
 *     // ...
 *   }
 * }
 * ```
 *
 * Note that only first argument that is `parent` is required,
 * second can be inferred from the method name you define
 * and use decorator on.
 *
 * For more info on Slash Command handler decorators, look
 * into docs for `slash` decorator.
 */
export function subslash(
  parent: string,
  name?: string,
  guild?: string
): ApplicationCommandDecorator {
  return function (
    client: ApplicationCommandClientExt,
    prop: string,
    desc: TypedPropertyDescriptor<ApplicationCommandHandlerCallback>
  ) {
    if (client._decoratedAppCmd === undefined) client._decoratedAppCmd = []
    if (typeof desc.value !== 'function') {
      throw new Error('@subslash decorator requires a function')
    } else
      client._decoratedAppCmd.push({
        parent,
        name: name ?? prop,
        guild,
        handler: desc.value
      })
  }
}

/**
 * Decorator to create a Grouped Sub-Command Command handler
 * for a Slash Command.
 *
 * Example:
 * ```ts
 * class MyClient extends Client {
 *   // ...
 *
 *   @groupslash("config", "options", "set")
 *   configOptionsSet(i: ApplicationCommandInteraction) {
 *     // ...
 *   }
 * }
 * ```
 *
 * Note that only first two arguments i.e. `group` & `parent` are
 * required, name can be inferred from the method name you define
 * and use decorator on.
 *
 * For more info on Slash Command handler decorators, look
 * into docs for `slash` decorator.
 */
export function groupslash(
  parent: string,
  group: string,
  name?: string,
  guild?: string
): ApplicationCommandDecorator {
  return function (
    client: ApplicationCommandClientExt,
    prop: string,
    desc: TypedPropertyDescriptor<ApplicationCommandHandlerCallback>
  ) {
    if (client._decoratedAppCmd === undefined) client._decoratedAppCmd = []
    if (typeof desc.value !== 'function') {
      throw new Error('@groupslash decorator requires a function')
    } else
      client._decoratedAppCmd.push({
        group,
        parent,
        name: name ?? prop,
        guild,
        handler: desc.value
      })
  }
}

/**
 * Decorator to create a Message Context Menu Command handler.
 *
 * Example:
 * ```ts
 * class MyClient extends Client {
 *   // ...
 *
 *   @messageContextMenu("Content Length")
 *   contentLength(i: ApplicationCommandInteraction) {
 *     return i.reply({
 *       content: `Length: ${i.targetMessage!.content.length}`,
 *       ephemeral: true,
 *     });
 *   }
 * }
 * ```
 *
 * If you want to split these decorators into different
 * files, you can use these in classes extending
 * `ApplicationCommandsModule` and then use
 * `client.interactions.loadModule`.
 *
 * For handling user context menu commands, look into docs for
 * `userContextMenu` decorator.
 */
export function messageContextMenu(name?: string): ApplicationCommandDecorator {
  return function (
    client: ApplicationCommandClientExt,
    prop: string,
    desc: TypedPropertyDescriptor<ApplicationCommandHandlerCallback>
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    if (client._decoratedAppCmd === undefined) client._decoratedAppCmd = []
    if (typeof desc.value !== 'function') {
      throw new Error('@messageContextMenu decorator requires a function')
    } else
      client._decoratedAppCmd.push({
        name: name ?? prop,
        type: ApplicationCommandType.MESSAGE,
        handler: desc.value
      })
  }
}

/**
 * Decorator to create a User Context Menu Command handler.
 *
 * Example:
 * ```ts
 * class MyClient extends Client {
 *   // ...
 *
 *   @userContextMenu("Command Name")
 *   commandName(i: ApplicationCommandInteraction) {
 *     // ...
 *   }
 * }
 * ```
 *
 * First argument that is `name` is optional and can be
 * inferred from method name.
 *
 * For handling more docs regarding how context menu command
 * decorators work, look into `messageContextMenu`'s docs.
 */
export function userContextMenu(name?: string): ApplicationCommandDecorator {
  return function (
    client: ApplicationCommandClientExt,
    prop: string,
    desc: TypedPropertyDescriptor<ApplicationCommandHandlerCallback>
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    if (client._decoratedAppCmd === undefined) client._decoratedAppCmd = []
    if (typeof desc.value !== 'function') {
      throw new Error('@userContextMenu decorator requires a function')
    } else
      client._decoratedAppCmd.push({
        name: name ?? prop,
        type: ApplicationCommandType.USER,
        handler: desc.value
      })
  }
}

/**
 * The command can only be called from a guild.
 * @param action message or function called when the condition is not met
 * @returns wrapped function
 */
export function isInGuild(message: string): ApplicationCommandDecorator
export function isInGuild(
  callback: ApplicationCommandHandlerCallback
): ApplicationCommandDecorator
export function isInGuild(
  action: string | ApplicationCommandHandlerCallback
): ApplicationCommandDecorator {
  return function (
    _client: ApplicationCommandClient,
    _prop: string,
    desc: TypedPropertyDescriptor<ApplicationCommandHandlerCallback>
  ) {
    const validation: CommandValidation = {
      condition: (i: ApplicationCommandInteraction) => {
        return Boolean(i.guild)
      },
      action
    }
    desc.value = wrapConditionApplicationCommandHandler(desc, validation)
  }
}

/**
 * The command can only be called if the bot is currently in a voice channel.
 * `GatewayIntents.GUILD_VOICE_STATES` needs to be set.
 * @param action message or function called when the condition is not met
 * @returns wrapped function
 */
export function isBotInVoiceChannel(
  message: string
): ApplicationCommandDecorator
export function isBotInVoiceChannel(
  callback: ApplicationCommandHandlerCallback
): ApplicationCommandDecorator
export function isBotInVoiceChannel(
  action: string | ApplicationCommandHandlerCallback
): ApplicationCommandDecorator {
  return function (
    _client: ApplicationCommandClient,
    _prop: string,
    desc: TypedPropertyDescriptor<ApplicationCommandHandlerCallback>
  ) {
    const validation: CommandValidation = {
      condition: async (i: ApplicationCommandInteraction) => {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (!i.client.intents?.includes(GatewayIntents.GUILD_VOICE_STATES)) {
          const err =
            '@isBotInVoiceChannel: GatewayIntents.GUILD_VOICE_STATES needs to be set.'
          console.error(err)
          throw new Error(err)
        }
        return Boolean(await i.guild?.voiceStates.get(i.client.user!.id))
      },
      action
    }
    desc.value = wrapConditionApplicationCommandHandler(desc, validation)
  }
}

/**
 * The command can only be called if the user is currently in a voice channel.
 * `GatewayIntents.GUILD_VOICE_STATES` needs to be set.
 * @param action message or function called when the condition is not met
 * @returns wrapped function
 */
export function isUserInVoiceChannel(
  message: string
): ApplicationCommandDecorator
export function isUserInVoiceChannel(
  callback: ApplicationCommandHandlerCallback
): ApplicationCommandDecorator
export function isUserInVoiceChannel(
  action: string | ApplicationCommandHandlerCallback
): ApplicationCommandDecorator {
  return function (
    _client: ApplicationCommandClient,
    _prop: string,
    desc: TypedPropertyDescriptor<ApplicationCommandHandlerCallback>
  ) {
    const validation: CommandValidation = {
      condition: async (i: ApplicationCommandInteraction): Promise<boolean> => {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (!i.client.intents?.includes(GatewayIntents.GUILD_VOICE_STATES)) {
          const err =
            '@isUserInVoiceChannel: GatewayIntents.GUILD_VOICE_STATES needs to be set.'
          console.error(err)
          throw new Error(err)
        }
        return Boolean(await i.guild?.voiceStates.get(i.user.id))
      },
      action
    }
    desc.value = wrapConditionApplicationCommandHandler(desc, validation)
  }
}

/**
 * Cusomizable command validation.
 * @param condition condition that need to succede for the command to be called
 * @param action message or function called when the condition is not met
 * @returns wrapped function
 */
export function customValidation(
  condition: CommandValidationCondition,
  message: string
): ApplicationCommandDecorator
export function customValidation(
  condition: CommandValidationCondition,
  callback: ApplicationCommandHandlerCallback
): ApplicationCommandDecorator
export function customValidation(
  condition: CommandValidationCondition,
  action: string | ApplicationCommandHandlerCallback
): ApplicationCommandDecorator {
  return function (
    _client: ApplicationCommandClient,
    _prop: string,
    desc: TypedPropertyDescriptor<ApplicationCommandHandlerCallback>
  ) {
    desc.value = wrapConditionApplicationCommandHandler(desc, {
      condition,
      action
    })
  }
}
