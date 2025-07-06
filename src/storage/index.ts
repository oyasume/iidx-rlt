export interface IStorage {
  get<T extends object>(keys: T): Promise<T>;
  set(items: object): Promise<void>;
}
