import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { Feedback, FeedbackDocument } from './schema/feedback.schema';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectModel(Feedback.name)
    private readonly feedbackModel: Model<FeedbackDocument>,
  ) {}

  async create(feedbackData: CreateFeedbackDto): Promise<Feedback> {
    const feedback = new this.feedbackModel({
      ...feedbackData,
      productId: new Types.ObjectId(feedbackData.productId),
    });
    return feedback.save();
  }

  async delete(id: Types.ObjectId): Promise<Feedback | null> {
    return this.feedbackModel.findByIdAndDelete(id);
  }

  async getAll(): Promise<Feedback[]> {
    return this.feedbackModel.find();
  }

  async findByProductId(productId: Types.ObjectId): Promise<Feedback[]> {
    return this.feedbackModel.find({
      productId: new Types.ObjectId(productId),
    });
  }

  async deleteByProductId(productId: string) {
    return this.feedbackModel.deleteMany({
      productId: new Types.ObjectId(productId),
    });
  }
}
