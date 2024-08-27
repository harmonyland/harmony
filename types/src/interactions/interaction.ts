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
  app_permissions?: string;
  application_id: snowflake;
  authorizing_integration_owners: Record<ApplicationIntegrationType, string>;
  channel?: ChannelPayload;
  channel_id?: snowflake;
  context: ApplicationCommandContextType;
  data?:
    | ApplicationCommandInteractionDataPayload
    | ComponentInteractionDataPayload
    | ModalSubmitDataPayload
    | ResolvedDataPayload;
  entitlements: EntitlementPayload[];
  guild_id?: snowflake;
  guild_locale?: Locales;
  id: snowflake;
  locale?: Locales;
  member?: GuildMemberPayload;
  message?: MessagePayload;
  token: string;
  type: InteractionType;
  user?: UserPayload;
  version: 1;
}

export enum InteractionType {
  PING = 1,
  APPLICATION_COMMAND = 2,
  MESSAGE_COMPONENT = 3,
  APPLICATION_COMMAND_AUTOCOMPLETE = 4,
  MODAL_SUBMIT = 5,
}

export interface ApplicationCommandInteractionDataPayload {
  guild_id?: snowflake;
  id: snowflake;
  name: string;
  options?: ApplicationCommandInteractionDataOptionPayload[];
  resolved?: ResolvedDataPayload;
  target_id?: snowflake;
  type: ApplicationCommandType;
}

export interface ComponentInteractionDataPayload {
  component_type?: ComponentType;
  custom_id?: string;
  resolved?: ResolvedDataPayload;
  values?: SelectOptionsPayload[];
}

export interface ModalSubmitDataPayload {
  components?: ComponentPayload[];
  custom_id?: string;
}

export interface ResolvedDataPayload {
  attachments?: Record<snowflake, AttachmentPayload>;
  channels?: Record<snowflake, ChannelPayload>;
  members?: Record<snowflake, GuildMemberPayload>;
  messages?: Record<snowflake, MessagePayload>;
  roles?: Record<snowflake, RolePayload>;
  users?: Record<snowflake, UserPayload>;
}

export interface MessageInteractionPayload {
  id: snowflake;
  member?: GuildMemberPayload;
  name: string;
  type: InteractionType;
  user: UserPayload;
}

export interface InteractionResponsePayload {
  data?:
    | AutocompleteInteractionCallbackData
    | MessageInteractionCallbackData
    | ModalInteractionCallbackPayload;
  type: InteractionCallbackType;
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
  allowed_mentions?: AllowedMentionsPayload;
  attachments?: AttachmentPayload[];
  components?: ComponentPayload[];
  content?: string;
  embeds?: EmbedPayload[];
  flags?: number;
  poll?: PollCreateRequestPayload;
  tts?: boolean;
}

export interface AutocompleteInteractionCallbackData {
  choices: ApplicationCommandOptionChoicePayload[];
}

export interface ModalInteractionCallbackPayload {
  components: ComponentPayload[];
  custom_id: string;
  title: string;
}
