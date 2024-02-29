import {
  ApplicationCommandHandler,
  ApplicationCommandHandlerCallback,
  AutocompleteHandler,
  AutocompleteHandlerCallback,
  ComponentInteractionCallback,
  InteractionsClient,
  ComponentInteractionHandler
} from './client.ts'
import type { Client } from '../client/mod.ts'
import { ApplicationCommandsModule } from './commandModule.ts'
import { ApplicationCommandInteraction } from '../structures/applicationCommand.ts'
import { GatewayIntents } from '../types/gateway.ts'
import { ApplicationCommandType } from '../types/applicationCommand.ts'
import { MessageComponentInteraction } from '../structures/messageComponents.ts'
import { ModalSubmitInteraction } from '../structures/modalSubmitInteraction.ts'

/**
 * Type extension that adds the `_decoratedAppCmd` list.
 *
 * @deprecated With the new decorator proposal, this is no longer needed. */
interface DecoratedAppExt {
  _decoratedAppCmd?: ApplicationCommandHandler[]
  _decoratedAutocomplete?: AutocompleteHandler[]
  _decoratedComponents?: ComponentInteractionHandler[]
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
  original: ApplicationCommandHandlerCallback,
  ctx: ClassMethodDecoratorContext<ApplicationCommandClientExt>
) => void

type AutocompleteDecorator = (
  original: AutocompleteHandlerCallback,
  ctx: ClassMethodDecoratorContext<ApplicationCommandClientExt>
) => void

type MessageComponentDecorator<T = any> = (
  original: ComponentInteractionCallback<T>,
  ctx: ClassMethodDecoratorContext<ApplicationCommandClientExt>
) => void

/**
 * Wraps the command handler with a validation function.
 * @param desc property descriptor
 * @param validation validation function and action to show or call if validation fails
 * @returns wrapped function
 */
function wrapConditionApplicationCommandHandler(
  original: ApplicationCommandHandlerCallback,
  validation: CommandValidation
): ApplicationCommandHandlerCallback {
  const { condition, action } = validation

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
    original: AutocompleteHandlerCallback,
    {
      addInitializer,
      private: _private
    }: ClassMethodDecoratorContext<ApplicationCommandClientExt>
  ) {
    if (_private === true)
      throw new TypeError('Not supported on private methods.')

    addInitializer(function () {
      const handle: AutocompleteHandler = {
        cmd: command,
        option,
        handler: original.bind(this)
      }

      if (
        handle.cmd.includes(' ') === true &&
        handle.parent === undefined &&
        handle.group === undefined
      ) {
        const parts = handle.cmd.split(/ +/).filter((e) => e !== '')
        if (parts.length > 3 || parts.length < 1) {
          throw new Error('Invalid command name')
        }
        const root = parts.shift() as string
        const group = parts.length === 2 ? parts.shift() : undefined
        const sub = parts.shift()

        handle.cmd = sub ?? root
        handle.group = group
        handle.parent = sub === undefined ? undefined : root
      }

      if (this instanceof InteractionsClient) {
        this.autocompleteHandlers.push(handle)
      } else if (this instanceof ApplicationCommandsModule) {
        this.autocomplete.push(handle)
      } else {
        this.interactions.autocompleteHandlers.push(handle)
      }
    })

    return original
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
    original: ApplicationCommandHandlerCallback,
    {
      name: prop,
      addInitializer,
      private: _private
    }: ClassMethodDecoratorContext<ApplicationCommandClientExt>
  ) {
    if (_private === true)
      throw new TypeError('Not supported on private methods.')

    addInitializer(function () {
      const handler: ApplicationCommandHandler = {
        name: name ?? prop.toString(),
        guild,
        handler: original.bind(this)
      }

      if (this instanceof InteractionsClient) {
        this.handlers.push(handler)
      } else if (this instanceof ApplicationCommandsModule) {
        this.commands.push(handler)
      } else {
        this.interactions.handlers.push(handler)
      }
    })

    return original
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
    original: ApplicationCommandHandlerCallback,
    {
      name: prop,
      addInitializer,
      private: _private
    }: ClassMethodDecoratorContext<ApplicationCommandClientExt>
  ) {
    if (_private === true)
      throw new TypeError('Not supported on private methods.')

    addInitializer(function () {
      const handler: ApplicationCommandHandler = {
        parent,
        name: name ?? prop.toString(),
        guild,
        handler: original.bind(this)
      }

      if (this instanceof InteractionsClient) {
        this.handlers.push(handler)
      } else if (this instanceof ApplicationCommandsModule) {
        this.commands.push(handler)
      } else {
        this.interactions.handlers.push(handler)
      }
    })

    return original
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
    original: ApplicationCommandHandlerCallback,
    {
      name: prop,
      addInitializer,
      private: _private
    }: ClassMethodDecoratorContext<ApplicationCommandClientExt>
  ) {
    if (_private === true)
      throw new TypeError('Not supported on private methods.')

    addInitializer(function () {
      const handler: ApplicationCommandHandler = {
        group,
        parent,
        name: name ?? prop.toString(),
        guild,
        handler: original.bind(this)
      }

      if (this instanceof InteractionsClient) {
        this.handlers.push(handler)
      } else if (this instanceof ApplicationCommandsModule) {
        this.commands.push(handler)
      } else {
        this.interactions.handlers.push(handler)
      }
    })

    return original
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
    original: ApplicationCommandHandlerCallback,
    {
      name: prop,
      addInitializer,
      private: _private
    }: ClassMethodDecoratorContext<ApplicationCommandClientExt>
  ) {
    if (_private === true)
      throw new TypeError('Not supported on private methods.')

    addInitializer(function () {
      const handler: ApplicationCommandHandler = {
        name: name ?? prop.toString(),
        type: ApplicationCommandType.MESSAGE,
        handler: original.bind(this)
      }

      if (this instanceof InteractionsClient) {
        this.handlers.push(handler)
      } else if (this instanceof ApplicationCommandsModule) {
        this.commands.push(handler)
      } else {
        this.interactions.handlers.push(handler)
      }
    })
    return original
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
    original: ApplicationCommandHandlerCallback,
    {
      name: prop,
      addInitializer,
      private: _private
    }: ClassMethodDecoratorContext<ApplicationCommandClientExt>
  ) {
    if (_private === true)
      throw new TypeError('Not supported on private methods.')

    addInitializer(function () {
      const handler: ApplicationCommandHandler = {
        name: name ?? prop.toString(),
        type: ApplicationCommandType.USER,
        handler: original.bind(this)
      }

      if (this instanceof InteractionsClient) {
        this.handlers.push(handler)
      } else if (this instanceof ApplicationCommandsModule) {
        this.commands.push(handler)
      } else {
        this.interactions.handlers.push(handler)
      }
    })
    return original
  }
}

/**
 * Decorator to create a Button message component interaction handler.
 *
 * Example:
 * ```ts
 * class MyClient extends Client {
 *   // ...
 *
 *   @messageComponent("custom_id")
 *   buttonHandler(i: MessageComponentInteraction) {
 *     // ...
 *   }
 * }
 * ```
 *
 * First argument that is `name` is optional and can be
 * inferred from method name.
 */
export function messageComponent(
  customID?: string
): MessageComponentDecorator<MessageComponentInteraction> {
  return function (
    original: ComponentInteractionCallback<MessageComponentInteraction>,
    {
      name: prop,
      addInitializer,
      private: _private
    }: ClassMethodDecoratorContext<ApplicationCommandClientExt>
  ) {
    if (_private === true)
      throw new TypeError('Not supported on private methods.')

    addInitializer(function () {
      const handler: ComponentInteractionHandler<MessageComponentInteraction> =
        {
          customID: customID ?? prop.toString(),
          handler: original.bind(this),
          type: 'button'
        }

      if (this instanceof InteractionsClient) {
        this.componentHandlers.push(handler)
      } else if (this instanceof ApplicationCommandsModule) {
        this.components.push(handler)
      } else {
        this.interactions.componentHandlers.push(handler)
      }
    })
    return original
  }
}

/**
 * Decorator to create a Modal submit interaction handler.
 *
 * Example:
 * ```ts
 * class MyClient extends Client {
 *   // ...
 *
 *   @modalHandler("custom_id")
 *   modalSubmit(i: ModalSubmitInteraction) {
 *     // ...
 *   }
 * }
 * ```
 *
 * First argument that is `name` is optional and can be
 * inferred from method name.
 */
export function modalHandler(
  customID?: string
): MessageComponentDecorator<ModalSubmitInteraction> {
  return function (
    original: ComponentInteractionCallback<ModalSubmitInteraction>,
    {
      name: prop,
      addInitializer,
      private: _private
    }: ClassMethodDecoratorContext<ApplicationCommandClientExt>
  ) {
    if (_private === true)
      throw new TypeError('Not supported on private methods.')

    addInitializer(function () {
      const handler: ComponentInteractionHandler<ModalSubmitInteraction> = {
        customID: customID ?? prop.toString(),
        handler: original.bind(this),
        type: 'modal'
      }

      if (this instanceof InteractionsClient) {
        this.componentHandlers.push(handler)
      } else if (this instanceof ApplicationCommandsModule) {
        this.components.push(handler)
      } else {
        this.interactions.componentHandlers.push(handler)
      }
    })
    return original
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
    original: ApplicationCommandHandlerCallback,
    _ctx: ClassMethodDecoratorContext<ApplicationCommandClientExt>
  ) {
    const validation: CommandValidation = {
      condition: (i: ApplicationCommandInteraction) => {
        return Boolean(i.guild)
      },
      action
    }
    return wrapConditionApplicationCommandHandler(original, validation)
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
    original: ApplicationCommandHandlerCallback,
    _ctx: ClassMethodDecoratorContext<ApplicationCommandClientExt>
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
    return wrapConditionApplicationCommandHandler(original, validation)
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
    original: ApplicationCommandHandlerCallback,
    _ctx: ClassMethodDecoratorContext<ApplicationCommandClientExt>
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
    return wrapConditionApplicationCommandHandler(original, validation)
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
    original: ApplicationCommandHandlerCallback,
    _ctx: ClassMethodDecoratorContext<ApplicationCommandClientExt>
  ) {
    return wrapConditionApplicationCommandHandler(original, {
      condition,
      action
    })
  }
}
