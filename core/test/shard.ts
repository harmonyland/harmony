import { ShardedGateway } from "../src/gateway/sharded.ts";

Deno.test("test receiving ready", async () => {
  const client = new ShardedGateway(Deno.env.get("BOT_TOKEN")!, 0);
  await client.spawnAll();

  client.on("READY", async (shardID) => {
    console.log(shardID);
    await client.destroy(shardID);
  });
  await client.runAll();
});
