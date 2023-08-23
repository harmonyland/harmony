import type { PremiumType, UserPayload } from "../../../../mod.ts";
import type { Client } from "../../client/mod.ts";

export class User {
  client: Client;
  payload: UserPayload;
  constructor(client: Client, payload: UserPayload) {
    this.client = client;
    this.payload = payload;
  }

  get id(): string {
    return this.payload.id;
  }
  get username(): string {
    return this.payload.username;
  }
  get discriminator(): string {
    return this.payload.discriminator;
  }
  get avatar(): string | null {
    return this.payload.avatar;
  }
  get bot(): boolean {
    return this.payload.bot ?? false;
  }
  get system(): boolean {
    return this.payload.system ?? false;
  }
  get mfaEnabled(): boolean {
    return this.payload.mfa_enabled ?? false;
  }
  get banner(): string | null | undefined {
    return this.payload.banner;
  }
  get accentColor(): number | null | undefined {
    return this.payload.accent_color;
  }
  get locale(): string | undefined {
    return this.payload.locale;
  }
  get verified(): boolean {
    return this.payload.verified ?? false;
  }
  get email(): string | null | undefined {
    return this.payload.email;
  }
  get flags(): number | undefined {
    return this.payload.flags;
  }
  get premiumType(): PremiumType | undefined {
    return this.payload.premium_type;
  }
  get publicFlags(): number | undefined {
    return this.payload.public_flags;
  }
}
