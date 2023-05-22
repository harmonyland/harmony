import type { PremiumType, UserPayload } from "../../../../mod.ts";
import type { Client } from "../../client/mod.ts";

export class User {
  client: Client;
  id: string;
  username: string;
  discriminator: string;
  avatar: string | null;
  bot?: boolean;
  system?: boolean;
  mfaEnabled?: boolean;
  banner?: string | null;
  accentColor?: number | null;
  locale?: string;
  verified?: boolean;
  email?: string | null;
  flags?: number;
  premiumType?: PremiumType;
  publicFlags?: number;
  constructor(client: Client, payload: UserPayload) {
    this.client = client;
    this.id = payload.id;
    this.username = payload.username;
    this.discriminator = payload.discriminator;
    this.avatar = payload.avatar;
    this.bot = payload.bot;
    this.system = payload.system;
    this.mfaEnabled = payload.mfa_enabled;
    this.banner = payload.banner;
    this.accentColor = payload.accent_color;
    this.locale = payload.locale;
    this.verified = payload.verified;
    this.email = payload.email;
    this.flags = payload.flags;
    this.premiumType = payload.premium_type;
    this.publicFlags = payload.public_flags;
  }
}
