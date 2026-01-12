import { DynamicModule, Module } from '@nestjs/common';
import { KafkaService } from './kafka.service';
import { ClientsModule } from '@nestjs/microservices';
import { getKafkaConfig } from './kafka.config';

@Module({})
export class KafkaModule {
  static register(config: {
    clientId: string;
    groupId?: string;
  }): DynamicModule {
    return {
      module: KafkaModule,
      imports: [
        ClientsModule.register([
          {
            name: 'KAFKA_CLIENT',
            ...getKafkaConfig(
              config.groupId ?? 'default-group',
              config.clientId,
            ),
          },
        ]),
      ],
      providers: [KafkaService],
      exports: [KafkaService],
    };
  }
}
