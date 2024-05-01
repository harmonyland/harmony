import { ApplicationIntegrationType } from "../applications/application.ts";
import { ChannelPayload } from "../channels/base.ts";
import { EmbedPayload } from "../channels/embed.ts";
import { AllowedMentionsPayload } from "../channels/etc.ts";
import { AttachmentPayload, MessagePayload } from "../channels/message.ts";
import { snowflake } from "../common.ts";
import { EntitlementPayload } from "../entitlements/entitlements.ts";
import { Locales } from "../etc/locales.ts";
import { GuildMemberPayload } from "../guilds/member.ts";
import { RolePayload } from "../guilds/role.ts";
import { PollCreateRequestPayload } from "../poll/poll.ts";
import { UserPayload } from "../users/user.ts";
import {
  ApplicationCommandContextType,
  ApplicationCommandInteractionDataOptionPayload,
  ApplicationCommandOptionChoicePayload,
  ApplicationCommandType,
} from "./command.ts";
import {
  ComponentPayload,
  ComponentType,
  SelectOptionsPayload,
} from "./components.ts";

export interface InteractionPayload {
  id: snowflake;
  application_id: snowflake;
  type: InteractionType;
  data?:
    | ApplicationCommandInteractionDataPayload
    | ComponentInteractionDataPayload
    | ModalSubmitDataPayload
    | ResolvedDataPayload;
  guild_id?: snowflake;
  channel?: ChannelPayload;
  channel_id?: snowflake;
  member?: GuildMemberPayload;
  user?: UserPayload;
  token: string;
  version: 1;
  message?: MessagePayload;
  app_permissions?: string;
  locale?: Locales;
  guild_locale?: Locales;
  entitlements: EntitlementPayload[];
  authorizing_integration_owners: Record<ApplicationIntegrationType, string>;
  context: ApplicationCommandContextType;
}

export enum InteractionType {
  PING = 1,
  APPLICATION_COMMAND = 2,
  MESSAGE_COMPONENT = 3,
  APPLICATION_COMMAND_AUTOCOMPLETE = 4,
  MODAL_SUBMIT = 5,
}

export interface ApplicationCommandInteractionDataPayload {
  id: snowflake;
  name: string;
  type: ApplicationCommandType;
  resolved?: ResolvedDataPayload;
  options?: ApplicationCommandInteractionDataOptionPayload[];
  guild_id?: snowflake;
  target_id?: snowflake;
}

export interface ComponentInteractionDataPayload {
  custom_id?: string;
  component_type?: ComponentType;
  values?: SelectOptionsPayload[];
  resolved?: ResolvedDataPayload;
}

export interface ModalSubmitDataPayload {
  custom_id?: string;
  components?: ComponentPayload[];
}

export interface ResolvedDataPayload {
  users?: Record<snowflake, UserPayload>;
  members?: Record<snowflake, GuildMemberPayload>;
  roles?: Record<snowflake, RolePayload>;
  channels?: Record<snowflake, ChannelPayload>;
  messages?: Record<snowflake, MessagePayload>;
  attachments?: Record<snowflake, AttachmentPayload>;
}

export interface MessageInteractionPayload {
  id: snowflake;
  type: InteractionType;
  name: string;
  user: UserPayload;
  member?: GuildMemberPayload;
}

export interface InteractionResponsePayload {
  type: InteractionCallbackType;
  data?:
    | MessageInteractionCallbackData
    | AutocompleteInteractionCallbackData
    | ModalInteractionCallbackPayload;
}

export enum InteractionCallbackType {
  PONG = 1,
  CHANNEL_MESSAGE_WITH_SOURCE = 4,
  DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE = 5,
  DEFERRED_UPDATE_MESSAGE = 6,
  UPDATE_MESSAGE = 7,
  APPLICATION_COMMAND_AUTOCOMPLETE_RESULT = 8,
  MODAL = 9,
  PREMIUM_REQUIRED = 100,
}

export interface MessageInteractionCallbackData {
  tts?: boolean;
  content?: string;
  embeds?: EmbedPayload[];
  allowed_mentions?: AllowedMentionsPayload;
  flags?: number;
  components?: ComponentPayload[];
  attachments?: AttachmentPayload[];
  poll?: PollCreateRequestPayload;
}

export interface AutocompleteInteractionCallbackData {
  choices: ApplicationCommandOptionChoicePayload[];
}

export interface ModalInteractionCallbackPayload {
  custom_id: string;
  title: string;
  components: ComponentPayload[];
}
