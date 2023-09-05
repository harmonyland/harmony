import { GatewayReadyPayload } from "../../../types/mod.ts";
import { GatewayHandler } from "../../types/gateway.ts";
import type { Client } from "../client/mod.ts";
import { User } from "../structures/mod.ts";

const ready: GatewayHandler<"READY"> = (
  client: Client,
  d: [number, GatewayReadyPayload],
) => {
  const user = new User(client, d[1].user);
  client.user = user;
  client.users.set(user.id, d[1].user);

  d[1].guilds.forEach((g) => {
    client.guilds.set(g.id, g);
  });

  client.emit("ready");
};

export default ready;
