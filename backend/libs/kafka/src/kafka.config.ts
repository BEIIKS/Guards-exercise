import { KafkaOptions, Transport } from '@nestjs/microservices';

export const kafkaBrokers = process.env.KAFKA_BROKERS?.split(',');

export function getKafkaConfig(groupId: string, clientId?: string): KafkaOptions {
  return {
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: kafkaBrokers!,
        clientId: clientId,
      },
      consumer: {
        groupId: groupId,
        allowAutoTopicCreation: true,
      },
    },
  };
}
