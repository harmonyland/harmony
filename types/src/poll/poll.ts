import { snowflake } from "../common.ts";
import { EmojiPayload } from "../emojis/emoij.ts";
import { UserPayload } from "../users/user.ts";

export interface PollPayload {
  allow_multiselect: boolean;
  answers: PollAnswerPayload[];
  expiry: null | string;
  layout_type: PollLayoutType;
  question: PollMediaPayload;
  results?: PollResultPayload;
}

export interface PollCreateRequestPayload {
  allow_multiselect: boolean;
  answers: PollAnswerPayload[];
  duration: number;
  layout_type?: PollLayoutType;
  question: PollMediaPayload;
}

export enum PollLayoutType {
  DEFAULT = 1,
}

export interface PollMediaPayload {
  emoji?: EmojiPayload;
  text?: string;
}

export interface PollAnswerPayload {
  answer_id: number;
  poll_media: PollMediaPayload;
}

export interface PollResultPayload {
  answer_counts: PollAnswerCountPayload[];
  is_finalized: boolean;
}

export interface PollAnswerCountPayload {
  count: number;
  id: number;
  me_voted: boolean;
}

export interface GetAnswerVotersParams {
  after?: snowflake;
  limit?: number;
}

export interface GetAnswerVotersResponse {
  users: UserPayload[];
}
