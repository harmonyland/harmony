// deno-lint-ignore-file no-explicit-any
import { Collection } from "./collection.ts";

export class CacheManager extends Collection<string, Collection<string, any>> {
  constructor() {
    super();
  }
}
