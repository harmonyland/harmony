export type ActivityType = 'PLAYING' | 'STREAMING' | 'LISTENING' | 'WATCHING' | 'CUSTOM_STATUS' | 'COMPETING';
export type StatusType = 'online' | 'invisible' | 'offline' | 'idle' | 'dnd';

export enum ActivityTypes {
  PLAYING = 0,
  STREAMING = 1,
  LISTENING = 2,
  WATCHING = 3,
  CUSTOM_STATUS = 4,
  COMPETING = 5,
}

export interface ActivityGame {
  name: string;
  type: 0 | 1 | 2 | 3 | 4 | 5 | ActivityType;
  url?: string;
}

export interface ClientActivity {
  status?: StatusType
  activity?: ActivityGame | ActivityGame[]
  since?: number | null
  afk?: boolean
}

export interface ClientActivityPayload {
  status: StatusType
  activities: ActivityGame[] | null
  since: number | null
  afk: boolean
}

export class ClientPresence {
  status: StatusType = 'online'
  activity?: ActivityGame | ActivityGame[] 
  since?: number | null
  afk?: boolean

  constructor(data?: ClientActivity | ClientActivityPayload | ActivityGame) {
    if (data) {
      if((data as ClientActivity).activity !== undefined) {
        Object.assign(this, data)
      } else if((data as ClientActivityPayload).activities !== undefined) {
        
      } else if((data as ActivityGame).name !== undefined) {
        if(!this.activity) {
          this.activity = data as ActivityGame
        } else if(this.activity instanceof Array) {
          this.activity.push(data as ActivityGame)
        } else this.activity = [ this.activity, data as ActivityGame ]
      }
    }
  }

  parse(payload: ClientActivityPayload) {
    this.afk = payload.afk
    this.activity = payload.activities ?? undefined
    this.since = payload.since
    this.status = payload.status
  }

  static parse(payload: ClientActivityPayload) {
    return new ClientPresence().parse(payload)
  }

  create(): ClientActivityPayload {
    return {
      afk: this.afk || false,
      activities: this.createActivity(),
      since: this.since || null,
      status: this.status || 'online'
    }
  }

  createActivity() {
    let activity = this.activity == undefined ? null : (this.activity instanceof Array ? this.activity : [this.activity]) || null
    if(activity == null) return activity
    else {
      activity.map(e => {
        if(typeof e.type == "string") e.type = ActivityTypes[e.type]
        return e
      })
      return activity
    }
  }

  setStatus(status: StatusType) {
    this.status = status
    return this
  }

  setActivity(activity: ActivityGame) {
    this.activity = activity
    return this
  }

  setActivities(activities: ActivityGame[]) {
    this.activity = activities
    return this
  }

  setAFK(afk: boolean) {
    this.afk = afk
  }

  removeAFK() {
    this.afk = false
    return this
  }

  toggleAFK() {
    this.afk = !(this.afk || true)
    return this
  }

  setSince(since?: number) {
    this.since = since
    return this
  }
}