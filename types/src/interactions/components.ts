import { ChannelType } from "../channels/base.ts";
import { snowflake } from "../common.ts";
import { EmojiPayload } from "../emojis/emoij.ts";

export interface ComponentPayload {
  type: ComponentType;
}

export enum ComponentType {
  ACTION_ROW = 1,
  BUTTON = 2,
  STRING_SELECT = 3,
  TEXT_INPUT = 4,
  USER_SELECT = 5,
  ROLE_SELECT = 6,
  MENTIONABLE_SELECT = 7,
  CHANNEL_SELECT = 8,
}

export interface ButtonComponentPayload extends ComponentPayload {
  type: ComponentType.BUTTON;
  custom_id?: string;
  disabled?: boolean;
  style: ButtonStylesType;
  label?: string;
  emoji?: EmojiPayload;
  url?: string;
}

export interface SelectMenusComponentPayload extends ComponentPayload {
  type:
    | ComponentType.STRING_SELECT
    | ComponentType.USER_SELECT
    | ComponentType.ROLE_SELECT
    | ComponentType.MENTIONABLE_SELECT
    | ComponentType.CHANNEL_SELECT;
  custom_id: string;
  options?: SelectOptionsPayload;
  channel_types?: ChannelType[];
  placeholder?: string;
  default_values?: SelectDefaultValuePayload[];
  min_values?: number;
  max_values?: number;
  disabled?: boolean;
}

export interface ActionRowsComponentPayload extends ComponentPayload {
  type: ComponentType.ACTION_ROW;
  components?: ComponentPayload[];
}

export interface TextInputComponentPayload extends ComponentPayload {
  type: ComponentType.TEXT_INPUT;
  custom_id: string;
  style: TextInputStyles;
  label: string;
  min_length?: number;
  max_length?: number;
  required?: boolean;
  value?: string;
  placeholder?: string;
}

export enum TextInputStyles {
  SHORT = 1,
  PARAGRAPH = 2,
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

export interface SelectDefaultValuePayload {
  id: snowflake;
  type: "user" | "role" | "channel";
}
