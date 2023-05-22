import type {
  ApplicationPayload,
  AttachmentPayload,
  ChannelMentionPayload,
  ComponentPayload,
  EmbedPayload,
  GuildThreadChannelPayload,
  MessageActivityPayload,
  MessageFlags,
  MessageInteractionPayload,
  MessagePayload,
  MessageReferencePayload,
  MessageType,
  ReactionPayload,
  RoleSubscriptionDataPayload,
  StickerItemPayload,
  UserPayload,
} from "../../../../types/mod.ts";
import type { Client } from "../../client/mod.ts";
import { User } from "../users/user.ts";

export class Message {
  client: Client;
  id: string;
  _author: UserPayload;
  channelID: string;
  content?: string;
  timestamp: Date;
  editedTimestamp?: Date;
  tts: boolean;
  mentionEveryone: boolean;
  _mentions: UserPayload[];
  _mentionRoles: string[];
  _mentionChannels?: ChannelMentionPayload[];
  _attachments?: AttachmentPayload[];
  _embeds?: EmbedPayload[];
  _reactions?: ReactionPayload[];
  nonce?: string | number;
  pinned: boolean;
  webhookID?: string;
  type: MessageType;
  _activity?: MessageActivityPayload;
  _application?: ApplicationPayload;
  applicationID?: string;
  _messageReference?: MessageReferencePayload;
  flags?: MessageFlags;
  _referencedMessage?: MessagePayload | null;
  _interaction?: MessageInteractionPayload;
  _thread?: GuildThreadChannelPayload;
  _components?: ComponentPayload[];
  _stickerItems?: StickerItemPayload[];
  position?: number;
  _roleSubscriptionData?: RoleSubscriptionDataPayload;

  constructor(client: Client, payload: MessagePayload) {
    this.client = client;
    this.id = payload.id;
    this.channelID = payload.channel_id;
    this._author = payload.author;
    this.content = payload.content;
    this.timestamp = new Date(payload.timestamp);
    if (payload.edited_timestamp) {
      this.editedTimestamp = new Date(payload.edited_timestamp);
    }
    this.tts = payload.tts;
    this.mentionEveryone = payload.mention_everyone;
    this._mentions = payload.mentions;
    this._mentionRoles = payload.mention_roles;
    this._mentionChannels = payload.mention_channels;
    this._attachments = payload.attachments;
    this._embeds = payload.embeds;
    this._reactions = payload.reactions;
    this.nonce = payload.nonce;
    this.pinned = payload.pinned;
    this.webhookID = payload.webhook_id;
    this.type = payload.type;
    this._activity = payload.activity;
    this._application = payload.application;
    this.applicationID = payload.application_id;
    this._messageReference = payload.message_reference;
    this.flags = payload.flags;
    this._referencedMessage = payload.referenced_message;
    this._interaction = payload.interaction;
    this._thread = payload.thread;
    this._components = payload.components;
    this._stickerItems = payload.sticker_items;
    this.position = payload.position;
    this._roleSubscriptionData = payload.role_subscription_data;
  }

  /// TODO: make all time-consuming properties lazy

  get author() {
    return new User(this.client, this._author);
  }

  // get channel() {
  //   return this.client.channels.get(this.channelID);
  // }

  // get mentions() {
  //   return this._mentions.map((mention) => {
  //     return new User(this.client, mention);
  //   })
  // }

  // get mentionRoles() {
  //   return this._mentionRoles.map((roleID) => {
  //     return this.channel.roles.get(roleID); /// NOTE: this.channel is always guild channel since role mentions are only allowed in guild channels
  //   })
  // }

  // get mentionChannels() {
  //   return this._mentionChannels.map((channel) => {
  //     return this.client.channels.get(channel.id);
  //   })
  // }
}
