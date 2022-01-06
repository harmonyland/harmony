export enum IntergrationExpireBehaviors {
  REMOVE_ROLE = 0,
  KICK = 1,
}

export interface IntergrationAccountPayload {
  id: string;
  name: string;
}

export interface IntergrationApplicationPayload {
  id: string;
  name: string;
  icon: string | null;
  description: string;
  summary: string;
  // bot?: UserPayload;
}

export interface IntergrationPayload {
  id: string;
  name: string;
  type: string;
  enabled: boolean;
  syncing?: boolean;
  role_id?: string;
  enable_emoticons?: boolean;
  expire_behavior?: IntergrationExpireBehaviors;
  expire_grace_period?: number;
  // user?: UserPayload;
  account: IntergrationAccountPayload;
  synced_at?: string;
  subscriber_count?: number;
  revoked?: boolean;
  application: IntergrationApplicationPayload;
}
