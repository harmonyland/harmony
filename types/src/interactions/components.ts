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
  custom_id?: string;
  disabled?: boolean;
  emoji?: EmojiPayload;
  label?: string;
  style: ButtonStylesType;
  type: ComponentType.BUTTON;
  url?: string;
}

export interface SelectMenusComponentPayload extends ComponentPayload {
  channel_types?: ChannelType[];
  custom_id: string;
  default_values?: SelectDefaultValuePayload[];
  disabled?: boolean;
  max_values?: number;
  min_values?: number;
  options?: SelectOptionsPayload;
  placeholder?: string;
  type:
    | ComponentType.CHANNEL_SELECT
    | ComponentType.MENTIONABLE_SELECT
    | ComponentType.ROLE_SELECT
    | ComponentType.STRING_SELECT
    | ComponentType.USER_SELECT;
}

export interface ActionRowsComponentPayload extends ComponentPayload {
  components?: ComponentPayload[];
  type: ComponentType.ACTION_ROW;
}

export interface TextInputComponentPayload extends ComponentPayload {
  custom_id: string;
  label: string;
  max_length?: number;
  min_length?: number;
  placeholder?: string;
  required?: boolean;
  style: TextInputStyles;
  type: ComponentType.TEXT_INPUT;
  value?: string;
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
  default?: boolean;
  descripion?: string;
  emoji?: EmojiPayload;
  label: string;
  value: string;
}

export interface SelectDefaultValuePayload {
  id: snowflake;
  type: "channel" | "role" | "user";
}
