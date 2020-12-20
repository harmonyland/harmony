import { Guild } from '../structures/guild.ts'
import { Interaction } from '../structures/slash.ts'
import {
  APPLICATION_COMMAND,
  APPLICATION_COMMANDS,
  APPLICATION_GUILD_COMMAND,
  APPLICATION_GUILD_COMMANDS
} from '../types/endpoint.ts'
import {
  InteractionType,
  SlashCommandOption,
  SlashCommandPartial,
  SlashCommandPayload
} from '../types/slash.ts'
import { Collection } from '../utils/collection.ts'
import { Client } from './client.ts'
import { RESTManager } from './rest.ts'

export class SlashCommand {
  slash: SlashCommandsManager
  id: string
  applicationID: string
  name: string
  description: string
  options: SlashCommandOption[]
  _guild?: string

  constructor(manager: SlashCommandsManager, data: SlashCommandPayload) {
    this.slash = manager
    this.id = data.id
    this.applicationID = data.application_id
    this.name = data.name
    this.description = data.description
    this.options = data.options ?? []
  }

  async delete(): Promise<void> {
    await this.slash.delete(this.id, this._guild)
  }

  async edit(data: SlashCommandPartial): Promise<void> {
    await this.slash.edit(this.id, data, this._guild)
  }
}

export class SlashCommandsManager {
  slash: SlashClient

  get rest(): RESTManager {
    return this.slash.rest
  }

  constructor(client: SlashClient) {
    this.slash = client
  }

  /** Get all Global Slash Commands */
  async all(): Promise<Collection<string, SlashCommand>> {
    const col = new Collection<string, SlashCommand>()

    const res = (await this.rest.get(
      APPLICATION_COMMANDS(this.slash.getID())
    )) as SlashCommandPayload[]
    if (!Array.isArray(res)) return col

    for (const raw of res) {
      const cmd = new SlashCommand(this, raw)
      col.set(raw.id, cmd)
    }

    return col
  }

  /** Get a Guild's Slash Commands */
  async guild(
    guild: Guild | string
  ): Promise<Collection<string, SlashCommand>> {
    const col = new Collection<string, SlashCommand>()

    const res = (await this.rest.get(
      APPLICATION_GUILD_COMMANDS(
        this.slash.getID(),
        typeof guild === 'string' ? guild : guild.id
      )
    )) as SlashCommandPayload[]
    if (!Array.isArray(res)) return col

    for (const raw of res) {
      const cmd = new SlashCommand(this, raw)
      cmd._guild = typeof guild === 'string' ? guild : guild.id
      col.set(raw.id, cmd)
    }

    return col
  }

  /** Create a Slash Command (global or Guild) */
  async create(
    data: SlashCommandPartial,
    guild?: Guild | string
  ): Promise<SlashCommand> {
    const payload = await this.rest.post(
      guild === undefined
        ? APPLICATION_COMMANDS(this.slash.getID())
        : APPLICATION_GUILD_COMMANDS(
            this.slash.getID(),
            typeof guild === 'string' ? guild : guild.id
          ),
      data
    )

    const cmd = new SlashCommand(this, payload)
    cmd._guild =
      typeof guild === 'string' || guild === undefined ? guild : guild.id

    return cmd
  }

  /** Edit a Slash Command (global or Guild) */
  async edit(
    id: string,
    data: SlashCommandPartial,
    guild?: Guild | string
  ): Promise<SlashCommandsManager> {
    await this.rest.patch(
      guild === undefined
        ? APPLICATION_COMMAND(this.slash.getID(), id)
        : APPLICATION_GUILD_COMMAND(
            this.slash.getID(),
            typeof guild === 'string' ? guild : guild.id,
            id
          ),
      data
    )
    return this
  }

  /** Delete a Slash Command (global or Guild) */
  async delete(
    id: string,
    guild?: Guild | string
  ): Promise<SlashCommandsManager> {
    await this.rest.delete(
      guild === undefined
        ? APPLICATION_COMMAND(this.slash.getID(), id)
        : APPLICATION_GUILD_COMMAND(
            this.slash.getID(),
            typeof guild === 'string' ? guild : guild.id,
            id
          )
    )
    return this
  }

  /** Get a Slash Command (global or Guild) */
  async get(id: string, guild?: Guild | string): Promise<SlashCommand> {
    const data = await this.rest.get(
      guild === undefined
        ? APPLICATION_COMMAND(this.slash.getID(), id)
        : APPLICATION_GUILD_COMMAND(
            this.slash.getID(),
            typeof guild === 'string' ? guild : guild.id,
            id
          )
    )
    return new SlashCommand(this, data)
  }
}

export type SlashCommandHandlerCallback = (interaction: Interaction) => any
export interface SlashCommandHandler {
  name: string
  guild?: string
  parent?: string
  group?: string
  handler: SlashCommandHandlerCallback
}

export interface SlashOptions {
  id?: string | (() => string)
  client?: Client
  enabled?: boolean
  token?: string
  rest?: RESTManager
}

export class SlashClient {
  id: string | (() => string)
  client?: Client
  token?: string
  enabled: boolean = true
  commands: SlashCommandsManager
  handlers: SlashCommandHandler[] = []
  rest: RESTManager

  constructor(options: SlashOptions) {
    let id = options.id
    if (options.token !== undefined) id = atob(options.token?.split('.')[0])
    if (id === undefined)
      throw new Error('ID could not be found. Pass at least client or token')
    this.id = id
    this.client = options.client
    this.token = options.token
    this.commands = new SlashCommandsManager(this)

    if (options !== undefined) {
      this.enabled = options.enabled ?? true
    }

    if (this.client?._decoratedSlash !== undefined) {
      this.client._decoratedSlash.forEach((e) => {
        this.handlers.push(e)
      })
    }

    this.rest =
      options.client === undefined
        ? options.rest === undefined
          ? new RESTManager({
              token: this.token
            })
          : options.rest
        : options.client.rest

    this.client?.on('interactionCreate', (interaction) =>
      this._process(interaction)
    )
  }

  getID(): string {
    return typeof this.id === 'string' ? this.id : this.id()
  }

  /** Adds a new Slash Command Handler */
  handle(handler: SlashCommandHandler): SlashClient {
    this.handlers.push(handler)
    return this
  }

  private _getCommand(i: Interaction): SlashCommandHandler | undefined {
    return this.handlers.find((e) => {
      const hasGroupOrParent = e.group !== undefined || e.parent !== undefined
      const groupMatched =
        e.group !== undefined && e.parent !== undefined
          ? i.options
              .find((o) => o.name === e.group)
              ?.options?.find((o) => o.name === e.name) !== undefined
          : true
      const subMatched =
        e.group === undefined && e.parent !== undefined
          ? i.options.find((o) => o.name === e.name) !== undefined
          : true
      const nameMatched1 = e.name === i.name
      const parentMatched = hasGroupOrParent ? e.parent === i.name : true
      const nameMatched = hasGroupOrParent ? parentMatched : nameMatched1

      const matched = groupMatched && subMatched && nameMatched
      return matched
    })
  }

  /** Process an incoming Slash Command (interaction) */
  private _process(interaction: Interaction): void {
    if (!this.enabled) return

    if (interaction.type !== InteractionType.APPLICATION_COMMAND) return

    const cmd = this._getCommand(interaction)

    if (cmd === undefined) return

    cmd.handler(interaction)
  }
}
