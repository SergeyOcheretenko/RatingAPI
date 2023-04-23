import { Body, Controller, Get, Post } from '@nestjs/common';
import { AddSubscriberDto } from './dto/add-subscriber.dto';
import { Subscription } from './schema/subscription.schema';
import { SubscriptionService } from './subscription.service';

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
}
