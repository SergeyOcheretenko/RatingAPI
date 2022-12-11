import { Types } from 'mongoose';

export class CreateFeedbackDto {
  name: string;
  title: string;
  description: string;
  rating: number;
  productId: Types.ObjectId;
}
