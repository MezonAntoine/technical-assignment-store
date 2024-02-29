import { Store } from "../stores/store";
import { JSONArray, JSONObject, JSONValue } from "./json-types";

export type Permission = "r" | "w" | "rw" | "none";

export type StoreResult = Store | JSONValue;

export type StoreValue = JSONObject | JSONArray | StoreResult | (() => StoreResult);

export type KeyPermissions = Record<string, Permission>;
export type RecordProperties = Record<string, any>;

export interface IStore extends RecordProperties {
  allowedToRead(this: IStore, key: string): boolean;
  allowedToWrite(this: IStore, key: string): boolean;
  read(path: string): StoreResult;
  write(path: string, value: StoreValue): StoreValue;
  writeEntries(entries: JSONObject): void;
  entries(): JSONObject;
  defaultPolicy: Permission;
}
