import { snowflake } from "../common.ts";
import { EmojiPayload } from "../emojis/emoij.ts";
import { UserPayload } from "../users/user.ts";

export interface PollPayload {
  question: PollMediaPayload;
  answers: PollAnswerPayload[];
  expiry: string | null;
  allow_multiselect: boolean;
  layout_type: PollLayoutType;
  results?: PollResultPayload;
}

export interface PollCreateRequestPayload {
  question: PollMediaPayload;
  answers: PollAnswerPayload[];
  duration: number;
  allow_multiselect: boolean;
  layout_type?: PollLayoutType;
}

export enum PollLayoutType {
  DEFAULT = 1,
}

export interface PollMediaPayload {
  text?: string;
  emoji?: EmojiPayload;
}

export interface PollAnswerPayload {
  answer_id: number;
  poll_media: PollMediaPayload;
}

export interface PollResultPayload {
  is_finalized: boolean;
  answer_counts: PollAnswerCountPayload[];
}

export interface PollAnswerCountPayload {
  id: number;
  count: number;
  me_voted: boolean;
}

export interface GetAnswerVotersParams {
  after?: snowflake;
  limit?: number;
}

export interface GetAnswerVotersResponse {
  users: UserPayload[];
}
