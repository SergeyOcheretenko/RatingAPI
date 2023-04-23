import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AddSubscriberDto } from './dto/add-subscriber.dto';
import {
  Subscription,
  SubscriptionDocument,
} from './schema/subscription.schema';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectModel(Subscription.name)
    private readonly subscriptionModel: Model<SubscriptionDocument>,
  ) {}

  async addSubscriber({ productId, userId }: AddSubscriberDto) {
    const subscription = await this.getByProductId(productId);

    if (!subscription) {
      const newSubscription = new this.subscriptionModel({
        productId: new Types.ObjectId(productId),
        subscribers: [new Types.ObjectId(userId)],
      });

      return newSubscription.save();
    }

    subscription.subscribers.push(new Types.ObjectId(userId));

    await this.subscriptionModel.findOneAndUpdate(
      { productId: new Types.ObjectId(productId) },
      subscription,
      { new: true },
    );

    return subscription;
  }

  async getAll(): Promise<Subscription[]> {
    return this.subscriptionModel.find();
  }

  async getByProductId(productId: string): Promise<Subscription | null> {
    return this.subscriptionModel.findOne({
      productId: new Types.ObjectId(productId),
    });
  }
}
