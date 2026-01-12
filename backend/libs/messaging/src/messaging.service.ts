import { Injectable } from '@nestjs/common';
import { EventBus } from './event-bus.interface';

@Injectable()
export class MessagingService {
  constructor(private readonly eventBus: EventBus) {}

  async emit<T>(topic: string, payload: T): Promise<void> {
    await this.eventBus.emit(topic, payload);
  }

  async emitMany<T>(topic: string, payloads: T[]): Promise<void> {
    await this.eventBus.emitMany(topic, payloads);
  }
}
