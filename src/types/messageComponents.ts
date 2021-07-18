export enum MessageComponentType {
  /** Container or row of components */
  ActionRow = 1,
  /** A clickable button */
  Button = 2,
  /** Dropdown menu */
  Select = 3
}

export enum ButtonStyle {
  PRIMARY = 1,
  SECONDARY = 2,
  SUCCESS = 3,
  DANGER = 4,
  LINK = 5,

  // Aliases
  BLURPLE = 1,
  GREY = 2,
  GREEN = 3,
  RED = 4,
  DESTRUCTIVE = 4
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

export interface MessageComponentBase<
  T1 = MessageComponentType,
  T2 = MessageComponentPayload,
  T3 = ButtonStyle
> {
  type: T1
  components?: T2[]
  label?: string
  style?: T3
  url?: string
  emoji?: MessageComponentEmoji
  disabled?: boolean
  options?: MessageComponentOption[]
  placeholder?: string
}

export interface MessageComponentPayload extends MessageComponentBase {
  custom_id?: string
  min_values?: number
  max_values?: number
}

export interface MessageComponentData
  extends MessageComponentBase<
    keyof typeof MessageComponentType | MessageComponentType,
    MessageComponentData,
    ButtonStyle | keyof typeof ButtonStyle
  > {
  customID?: string
  minValues?: number
  maxValues?: number
}

export interface InteractionMessageComponentData {
  custom_id: string
  component_type: MessageComponentType
  values?: string[]
}
