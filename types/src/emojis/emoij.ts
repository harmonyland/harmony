import { snowflake } from "../common.ts";
import { Reasonable } from "../etc/reasonable.ts";
import { UserPayload } from "../users/user.ts";

export interface EmojiPayload {
  id: snowflake | null;
  name: string | null;
  roles?: string[];
  user?: UserPayload;
  require_colons?: boolean;
  managed?: boolean;
  animated?: boolean;
  available?: boolean;
}

export interface CreateGuildEmojiPayload extends Reasonable {
  name: string;
  image: string;
  roles: snowflake[];
}

export interface EditGuildEmojiPayload extends Reasonable {
  name?: string;
  roles?: snowflake[] | null;
}
