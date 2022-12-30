import { APIManager } from "../src/manager.ts";

Deno.test("mix rest and gateway", async () => {
  const client = new APIManager(Deno.env.get("BOT_TOKEN")!, {
    gateway: {
      intents: 1,
    },
  });

  client.on("READY", async () => {
    console.log("READY");
    await client.post(`/channels/749139969192230995/messages`, {
      body: {
        content: "test",
      },
    });
    await client.destroyAll();
  });

  await client.spawnAndRunAll();
});
