import type { Message } from "../structures/mod.ts";

// ...this is gonna be very painful to fix
export type ClientEvents = {
  messageCreate: [Message];
  ready: [];
};
