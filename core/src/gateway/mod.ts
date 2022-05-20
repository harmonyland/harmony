import {
  DISCORD_API_VERSION,
  DISCORD_GATEWAY_BASE,
} from "../../../types/src/constants.ts";
import {
  GatewayDataType,
  GatewayEventNames,
  GatewayHelloPayload,
  GatewayIdentifyPayload,
  GatewayPayload,
  GatewayReadyPayload,
  GatewayResumePayload,
  Reasumable,
} from "../../../types/src/gateways/gateway.ts";
import { GatewayOpcode } from "../../../types/src/gateways/opcode.ts";
import { EventEmitter, unzlib } from "../../deps.ts";
import { GatewayEvents } from "../../types/gateway/events.ts";
import { decoder } from "../utils/utf8.ts";

interface GatewayOptions {
  properties?: {
    os: string;
    browser: string;
    device: string;
  };
}

export class Gateway extends EventEmitter<GatewayEvents> {
  ws!: WebSocket;
  token: string;
  intents = 0;
  properties: GatewayIdentifyPayload["properties"];
  private heartbeatInterval: number | null = null;
  private heartbeatCode = 0;
  private serverHeartbeat = true;
  private resume = false;
  private sequence: number | null = null;
  private sessionID: string | null = null;

  constructor(
    token: string,
    intents: number,
    { properties }: GatewayOptions = {},
  ) {
    super();
    this.token = token;
    this.intents = intents;
    this.properties = {
      "$os": properties?.os ?? Deno.build.os,
      "$browser": properties?.browser ?? "harmony",
      "$device": properties?.device ?? "harmony",
    };
    this.connect();
  }

  initVariables() {
    this.heartbeatInterval = null;
    if (this.heartbeatCode !== 0) {
      clearInterval(this.heartbeatCode);
    }
    this.heartbeatCode = 0;
  }

  connect() {
    this.ws = new WebSocket(
      `${DISCORD_GATEWAY_BASE}/?v=${DISCORD_API_VERSION}&encoding=json`,
    );
    this.ws.onmessage = this.onmessage.bind(this);
    this.ws.binaryType = "arraybuffer";
  }

  private onmessage({ data }: MessageEvent) {
    let decoded = data;
    if (decoded instanceof ArrayBuffer) {
      decoded = new Uint8Array(decoded);
    }
    if (decoded instanceof Uint8Array) {
      decoded = unzlib(decoded, 0, (e: Uint8Array) => decoder.decode(e));
    }
    const { op, d, s, t }: GatewayPayload = JSON.parse(decoded);
    this.sequence = s ?? this.sequence;
    switch (op) {
      case GatewayOpcode.HELLO:
        this.serverHeartbeat = true;
        this.heartbeatInterval = (d as GatewayHelloPayload).heartbeat_interval;
        this.heartbeatCode = setInterval(
          this.heartbeat.bind(this),
          this.heartbeatInterval!,
        );
        if (!this.resume) {
          // fresh new connection, send identify
          this.send(
            GatewayOpcode.IDENTIFY,
            {
              token: this.token,
              intents: this.intents,
              properties: this.properties,
              compress: true,
            },
          );
        } else {
          // time to resume our session
          const data: GatewayResumePayload = {
            token: this.token,
            session_id: this.sessionID!,
            seq: this.sequence!,
          };
          this.send(GatewayOpcode.RESUME, data);
        }
        this.emit("HELLO", d as GatewayHelloPayload);
        break;
      case GatewayOpcode.HEARTBEAT_ACK:
        this.serverHeartbeat = true;
        this.emit("HEARTBEAT_ACK");
        break;
      case GatewayOpcode.RECONNECT:
        this.reconnect(true);
        this.emit("RECONNECT");
        break;
      case GatewayOpcode.INVALID_SESSION:
        this.reconnect(d as Reasumable);
        this.emit("INVALID_SESSION");
        break;
      case GatewayOpcode.DISPATCH:
        switch (t) {
          case "READY":
            this.sessionID = (d as GatewayReadyPayload).session_id;
            break;
        }
        // @ts-ignore - every events are implemented anyway
        this.emit(t!, d);
    }
    this.emit("RAW", { op, d, s, t });
  }

  reconnect(resume = false, code?: number) {
    this.resume = resume;
    this.ws.close(code);
    this.initVariables();
    this.connect();
  }

  heartbeat() {
    if (this.serverHeartbeat) {
      this.serverHeartbeat = false;
      this.send(GatewayOpcode.HEARTBEAT, this.sequence);
    } else {
      // oh my god, the server is dead
      this.reconnect(true, 4000);
    }
  }

  send(
    op: GatewayOpcode,
    data: GatewayDataType,
    seq = false,
    t?: GatewayEventNames,
  ) {
    const req = {
      op,
      d: data,
      s: seq ? this.sequence : null,
      t,
    };
    this.ws.send(JSON.stringify(req));
  }

  sendDispatch(
    event: GatewayEventNames,
    data: GatewayDataType,
    seq = false,
  ) {
    this.send(GatewayOpcode.DISPATCH, data, seq, event);
  }
}
