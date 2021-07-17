import {
  ButtonStyle,
  InteractionMessageComponentData,
  MessageComponentData,
  MessageComponentEmoji,
  MessageComponentOption,
  MessageComponentType
} from '../types/messageComponents.ts'
import { Interaction } from './interactions.ts'
import type { Client } from '../client/mod.ts'
import { InteractionPayload } from '../types/interactions.ts'
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
      type: MessageComponentType.ActionRow,
      components
    })
    return this
  }

  button(options: {
    label?: string
    style?: ButtonStyle | keyof typeof ButtonStyle
    url?: string
    emoji?: MessageComponentEmoji
    disabled?: boolean
    customID?: string
  }): this {
    if (options.style !== ButtonStyle.LINK && options.customID === undefined)
      throw new Error('customID is required for non-link buttons')
    if (options.style === ButtonStyle.LINK && options.url === undefined)
      throw new Error('url is required for link buttons')

    this.push({
      type: MessageComponentType.Button,
      ...options
    })

    return this
  }

  select(options: {
    options: MessageComponentOption[]
    placeholder?: string
    customID: string
    minValues?: number
    maxValues?: number
  }): this {
    this.push({
      type: MessageComponentType.Select,
      ...options
    })

    return this
  }
}

export class MessageComponentInteraction extends Interaction {
  data: InteractionMessageComponentData
  declare message: Message

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
}
