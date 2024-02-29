import { JSONObject } from "../types/json-types";
import { IStore, Permission, StoreResult, StoreValue, KeyPermissions, RecordProperties } from "../types/class-types";

export class Store implements IStore {
  // Définition de la politique par défaut pour les permissions (read/write)
  defaultPolicy: Permission = "rw";
  // Propriété statique pour stocker les restrictions de clé
  static restrictions: KeyPermissions;

  constructor() {
    // Récupération de la référence vers le constructeur de la classe (type RestrictionInfo)
    const constructor = this.constructor as typeof Store;
    // Initialisation des restrictions de la classe s'il n'y en a pas
    constructor.restrictions = constructor.restrictions || {};
  }

  // Méthode privée pour vérifier si l'accès à une clé spécifique avec une permission donnée est autorisé
  private isAccessAllowed(restrictions: KeyPermissions, key: string, permission: "r" | "w"): boolean {
    const restriction = restrictions[key] || [];

    if (restriction === "rw" || restriction === permission) return true;

    const isNone = restriction === "none";
    const isReadPermissionDenied = restriction.includes("r") && permission === "w";
    const isWritePermissionDenied = restriction.includes("w") && permission === "r";

    return !isNone && !isReadPermissionDenied && !isWritePermissionDenied && this.defaultPolicy.includes(permission);
  }

  // Méthode privée pour vérifier si l'accès aux enfants d'une clé spécifique avec une permission donnée est autorisé
  private isChildrenAccessAllowed(keys: string[], permission: "r" | "w"): boolean {
    const currentStore: RecordProperties = this;
    const childrenStore = currentStore[keys[0]];
    if (childrenStore && childrenStore instanceof Store) {
      const childrenRestrictions = (childrenStore.constructor as typeof Store).restrictions;
      return keys.some((key) => this.isAccessAllowed(childrenRestrictions, key, permission));
    }

    return false;
  }

  // Méthode pour vérifier si la lecture d'une clé est autorisée
  allowedToRead = (key: string): boolean => {
    const restrictions = (this.constructor as typeof Store).restrictions;
    return this.isAccessAllowed(restrictions, key, "r");
  };

  // Méthode pour vérifier si l'écriture dans une clé est autorisée
  allowedToWrite = (key: string): boolean => {
    const restrictions = (this.constructor as typeof Store).restrictions;
    return this.isAccessAllowed(restrictions, key, "w");
  };

  // Méthode pour lire la valeur à partir d'un chemin donné
  read = (path: string): StoreResult => {
    const keys = path.split(":");

    if (!this.allowedToRead(keys[0]) && !this.isChildrenAccessAllowed(keys, "r")) {
      throw new Error(`Reading key '${keys[0]}' is not allowed.`);
    }

    let properties: StoreResult = this;

    keys.forEach((key) => {
      const property = (properties as RecordProperties)[key];

      if (!property) return null;

      properties = this.getPropertyValue(property);
    });

    return properties;
  };

  // Méthode pour écrire une valeur à un chemin donné
  write = (path: string, value: StoreValue): StoreValue => {
    const keys = path.split(":");

    if (!this.allowedToWrite(keys[0]) && !this.isChildrenAccessAllowed(keys, "w")) {
      throw new Error(`Writing key '${keys[0]}' is not allowed.`);
    }

    let properties: RecordProperties = this;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];

      if (!properties[key]) {
        properties[key] = {};
      }

      properties = properties[key];
    }

    const lastKey = keys[keys.length - 1];

    properties[lastKey] = value;

    return properties[lastKey];
  };

  // Méthode privée pour obtenir la valeur d'une propriété
  // qui peut être une fonction, un objet avec une propriété `store` ou une propriété ordinaire
  private getPropertyValue = (property: (() => IStore) | { store?: IStore }): StoreResult => {
    if (typeof property === "function") return property();
    console.log(property);
    if (property.store) {
      console.log("store");
      const newStore = new Store();
      newStore.writeEntries(property.store);

      return newStore;
    }

    return property;
  };

  // Écrit les entrées fournies dans l'objet entries dans le store actuel

  writeEntries = (entries: JSONObject): void => {
    Object.entries(entries).forEach(([path, value]) => this.write(path, value));
  };

  // Renvoie un objet JSON contenant toutes les entrées du magasin actuel pour lesquelles la lecture est autorisée
  entries = (): JSONObject => {
    return Object.fromEntries(Object.entries(this).filter(([key]) => this.allowedToRead(key)));
  };
}
