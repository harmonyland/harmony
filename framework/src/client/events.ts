import type { Message } from "../structures/message.ts";

// ...this is gonna be very painful to fix
export type ClientEvents = {
  messageCreate: [Message];
};
