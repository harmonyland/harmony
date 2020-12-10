import {
  ActivityGame,
  ActivityPayload,
  ClientActivity,
  ClientStatus,
  StatusType
} from '../types/presence.ts'
import { PresenceUpdatePayload, StatusUpdatePayload } from '../types/gateway.ts'
import { Base } from './base.ts'
import { Guild } from './guild.ts'
import { User } from './user.ts'
import { Client } from '../models/client.ts'

export enum ActivityTypes {
  PLAYING = 0,
  STREAMING = 1,
  LISTENING = 2,
  WATCHING = 3,
  CUSTOM_STATUS = 4,
  COMPETING = 5
}

export class Presence extends Base {
  user: User
  guild: Guild
  status: StatusType
  // TODO: Maybe a new structure for this?
  activities: ActivityPayload[]
  clientStatus: ClientStatus

  constructor(
    client: Client,
    data: PresenceUpdatePayload,
    user: User,
    guild: Guild
  ) {
    super(client, data)
    this.user = user
    this.guild = guild
    this.status = data.status
    this.activities = data.activities
    this.clientStatus = data.client_status
  }

  fromPayload(data: PresenceUpdatePayload): Presence {
    this.status = data.status
    this.activities = data.activities
    this.clientStatus = data.client_status
    return this
  }
}

interface StatusPayload extends StatusUpdatePayload {
  client_status?: ClientStatus
}

export class ClientPresence {
  status: StatusType = 'online'
  activity?: ActivityGame | ActivityGame[]
  since?: number | null
  afk?: boolean
  clientStatus?: ClientStatus

  constructor(data?: ClientActivity | StatusPayload | ActivityGame) {
    if (data !== undefined) {
      if ((data as ClientActivity).activity !== undefined) {
        Object.assign(this, data)
      } else if ((data as StatusPayload).activities !== undefined) {
        this.parse(data as StatusPayload)
      } else if ((data as ActivityGame).name !== undefined) {
        if (this.activity === undefined) {
          this.activity = data as ActivityGame
        } else if (this.activity instanceof Array) {
          this.activity.push(data as ActivityGame)
        } else this.activity = [this.activity, data as ActivityGame]
      }
    }
  }

  parse(payload: StatusPayload): ClientPresence {
    this.afk = payload.afk
    this.activity = payload.activities ?? undefined
    this.since = payload.since
    this.status = payload.status
    // this.clientStatus = payload.client_status
    return this
  }

  static parse(payload: StatusUpdatePayload): ClientPresence {
    return new ClientPresence().parse(payload)
  }

  create(): StatusPayload {
    return {
      afk: this.afk === undefined ? false : this.afk,
      activities: this.createActivity(),
      since: this.since === undefined ? null : this.since,
      status: this.status === undefined ? 'online' : this.status
      // client_status: this.clientStatus
    }
  }

  createActivity(): ActivityGame[] | null {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    const activity =
      this.activity === undefined
        ? null
        : this.activity instanceof Array
        ? this.activity
        : [this.activity]
    if (activity === null) return activity
    else {
      activity.map((e) => {
        if (typeof e.type === 'string') e.type = ActivityTypes[e.type]
        return e
      })
      return activity
    }
  }

  setStatus(status: StatusType): ClientPresence {
    this.status = status
    return this
  }

  setActivity(activity: ActivityGame): ClientPresence {
    this.activity = activity
    return this
  }

  setActivities(activities: ActivityGame[]): ClientPresence {
    this.activity = activities
    return this
  }

  setAFK(afk: boolean): ClientPresence {
    this.afk = afk
    return this
  }

  removeAFK(): ClientPresence {
    this.afk = false
    return this
  }

  toggleAFK(): ClientPresence {
    this.afk = this.afk === undefined ? true : !this.afk
    return this
  }

  setSince(since?: number): ClientPresence {
    this.since = since
    return this
  }

  // setClientStatus(
  //   client: 'desktop' | 'web' | 'mobile',
  //   status: StatusType
  // ): ClientPresence {
  //   if (this.clientStatus === undefined) this.clientStatus = {}
  //   this.clientStatus[client] = status
  //   return this
  // }
}
