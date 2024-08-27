import { GatewayIntent } from "../../mod.ts";
import { Client } from "../mod.ts";

const token = Deno.env.get("BOT_TOKEN");
if (!token) {
  throw new Error("No token provided");
}

Deno.test("client", {
  sanitizeOps: false,
}, async (t) => {
  await t.step("ready event", async () => {
    const client = new Client(token);
    await client.connect();
    for await (const _ of client.on("ready")) {
      await client.gateway.destroyAll();
      break;
    }
  });

  await t.step("guild create event", async () => {
    const client = new Client(token, {
      intents: GatewayIntent.GUILDS,
    });
    await client.connect();
    for await (const [guild] of client.on("guildCreate")) {
      if (guild.id === "783319033205751809") {
        await client.gateway.destroyAll();
        break;
      }
    }
  });
});
