import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';

export type SubscriptionDocument = Subscription & Document;

@Schema({ timestamps: true })
export class Subscription {
  @Prop({ required: true })
  productId: Types.ObjectId;

  @Prop({ required: true })
  userId: Types.ObjectId;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
