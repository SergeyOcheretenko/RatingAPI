import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { AddSubscriberDto } from './dto/add-subscriber.dto';
import { SubscriptionService } from './subscription.service';
import { MongoIdValidationPipe } from '../../pipes/mongo-id.pipe';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  async addSubscriber(@Body() body: AddSubscriberDto) {
    return this.subscriptionService.addSubscriber(body);
  }

  @Get()
  async getAll() {
    return this.subscriptionService.getAll();
  }

  @Get(':id')
  async getById(@Param('id', MongoIdValidationPipe) id: string) {
    const subscription = await this.subscriptionService.getById(id);

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    return subscription;
  }

  @Get('product/:productId')
  async getByProductId(
    @Param('productId', MongoIdValidationPipe) productId: string,
  ) {
    return this.subscriptionService.getByProductId(productId);
  }

  @Get('user/:userId')
  async getByUserId(@Param('userId', MongoIdValidationPipe) userId: string) {
    return this.subscriptionService.getByUserId(userId);
  }

  @Delete(':id')
  async delete(@Param('id', MongoIdValidationPipe) id: string) {
    return this.subscriptionService.delete(id);
  }
}
