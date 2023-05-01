import type { MessagePayload } from "../../../types/mod.ts";
import type { GatewayHandler } from "../../types/gateway.ts";
import type { Client } from "../client/mod.ts";
import { Message } from "../structures/message.ts";

const messageCreate: GatewayHandler<MessagePayload> = (
  client: Client,
  data: MessagePayload,
) => {
  const message = new Message(client, data);
  client.emit("messageCreate", message);
};

export default messageCreate;
