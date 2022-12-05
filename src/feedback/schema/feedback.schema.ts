import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type FeedbackDocument = Feedback & Document;

export class Feedback {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  rating: number;

  @Prop({ required: true })
  productId: Types.ObjectId;
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);
