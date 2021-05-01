export enum MessageComponentType {
  /** Container or row of components */
  ActionRow = 1,
  /** A clickable button */
  Button = 2,
  /** Dropdown menu */
  Select = 3
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
  default?: boolean
  description?: string
  emoji?: MessageComponentEmoji
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
  placeholder?: string
}

export interface MessageComponentPayload
  extends MessageComponentBase<MessageComponentPayload> {
  custom_id?: string
  min_values?: number
  max_values?: number
}

export interface MessageComponentData
  extends MessageComponentBase<MessageComponentData> {
  customID?: string
  minValues?: number
  maxValues?: number
}

export interface InteractionMessageComponentData {
  custom_id: string
  component_type: MessageComponentType
}
