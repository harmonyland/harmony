import { EveryChannelPayloads } from "../../../types/channel.ts";
import { GatewayHandler } from "../../../types/mod.ts";

const channelCreate: GatewayHandler<"CHANNEL_CREATE"> = (
  client,
  [_, channel],
) => {
  client.channels.set(channel.id, channel as EveryChannelPayloads);
  const channelObj = client.channels.get(channel.id)!;
  client.emit("channelCreate", channelObj);
};

export default channelCreate;
