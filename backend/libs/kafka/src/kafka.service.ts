import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class KafkaService implements OnModuleInit {
  constructor(@Inject('KAFKA_CLIENT') private readonly client: ClientKafka) {}

  async onModuleInit() {
    await this.client.connect();
  }

  async emit(topic: string, payload: any) {
    await lastValueFrom(this.client.emit(topic, payload));
  }

  async emitMany(topic: string, payloads: { key?: string; value: any }[]) {
    const messages = payloads.map((payload) => ({
      key: payload.key,
      value: JSON.stringify(payload.value),
    }));

    await this.client.producer.send({
      topic,
      messages,
    });
  }
}
