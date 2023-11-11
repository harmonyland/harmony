import {
  DISCORD_API_VERSION,
  DISCORD_GATEWAY_BASE,
} from "../../../types/src/constants.ts";
import {
  GatewayCloseCode,
  GatewayDataType,
  GatewayEventNames,
  GatewayHelloPayload,
  GatewayIdentifyPayload,
  GatewayOpcode,
  GatewayPayload,
  GatewayReadyPayload,
  GatewayResumePayload,
  Reasumable,
} from "../../../types/mod.ts";
import { GatewayEvents } from "../../types/gateway/events.ts";
import { EventEmitter, unzlib } from "../../deps.ts";
import { decoder } from "../utils/utf8.ts";

export interface GatewayOptions {
  properties?: {
    os: string;
    browser: string;
    device: string;
  };
  shard?: [number, number];
}

export class Gateway extends EventEmitter<GatewayEvents> {
  ws!: WebSocket;
  token: string;
  intents = 0;
  properties: GatewayIdentifyPayload["properties"];
  shard?: [number, number];
  private heartbeatInterval: number | null = null;
  private heartbeatCode = 0;
  private serverHeartbeat = true;
  private resume = false;
  private sequence: number | null = null;
  private sessionID: string | null = null;
  private connected = false;
  private retryCount = 0;
  private connectionError = false;
  private reconnecting = false;

  constructor(
    token: string,
    intents: number,
    { properties, shard }: GatewayOptions = {},
  ) {
    super();
    this.token = token;
    this.intents = intents;
    this.properties = {
      "$os": properties?.os ?? Deno.build.os,
      "$browser": properties?.browser ?? "harmony",
      "$device": properties?.device ?? "harmony",
    };
    this.shard = shard;
  }

  initVariables() {
    this.heartbeatInterval = null;
    if (this.heartbeatCode !== 0) {
      clearInterval(this.heartbeatCode);
    }
    this.heartbeatCode = 0;
  }

  connect() {
    return new Promise<void>((resolve) => {
      this.ws = new WebSocket(
        `${DISCORD_GATEWAY_BASE}/?v=${DISCORD_API_VERSION}&encoding=json`,
      );
      const onopen = this.onopen.bind(this);
      this.ws.onopen = () => {
        onopen();
        resolve();
      };
      this.ws.onmessage = this.onmessage.bind(this);
      this.ws.onclose = this.onclose.bind(this);
      this.ws.onerror = this.onerror.bind(this);
      this.ws.binaryType = "arraybuffer";
    });
  }

  disconnect(code?: GatewayCloseCode, reason?: string) {
    return new Promise<void>((resolve) => {
      this.ws.onclose = (e) => {
        this.onclose.bind(this)(e);
        resolve();
      };
      this.ws.close(code, reason ?? "");
      this.initVariables();
      this.connected = false;
    });
  }

  private onopen() {
    this.connected = true;
    this.retryCount = 0;
    this.emit("CONNECTED");
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
              shard: this.shard,
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

  private onclose(e: CloseEvent) {
    this.initVariables();
    this.connected = false;
    switch (e.code) {
      case GatewayCloseCode.UNKNOWN_ERROR:
      case GatewayCloseCode.UNKNOWN_OPCODE:
      case GatewayCloseCode.DECODE_ERROR:
      case GatewayCloseCode.INVALID_SEQ:
      case GatewayCloseCode.ALREADY_AUTHENTICATED:
      case GatewayCloseCode.RATE_LIMITED:
        this.emit("CLOSED", e.code, true, true);
        if (!this.reconnecting) {
          this.reconnect(true);
        }
        break;
      case GatewayCloseCode.NOT_AUTHENTICATED:
      case GatewayCloseCode.SESSION_TIMEOUT:
        this.emit("CLOSED", e.code, true, false);
        if (!this.reconnecting) {
          this.reconnect();
        }
        break;
      case GatewayCloseCode.INVALID_SHARD:
      case GatewayCloseCode.SHARDING_REQUIRED:
      case GatewayCloseCode.INVALID_VERSION:
      case GatewayCloseCode.INVALID_INTENT:
      case GatewayCloseCode.DISALLOWED_INTENT:
      case GatewayCloseCode.AUTHENTICATION_FAILED:
        this.emit("CLOSED", e.code, false, true);
        break;
      default:
        this.emit("CLOSED", e.code, this.retryCount < 5, !this.connectionError);
        if (!this.reconnecting) {
          if (this.retryCount < 5) {
            setTimeout(() => {
              this.retryCount++;
              this.reconnect(!this.connectionError);
            }, 500);
          } else {
            throw new Error(
              `Gateway connection closed with code ${e.code}, retry limit reached(${this.retryCount})`,
            );
          }
        }
        break;
    }
    this.reconnecting = false;
  }

  private onerror(ev: Event | ErrorEvent) {
    this.emit("ERROR", ev);
    this.connectionError = true;
  }

  reconnect(resume = false, code?: number) {
    this.resume = resume;
    this.reconnecting = true;
    if (this.connected) {
      this.disconnect(code, "reconnect");
    }
    this.connect();
  }

  heartbeat() {
    if (this.serverHeartbeat) {
      this.serverHeartbeat = false;
      this.send(GatewayOpcode.HEARTBEAT, this.sequence);
    } else {
      // oh my god, the server is dead
      this.disconnect(4000, "heartbeat timeout");
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
    if (this.connected) {
      this.ws.send(JSON.stringify(req));
    }
  }

  sendDispatch(
    event: GatewayEventNames,
    data: GatewayDataType,
    seq = false,
  ) {
    this.send(GatewayOpcode.DISPATCH, data, seq, event);
  }
}
