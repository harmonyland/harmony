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

export interface MessageComponentPayload {
  type: MessageComponentType
  components?: MessageComponentPayload[]
  label?: string
  style?: ButtonStyle
  url?: string
  custom_id?: string
}

export interface MessageComponentData {
  type: MessageComponentType
  components?: MessageComponentData[]
  label?: string
  style?: ButtonStyle
  url?: string
  customID?: string
}

export interface InteractionMessageComponentData {
  custom_id: string
  component_type: MessageComponentType
}
