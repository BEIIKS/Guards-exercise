import { MicroserviceOptions } from '@nestjs/microservices';
import { getKafkaConfig } from '@libs/kafka';

export function getMicroserviceConfig(groupId: string): MicroserviceOptions {
  return getKafkaConfig(groupId);
}
