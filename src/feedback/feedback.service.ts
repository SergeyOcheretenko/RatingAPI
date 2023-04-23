import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DeleteResult } from 'mongodb';
import { Model, Types } from 'mongoose';
import { SubscriptionService } from '../subscription/subscription.service';
import { TelegramService } from '../telegram/telegram.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { Feedback, FeedbackDocument } from './schema/feedback.schema';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectModel(Feedback.name)
    private readonly feedbackModel: Model<FeedbackDocument>,
    @Inject(TelegramService) private readonly telegramService: TelegramService,
    @Inject(SubscriptionService)
    private readonly subscriptionService: SubscriptionService,
  ) {}

  async notify({
    name,
    title,
    description,
    rating,
    productId,
  }: CreateFeedbackDto) {
    const message =
      `<b>Name:</b> ${name}\n` +
      `<b>Title:</b> ${title}\n` +
      `<b>Description:</b> ${description}\n` +
      `<b>Rating:</b> ${rating}\n` +
      `<b>Product ID:</b> ${productId}`;

    // const { subscribers } = await this.subscriptionService.getByProductId(
    //   productId,
    // );

    const subscriptions = await this.subscriptionService.getAll();
    const subscribers = subscriptions
      .filter((s) => s.productId.toString() === productId)
      .map((e) => e.subscribers)
      .flat();

    for (const subscriber of subscribers) {
      if (!subscriber.telegramId) continue;

      await this.telegramService.sendHtml(subscriber.telegramId, message);
    }
  }

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

  async findByProductId(productId: string): Promise<Feedback[]> {
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
