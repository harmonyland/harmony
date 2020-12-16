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

export interface SlashOptions {
  enabled?: boolean
}

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
    this.options = data.options
  }

  async delete(): Promise<void> {
    await this.slash.delete(this.id, this._guild)
  }

  async edit(data: SlashCommandPartial): Promise<void> {
    await this.slash.edit(this.id, data, this._guild)
  }
}

export class SlashCommandsManager {
  client: Client
  slash: SlashClient

  constructor(client: Client) {
    this.client = client
    this.slash = client.slash
  }

  /** Get all Global Slash Commands */
  async all(): Promise<Collection<string, SlashCommand>> {
    const col = new Collection<string, SlashCommand>()

    const res = (await this.client.rest.get(
      APPLICATION_COMMANDS(this.client.user?.id as string)
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

    const res = (await this.client.rest.get(
      APPLICATION_GUILD_COMMANDS(
        this.client.user?.id as string,
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
    const payload = await this.client.rest.post(
      guild === undefined
        ? APPLICATION_COMMANDS(this.client.user?.id as string)
        : APPLICATION_GUILD_COMMANDS(
            this.client.user?.id as string,
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
    await this.client.rest.patch(
      guild === undefined
        ? APPLICATION_COMMAND(this.client.user?.id as string, id)
        : APPLICATION_GUILD_COMMAND(
            this.client.user?.id as string,
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
    await this.client.rest.delete(
      guild === undefined
        ? APPLICATION_COMMAND(this.client.user?.id as string, id)
        : APPLICATION_GUILD_COMMAND(
            this.client.user?.id as string,
            typeof guild === 'string' ? guild : guild.id,
            id
          )
    )
    return this
  }
}

export type SlashCommandHandlerCallback = (interaction: Interaction) => any
export interface SlashCommandHandler {
  name: string
  guild?: string
  parent?: string
  handler: SlashCommandHandlerCallback
}

export class SlashClient {
  client: Client
  enabled: boolean = true
  commands: SlashCommandsManager
  handlers: SlashCommandHandler[] = []

  constructor(client: Client, options?: SlashOptions) {
    this.client = client
    this.commands = new SlashCommandsManager(client)

    if (options !== undefined) {
      this.enabled = options.enabled ?? true
    }

    if (this.client._decoratedSlash !== undefined) {
      this.client._decoratedSlash.forEach((e) => {
        this.handlers.push(e)
      })
    }

    this.client.on('interactionCreate', (interaction) =>
      this.process(interaction)
    )
  }

  /** Adds a new Slash Command Handler */
  handle(
    name: string,
    handler: SlashCommandHandlerCallback,
    guild?: string
  ): SlashClient {
    this.handlers.push({
      name,
      guild,
      handler
    })
    return this
  }

  /** Process an incoming Slash Command (interaction) */
  private process(interaction: Interaction): void {
    if (!this.enabled) return

    if (interaction.type !== InteractionType.APPLICATION_COMMAND) return

    let cmd

    if (interaction.guild !== undefined)
      cmd =
        this.handlers.find(
          (e) => e.guild !== undefined && e.name === interaction.name
        ) ?? this.handlers.find((e) => e.name === interaction.name)
    else cmd = this.handlers.find((e) => e.name === interaction.name)

    if (cmd === undefined) return

    cmd.handler(interaction)
  }
}
