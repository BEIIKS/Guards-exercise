import { DynamicModule, Module } from '@nestjs/common';
import { MessagingService } from './messaging.service';
import { KafkaModule, KafkaService } from '@libs/kafka';
import { EventBus } from './event-bus.interface';

@Module({})
export class MessagingModule {
  static register(config: {
    clientId: string;
    groupId?: string;
  }): DynamicModule {
    return {
      module: MessagingModule,
      imports: [KafkaModule.register(config)],
      providers: [
        MessagingService,
        {
          provide: EventBus,
          useExisting: KafkaService,
        },
      ],
      exports: [MessagingService],
    };
  }
}
