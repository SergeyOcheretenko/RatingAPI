import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { PageModule } from './modules/page/page.module';
import { ProductModule } from './modules/product/product.module';
import { FeedbackModule } from './modules/feedback/feedback.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from './config/config.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    AuthModule,
    PageModule,
    ProductModule,
    FeedbackModule,
    SubscriptionModule,
    UserModule,
  ],
})
export class AppModule {}
