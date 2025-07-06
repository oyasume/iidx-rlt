import { IStorage } from "./index";

export class ChromeStorage implements IStorage {
  get<T extends object>(keys: T): Promise<T> {
    return new Promise((resolve) => {
      chrome.storage.sync.get(keys, (result: T) => {
        resolve(result);
      });
    });
  }

  set(items: object): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.sync.set(items, () => {
        resolve();
      });
    });
  }
}
