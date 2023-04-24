import { Inject, Injectable } from '@nestjs/common';
import { TelegramService } from '../telegram/telegram.service';
import { Feedback } from '../feedback/schema/feedback.schema';
import { SubscriptionService } from '../subscription/subscription.service';

@Injectable()
export class NotifyService {
  constructor(
    @Inject(TelegramService) private readonly telegramService: TelegramService,
    @Inject(SubscriptionService)
    private readonly subscriptionService: SubscriptionService,
  ) {}

  async newFeedbackNotify({
    name,
    title,
    description,
    rating,
    productId,
  }: Feedback) {
    const message =
      `<b>Name:</b> ${name}\n` +
      `<b>Title:</b> ${title}\n` +
      `<b>Description:</b> ${description}\n` +
      `<b>Rating:</b> ${rating}\n` +
      `<b>Product ID:</b> ${productId.toString()}`;

    const { subscribers } = await this.subscriptionService.getByProductId(
      productId.toString(),
    );

    for (const subscriber of subscribers) {
      if (!subscriber.telegramId) continue;

      await this.telegramService.sendHtml(subscriber.telegramId, message);
    }
  }
}
