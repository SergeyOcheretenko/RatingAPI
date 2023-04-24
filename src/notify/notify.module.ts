import { Module } from '@nestjs/common';
import { NotifyService } from './notify.service';
import { TelegramModule } from '../telegram/telegram.module';
import { SubscriptionModule } from '../subscription/subscription.module';

@Module({
  imports: [TelegramModule, SubscriptionModule],
  providers: [NotifyService],
  exports: [NotifyService],
})
export class NotifyModule {}
