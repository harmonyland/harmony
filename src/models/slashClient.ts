import { Guild } from '../structures/guild.ts'
import { Interaction } from '../structures/slash.ts'
import {
  APPLICATION_COMMAND,
  APPLICATION_COMMANDS,
  APPLICATION_GUILD_COMMAND,
  APPLICATION_GUILD_COMMANDS
} from '../types/endpoint.ts'
import {
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
  id: string
  applicationID: string
  name: string
  description: string
  options: SlashCommandOption[]

  constructor(data: SlashCommandPayload) {
    this.id = data.id
    this.applicationID = data.application_id
    this.name = data.name
    this.description = data.description
    this.options = data.options
  }
}

export class SlashCommands {
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
      col.set(raw.id, new SlashCommand(raw))
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
      col.set(raw.id, new SlashCommand(raw))
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

    return new SlashCommand(payload)
  }

  async edit(
    id: string,
    data: SlashCommandPayload,
    guild?: Guild
  ): Promise<SlashCommands> {
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
}

export class SlashClient {
  client: Client
  enabled: boolean = true
  commands: SlashCommands

  constructor(client: Client, options?: SlashOptions) {
    this.client = client
    this.commands = new SlashCommands(client)

    if (options !== undefined) {
      this.enabled = options.enabled ?? true
    }

    this.client.on('interactionCreate', (interaction) =>
      this.process(interaction)
    )
  }

  process(interaction: Interaction): any {}

  handle(fn: (interaction: Interaction) => any): SlashClient {
    this.process = fn
    return this
  }
}
