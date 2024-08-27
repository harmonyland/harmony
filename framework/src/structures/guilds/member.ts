import type { GuildMemberPayload } from "../../../../types/mod.ts";
import type { Client } from "../../client/mod.ts";

export class Member {
  client: Client;
  payload: GuildMemberPayload;

  constructor(client: Client, payload: GuildMemberPayload) {
    this.client = client;
    this.payload = payload;
    if (payload.user) {
      this.client.users.set(payload.user.id, payload.user);
    }
  }

  get id() {
    return this.payload.user?.id;
  }
  get user() {
    return this.id ? this.client.users.get(this.id) : undefined;
  }
  get nick() {
    return this.payload.nick ?? this.user?.name;
  }
  get avatar() {
    // TODO: give default avatar
    // (also) TODO: give the url instead of hash
    return this.payload.avatar ?? this.user?.avatar;
  }
  get roles() {
    return this.payload.roles.map((id) => this.client.roles.get(id));
  }
  get joinedAt() {
    return Date.parse(this.payload.joined_at);
  }
  get premiumSince() {
    return this.payload.premium_since ?? null;
  }
  get deaf() {
    return this.payload.deaf;
  }
  get mute() {
    return this.payload.mute;
  }
  get flags() {
    // TODO: make flags class
    return this.payload.flags;
  }
  get pending() {
    return this.payload.pending ?? false;
  }
  get permissions() {
    // TODO: make permissions class
    // also TODO: use roles to calculate permissions - permissions in payload is not available in all cases
    return this.payload.permissions;
  }
  get timeOutEnd() {
    return this.payload.communication_disabled_until
      ? Date.parse(this.payload.communication_disabled_until)
      : null;
  }
}
