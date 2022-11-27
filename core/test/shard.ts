import { ShardedGateway } from "../src/gateway/sharded.ts";

Deno.test("test receiving ready", async () => {
  const client = new ShardedGateway(Deno.env.get("BOT_TOKEN")!, 0);

  let count = 0;
  await client.spawnAll();
  for (const [idx, gateway] of Object.entries(client.shards)) {
    gateway.on("READY", async () => {
      count++;
      while (count !== client.shardCount) {
      }
      await client.destroy(Number(idx));
    });
  }
  await client.runAll();
});
