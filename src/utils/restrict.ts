import { Store } from "../stores/store";
import { Permission } from "../types/class-types";

export const Restrict = (policy: Permission = "none"): any => {
  return function (target: Store, propertyKey: string): void {
    const constructor = target.constructor as typeof Store;
    constructor.restrictions = constructor.restrictions || {};
    constructor.restrictions[propertyKey] = policy;
  };
};
