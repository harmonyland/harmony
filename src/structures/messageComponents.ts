import {
  ButtonStyle,
  InteractionMessageComponentData,
  MessageComponentData,
  MessageComponentType,
  ButtonComponent,
  SelectComponent,
  TextInputComponent
} from '../types/messageComponents.ts'
import { Interaction, InteractionMessageOptions } from './interactions.ts'
import type { Client } from '../client/mod.ts'
import {
  InteractionPayload,
  InteractionResponseType
} from '../types/interactions.ts'
import type { Guild } from './guild.ts'
import type { GuildTextChannel } from './guildTextChannel.ts'
import type { Member } from './member.ts'
import type { TextChannel } from './textChannel.ts'
import { User } from './user.ts'
import { Message } from './message.ts'

export class MessageComponents extends Array<MessageComponentData> {
  row(cb: (builder: MessageComponents) => unknown): this {
    const components = new MessageComponents()
    cb(components)
    this.push({
      type: MessageComponentType.ACTION_ROW,
      components: this as MessageComponentData[]
    })
    return this
  }

  button(options: Omit<ButtonComponent, 'type'>): this {
    if (options.style !== ButtonStyle.LINK && options.customID === undefined)
      throw new Error('customID is required for non-link buttons')
    if (options.style === ButtonStyle.LINK && options.url === undefined)
      throw new Error('url is required for link buttons')

    this.push({
      type: MessageComponentType.BUTTON,
      ...options
    })

    return this
  }

  select(options: Omit<SelectComponent, 'type'>): this {
    this.push({
      type: MessageComponentType.SELECT,
      ...options
    })

    return this
  }

  textInput(options: Omit<TextInputComponent, 'type'>): this {
    this.push({
      type: MessageComponentType.TEXT_INPUT,
      ...options
    })

    return this
  }
}

export class MessageComponentInteraction extends Interaction {
  data: InteractionMessageComponentData
  declare message: Message
  declare locale: string
  declare guildLocale: string

  constructor(
    client: Client,
    data: InteractionPayload,
    others: {
      channel?: TextChannel | GuildTextChannel
      guild?: Guild
      member?: Member
      user: User
      message?: Message
    }
  ) {
    super(client, data, others)
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    this.data = data.data as InteractionMessageComponentData
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    this.message = others.message!
  }

  get customID(): string {
    return this.data.custom_id
  }

  get componentType(): MessageComponentType {
    return this.data.component_type
  }

  get values(): string[] {
    return this.data.values ?? []
  }

  /** Respond with DEFERRED_MESSAGE_UPDATE */
  async deferredMessageUpdate(): Promise<void> {
    await this.respond({
      type: InteractionResponseType.DEFERRED_MESSAGE_UPDATE
    })
  }

  /** Respond with UPDATE_MESSAGE */
  async updateMessage(
    options: Partial<InteractionMessageOptions>
  ): Promise<void> {
    await this.respond({
      type: InteractionResponseType.UPDATE_MESSAGE,
      ...options
    })
  }
}
