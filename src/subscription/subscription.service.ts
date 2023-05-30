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
  private lookups = [
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user',
      },
    },
    {
      $lookup: {
        from: 'products',
        localField: 'productId',
        foreignField: '_id',
        as: 'product',
      },
    },
    {
      $unwind: '$user',
    },
    {
      $unwind: '$product',
    },
  ];

  constructor(
    @InjectModel(Subscription.name)
    private readonly subscriptionModel: Model<SubscriptionDocument>,
  ) {}

  async addSubscriber({ productId, userId }: AddSubscriberDto) {
    const subscription = new this.subscriptionModel({
      productId: new Types.ObjectId(productId),
      userId: new Types.ObjectId(userId),
    });
    return subscription.save();
  }

  async getAll() {
    return this.subscriptionModel.aggregate([...this.lookups]);
  }

  async getById(id: string) {
    const [subscription] = await this.subscriptionModel.aggregate([
      {
        $match: {
          _id: new Types.ObjectId(id),
        },
      },
      ...this.lookups,
    ]);

    return subscription;
  }

  async getByProductId(productId: string) {
    return this.subscriptionModel.aggregate([
      {
        $match: {
          productId: new Types.ObjectId(productId),
        },
      },
      ...this.lookups,
    ]);
  }

  async getByUserId(userId: string) {
    return this.subscriptionModel.aggregate([
      {
        $match: {
          userId: new Types.ObjectId(userId),
        },
      },
      ...this.lookups,
    ]);
  }

  async delete(id: string) {
    return this.subscriptionModel.findByIdAndDelete(new Types.ObjectId(id));
  }
}
