import { KafkaOptions, Transport } from '@nestjs/microservices';

export const KAFKA_BROKERS = [process.env.KAFKA_BROKERS || 'localhost:9092'];

export function getKafkaConfig(
  groupId: string,
  clientId?: string,
): KafkaOptions {
  return {
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: KAFKA_BROKERS[0].split(','),
        clientId: clientId,
      },
      consumer: {
        groupId: groupId,
        allowAutoTopicCreation: true,
      },
    },
  };
}
