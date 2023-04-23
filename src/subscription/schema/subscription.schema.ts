import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';

export type SubscriptionDocument = Subscription & Document;

@Schema({ timestamps: true })
export class Subscription {
  @Prop({ required: true })
  productId: ObjectId;

  @Prop({ required: true })
  subscribers: ObjectId[];
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
