import { UserPayload } from "../users/user.ts";

export interface EmojiPayload {
  id: string | null;
  name: string | null;
  roles?: string[];
  user?: UserPayload;
  require_colons?: boolean;
  managed?: boolean;
  animated?: boolean;
  available?: boolean;
}

export interface CreateGuildEmojiPayload {
  name: string;
  image: string;
  roles: string[];
}

export interface EditGuildEmojiPayload {
  name?: string;
  roles?: string[] | null;
}
