import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DeleteResult } from 'mongodb';
import { Model, Types } from 'mongoose';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { Feedback, FeedbackDocument } from '../../schemas/feedback.schema';

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

  async delete(id: string): Promise<Feedback | null> {
    return this.feedbackModel.findByIdAndDelete(id);
  }

  async getAll(): Promise<Feedback[]> {
    return this.feedbackModel.find();
  }

  async getById(id: string): Promise<Feedback | null> {
    return this.feedbackModel.findById(id);
  }

  async getByProductId(productId: string): Promise<Feedback[]> {
    return this.feedbackModel.find({
      productId: new Types.ObjectId(productId),
    });
  }

  async deleteByProductId(productId: string): Promise<DeleteResult> {
    return this.feedbackModel.deleteMany({
      productId: new Types.ObjectId(productId),
    });
  }
}
