import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UrlDocument = HydratedDocument<Url>;

export enum UrlStatus {
  PENDING = 'pending',
  SUCCESS = 'successfull',
  FAIL = 'failed',
}

@Schema({ timestamps: true })
export class Url {
  @Prop({ required: true, unique: true })
  url: string;

  @Prop({ default: UrlStatus.PENDING, enum: UrlStatus })
  status: string;

  @Prop({ default: null })
  content: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export const UrlSchema = SchemaFactory.createForClass(Url);
