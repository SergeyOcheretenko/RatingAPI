import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { PageModule } from './modules/page/page.module';
import { ProductModule } from './modules/product/product.module';
import { FeedbackModule } from './modules/feedback/feedback.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from './config/config.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    AuthModule,
    PageModule,
    ProductModule,
    FeedbackModule,
    SubscriptionModule,
  ],
})
export class AppModule {}
