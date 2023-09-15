import type { MessagePayload } from "../../../../types/mod.ts";
import type { GatewayHandler } from "../../../types/gateway.ts";
import type { Client } from "../../client/mod.ts";
import { Message } from "../../structures/messages/mod.ts";

const messageCreate: GatewayHandler<"MESSAGE_CREATE"> = (
  client: Client,
  data: [number, MessagePayload],
) => {
  const message = new Message(client, data[1]);
  client.emit("messageCreate", message);
};

export default messageCreate;
