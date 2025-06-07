export enum MessageComponentType {
  /** Container or row of components. Deprecated, use ACTION_ROW instead */
  ActionRow = 1,
  /** A clickable button. Deprecated, use BUTTON instead */
  Button = 2,
  /** Dropdown menu, Deprecated, use SELECT instead */
  Select = 3,

  /** Container or row of components */
  ACTION_ROW = 1,
  /** A clickable button */
  BUTTON = 2,
  /** Dropdown menu with defined text options */
  STRING_SELECT = 3,
  /** Text Input (only for modals) */
  TEXT_INPUT = 4,
  /** Dropdown menu with user options */
  USER_SELECT = 5,
  /** Dropdown menu with role options */
  ROLE_SELECT = 6,
  /** Dropdown menu with user and role options */
  MENTIONABLE_SELECT = 7,
  /** Dropdown menu with channel options */
  CHANNEL_SELECT = 8,
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

export enum TextInputStyle {
  /** Intended for short single-line text. */
  SHORT = 1,
  /** Intended for much longer inputs. */
  PARAGRAPH = 2
}

export interface MessageComponentEmoji {
  id?: string
  name?: string
  animated?: boolean
}

export interface ActionRowComponentPayload {
  type: MessageComponentType.ACTION_ROW
  components: MessageComponentPayload[]
}

export interface ActionRowComponent {
  type: MessageComponentType.ACTION_ROW | 'ACTION_ROW'
  components: MessageComponentData[]
}

export interface ButtonComponentPayload {
  type: MessageComponentType.BUTTON
  label?: string
  style: ButtonStyle
  custom_id?: string
  url?: string
  disabled?: boolean
  emoji?: MessageComponentEmoji
}

export interface ButtonComponent {
  type: MessageComponentType.BUTTON | 'BUTTON'
  label: string
  style: ButtonStyle | keyof typeof ButtonStyle
  customID?: string
  url?: string
  disabled?: boolean
  emoji?: MessageComponentEmoji
}

export interface SelectComponentOption {
  label: string
  value: string
  default?: boolean
  description?: string
  emoji?: MessageComponentEmoji
}

export interface SelectComponentPayload {
  type: MessageComponentType.STRING_SELECT
  custom_id: string
  placeholder?: string
  options: SelectComponentOption[]
  disabled?: boolean
  min_values?: number
  max_values?: number
}

export interface SelectComponent {
  type: MessageComponentType.STRING_SELECT | 'STRING_SELECT'
  customID: string
  placeholder?: string
  options: SelectComponentOption[]
  disabled?: boolean
  minValues?: number
  maxValues?: number
}

export interface TextInputComponentPayload {
  type: MessageComponentType.TEXT_INPUT
  label: string
  custom_id: string
  style: TextInputStyle
  placeholder?: string
  min_length?: number
  max_length?: number
  value?: string
  required?: boolean
}

export interface TextInputComponent {
  type: MessageComponentType.TEXT_INPUT | 'TEXT_INPUT'
  label: string
  customID: string
  style: TextInputStyle | keyof typeof TextInputStyle
  placeholder?: string
  minLength?: number
  maxLength?: number
  value?: string
  required?: boolean
}

export type MessageComponentPayload =
  | ActionRowComponentPayload
  | ButtonComponentPayload
  | SelectComponentPayload
  | TextInputComponentPayload

export type MessageComponentData =
  | ActionRowComponent
  | ButtonComponent
  | SelectComponent
  | TextInputComponent

export interface InteractionMessageComponentData {
  custom_id: string
  component_type: MessageComponentType
  values?: string[]
}

export interface ModalSubmitComponentTextInputData {
  type: MessageComponentType.TEXT_INPUT
  custom_id: string
  value: string
}

export type ModalSubmitComponentDataBase = ModalSubmitComponentTextInputData

export interface ModalSubmitActionRow {
  type: MessageComponentType.ACTION_ROW
  components: ModalSubmitComponentDataBase[]
}

export type ModalSubmitComponentData = ModalSubmitActionRow

export interface InteractionModalSubmitData {
  custom_id: string
  components: ModalSubmitComponentData[]
}
