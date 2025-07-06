import { IStorage } from "./index";

export class LocalStorage implements IStorage {
  get<T extends object>(defaultValues: T): Promise<T> {
    try {
      const result: T = { ...defaultValues };

      for (const key of Object.keys(defaultValues)) {
        const storedItem = localStorage.getItem(key);
        if (storedItem !== null) {
          (result as Record<string, unknown>)[key] = JSON.parse(storedItem);
        }
      }
      return Promise.resolve(result);
    } catch (e: unknown) {
      return Promise.reject(e instanceof Error ? e : new Error(String(e)));
    }
  }

  set(items: object): Promise<void> {
    try {
      for (const key of Object.keys(items)) {
        const value = (items as Record<string, unknown>)[key];
        localStorage.setItem(key, JSON.stringify(value));
      }
      return Promise.resolve();
    } catch (e: unknown) {
      return Promise.reject(e instanceof Error ? e : new Error(String(e)));
    }
  }
}
