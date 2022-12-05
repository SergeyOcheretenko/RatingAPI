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

  async create(body: CreateFeedbackDto): Promise<FeedbackDocument> {
    return this.feedbackModel.create(body);
  }

  async delete(id: string): Promise<FeedbackDocument | null> {
    return this.feedbackModel.findByIdAndDelete(id);
  }

  async getAll() {
    return this.feedbackModel.find();
  }

  async findByProductId(productId: string): Promise<FeedbackDocument[]> {
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
