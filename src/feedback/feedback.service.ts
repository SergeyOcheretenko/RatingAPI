import { Injectable } from '@nestjs/common';
import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types';
import { Types } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { FeedbackModel } from './models/feedback.model';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectModel(FeedbackModel)
    private readonly feedbackModel: ModelType<FeedbackModel>,
  ) {}

  async create(body: CreateFeedbackDto): Promise<DocumentType<FeedbackModel>> {
    return this.feedbackModel.create(body);
  }

  async delete(id: string): Promise<DocumentType<FeedbackModel> | null> {
    return this.feedbackModel.findByIdAndDelete(id);
  }

  async findByProductId(
    productId: string,
  ): Promise<DocumentType<FeedbackModel>[]> {
    return this.feedbackModel.find({
      productId: new Types.ObjectId(productId),
    });
  }
}
