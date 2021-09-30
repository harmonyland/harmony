import {
  ApplicationCommandHandler,
  ApplicationCommandHandlerCallback,
  InteractionsClient
} from './client.ts'
import type { Client } from '../client/mod.ts'
import { ApplicationCommandsModule } from './commandModule.ts'
import { ApplicationCommandInteraction } from '../structures/applicationCommand.ts'
import { GatewayIntents } from '../types/gateway.ts'
import { ApplicationCommandType } from '../../mod.ts'

/**  Type extension that adds the `_decoratedAppCmd` list. */
interface DecoratedAppExt {
  _decoratedAppCmd?: ApplicationCommandHandler[]
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
  _client: ApplicationCommandClientExt,
  _prop: string,
  desc: TypedPropertyDescriptor<ApplicationCommandHandlerCallback>
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

/** Decorator to create a Slash Command handler */
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

/** Decorator to create a Sub-Slash Command handler */
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

/** Decorator to create a Grouped Slash Command handler */
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

/** Decorator to create a Message Context Menu Command handler */
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

/** Decorator to create a User Context Menu Command handler */
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
