import { IStorage } from "../../../storage";
import { Ticket } from "../../../types";

const sampleTickets: Ticket[] = [
  { laneText: "2461357", expiration: "2999/12/31" }, // ガチ割れ (1P)
  { laneText: "7531642", expiration: "2999/12/31" }, // ガチ割れ (2P)
  { laneText: "1472356", expiration: "2999/12/31" }, // 桂馬押し (1P)
  { laneText: "6532741", expiration: "2999/12/31" }, // 桂馬押し (2P)
];

export class SampleStorage implements IStorage {
  get<T extends object>(defaultValues: T): Promise<T> {
    const result: Partial<T> = {};
    if ("tickets" in defaultValues) {
      (result as { tickets?: Ticket[] }).tickets = sampleTickets;
    }
    return Promise.resolve({ ...defaultValues, ...result });
  }

  set(_items: object): Promise<void> {
    return Promise.resolve();
  }
}
