import { OverwritePayload } from "../../../../types/mod.ts";

export class Overwrite {
  payload: OverwritePayload;

  constructor(payload: OverwritePayload) {
    this.payload = payload;
  }

  get id() {
    return this.payload.id;
  }
  get type() {
    return this.payload.type;
  }
  // TODO: Make permission structure for this
  get allow() {
    return this.payload.allow;
  }
  get deny() {
    return this.payload.deny;
  }
}
