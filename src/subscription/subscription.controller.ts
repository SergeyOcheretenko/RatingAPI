import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AddSubscriberDto } from './dto/add-subscriber.dto';
import { Subscription } from './schema/subscription.schema';
import { SubscriptionService } from './subscription.service';
import { MongoIdValidationPipe } from '../pipes/mongo-id.pipe';

@Controller('subscription')
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

  @Get('byProduct/:productId')
  async getByProductId(
    @Param('productId', MongoIdValidationPipe) productId: string,
  ) {
    return this.subscriptionService.getByProductId(productId);
  }
}
