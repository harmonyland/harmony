export enum MessageComponentType {
  ActionRow = 1,
  Button = 2
}

export enum ButtonStyle {
  Primary = 1,
  Secondary = 2,
  Success = 3,
  Destructive = 4,
  Link = 5
}

export interface MessageComponentEmoji {
  id?: string
  name?: string
  animated?: boolean
}

export interface MessageComponentOption {
  label: string
  value: string
}

export interface MessageComponentBase<T> {
  type: MessageComponentType
  components?: T[]
  label?: string
  style?: ButtonStyle
  url?: string
  emoji?: MessageComponentEmoji
  disabled?: boolean
  options?: MessageComponentOption[]
}

export interface MessageComponentPayload
  extends MessageComponentBase<MessageComponentPayload> {
  custom_id?: string
}

export interface MessageComponentData
  extends MessageComponentBase<MessageComponentData> {
  customID?: string
}

export interface InteractionMessageComponentData {
  custom_id: string
  component_type: MessageComponentType
}
