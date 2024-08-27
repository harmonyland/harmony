import { snowflake } from "../common.ts";
import { Reasonable } from "../etc/reasonable.ts";
import { UserPayload } from "../users/user.ts";

export interface EmojiPayload {
  animated?: boolean;
  available?: boolean;
  id: null | snowflake;
  managed?: boolean;
  name: null | string;
  require_colons?: boolean;
  roles?: string[];
  user?: UserPayload;
}

export interface CreateGuildEmojiPayload extends Reasonable {
  image: string;
  name: string;
  roles: snowflake[];
}

export interface EditGuildEmojiPayload extends Reasonable {
  name?: string;
  roles?: null | snowflake[];
}
