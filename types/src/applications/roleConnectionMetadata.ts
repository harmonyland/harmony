import { Locales } from "../etc/locales.ts";

export interface ApplicationRoleConnectionMetadata {
  type: ApplicationRoleConnectionMetadataType;
  key: string;
  name: string;
  name_localization?: Record<Locales, string>;
  description: string;
  description_localization?: Record<Locales, string>;
}

export enum ApplicationRoleConnectionMetadataType {
  INTEGER_LESS_THAN_OR_EQUAL = 1,
  INTEGER_GREATER_THAN_OR_EQUAL = 2,
  INTEGER_EQUAL = 3,
  INTEGER_NOT_EQUAL = 4,
  DATETIME_LESS_THAN_OR_EQUAL = 5,
  DATETIME_GREATER_THAN_OR_EQUAL = 6,
  DATETIME_EQUAL = 7,
  DATETIME_NOT_EQUAL = 8,
}
