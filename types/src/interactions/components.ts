import { EmojiPayload } from "../emojis/emoij.ts";

export interface ComponentPayload {
  type: ComponentType;
}

export enum ComponentType {
  ACTION_ROW = 1,
  BUTTON = 2,
  SELECT_MENU = 3,
}

export interface ButtonComponentPayload extends ComponentPayload {
  type: ComponentType.BUTTON;
  custom_id?: string;
  disabled?: boolean;
  style?: ButtonStylesType;
  label?: string;
  emoji?: EmojiPayload;
  url?: string;
}

export interface SelectMenusComponentPayload extends ComponentPayload {
  type: ComponentType.SELECT_MENU;
  options?: SelectOptionsPayload;
  placeholder?: string;
  min_values?: number;
  max_values?: number;
}

export interface ActionRowsComponentPayload extends ComponentPayload {
  type: ComponentType.ACTION_ROW;
  components?: ComponentPayload[];
}

export enum ButtonStylesType {
  PRIMARY = 1,
  SECONDARY = 2,
  SUCCESS = 3,
  DANGER = 4,
  LINK = 5,
}

export interface SelectOptionsPayload {
  label: string;
  value: string;
  descripion?: string;
  emoji?: EmojiPayload;
  default?: boolean;
}
