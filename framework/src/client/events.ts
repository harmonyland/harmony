import type { Message } from "../structures/messages/message.ts";

// ...this is gonna be very painful to fix
export type ClientEvents = {
  messageCreate: [Message];
};
