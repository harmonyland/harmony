import { ShardedGateway } from "../src/gateway/sharded.ts";

Deno.test("test receiving ready", async () => {
  const client = new ShardedGateway(Deno.env.get("BOT_TOKEN")!, 0);

  let count = 0;
  await client.spawnAll();
  client.on("READY", async (shardID) => {
    count++;
    while (count !== client.shardCount) {
    }
    await client.destroy(Number(shardID));
  });
  await client.runAll();
});
