import type {
  APIManagerOptions,
  ShardedGatewayEvents,
} from "../../../core/mod.ts";
import { RESTClient, ShardedGateway } from "../../../core/mod.ts";
import { EventEmitter } from "../../deps.ts";
import type { ClientEvents } from "./events.ts";
import { GatewayHandlers } from "../gateway/mod.ts";
import { ChannelsManager } from "../managers/mod.ts";
import { GuildsManager } from "../managers/guilds.ts";
import { UsersManager } from "../managers/users.ts";
import { RolesManager } from "../managers/roles.ts";
import { EmojisManager } from "../managers/emojis.ts";
import { User } from "../structures/mod.ts";

export interface ClientOptions extends APIManagerOptions {
  intents?: number;
}

export class Client extends EventEmitter<ClientEvents> {
  gateway: ShardedGateway;
  rest: RESTClient;
  token: string;
  user?: User; // it's empty until the ready event is fired
  channels = new ChannelsManager(this);
  guilds = new GuildsManager(this);
  users = new UsersManager(this);
  roles = new RolesManager(this);
  emojis = new EmojisManager(this);

  constructor(token: string, options: ClientOptions = {}) {
    super();
    if (options.intents !== undefined) {
      options.gateway ??= {};
      options.gateway.intents = options.intents;
    }
    this.gateway = new ShardedGateway(token, options.gateway?.intents ?? 0, {
      ...options.gateway,
    });
    for (const [key, value] of Object.entries(GatewayHandlers)) {
      this.gateway.on(key as keyof ShardedGatewayEvents, (...args) => {
        value(this, args);
      });
    }
    this.rest = new RESTClient({ token, ...options.rest });
    this.token = token;
  }

  waitFor<K extends keyof ClientEvents>(
    event: K,
    check: (...args: ClientEvents[K]) => boolean,
    timeout?: number,
  ): Promise<ClientEvents[K] | []> {
    return new Promise((resolve) => {
      let timeoutID: number | undefined;
      if (timeout !== undefined) {
        timeoutID = setTimeout(() => {
          this.off(event, eventFunc);
          resolve([]);
        }, timeout);
      }
      const eventFunc = (...args: ClientEvents[K]): void => {
        if (check(...args)) {
          resolve(args);
          this.off(event, eventFunc);
          if (timeoutID !== undefined) clearTimeout(timeoutID);
        }
      };
      this.on(event, eventFunc);
    });
  }

  async connect() {
    return await this.gateway.spawnAndRunAll();
  }
}
