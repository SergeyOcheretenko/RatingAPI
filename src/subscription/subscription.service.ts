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
    const subscription = await this.subscriptionModel.findOne({
      productId: new Types.ObjectId(productId),
    });

    if (!subscription) {
      const newSubscription = new this.subscriptionModel({
        productId: new Types.ObjectId(productId),
        subscribers: [new Types.ObjectId(userId)],
      });

      return newSubscription.save();
    }

    if (subscription.subscribers.includes(new Types.ObjectId(userId)))
      return null;

    subscription.subscribers.push(new Types.ObjectId(userId));
    return subscription.save();
  }

  async getAll() {
    return this.subscriptionModel.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'subscribers',
          foreignField: '_id',
          as: 'subscribers',
        },
      },
      {
        $project: {
          _id: 0,
          productId: 1,
          subscribers: {
            $map: {
              input: '$subscribers',
              as: 'subscriber',
              in: {
                _id: '$$subscriber._id',
                telegramId: '$$subscriber.telegramId',
              },
            },
          },
        },
      },
    ]);
  }

  async getByProductId(productId: string) {
    const [result] = await this.subscriptionModel.aggregate([
      {
        $match: {
          productId: new Types.ObjectId(productId),
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'subscribers',
          foreignField: '_id',
          as: 'subscribers',
        },
      },
      {
        $project: {
          _id: 0,
          productId: '$productId',
          subscribers: {
            $map: {
              input: '$subscribers',
              as: 'subscriber',
              in: {
                _id: '$$subscriber._id',
                telegramId: '$$subscriber.telegramId',
              },
            },
          },
        },
      },
    ]);

    return result;
  }
}
