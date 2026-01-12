export abstract class EventBus {
  abstract emit<T>(topic: string, payload: T): Promise<void>;
  abstract emitMany<T>(topic: string, payloads: T[]): Promise<void>;
}
