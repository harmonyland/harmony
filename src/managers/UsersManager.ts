import { Client } from "../models/client.ts";
import { User } from "../structures/user.ts";
import { USER } from "../types/endpoint.ts";
import { UserPayload } from "../types/user.ts";
import { BaseManager } from "./BaseManager.ts";

export class UserManager extends BaseManager<UserPayload, User> {
  constructor(client: Client) {
    super(client, "users", User)
  }

  fetch(id: string) {
    return new Promise((res, rej) => {
      this.client.rest.get(USER(id)).then(data => {
        this.set(id, data as UserPayload)
        res(new User(this.client, data as UserPayload))
      }).catch(e => rej(e))
    })
  }
}