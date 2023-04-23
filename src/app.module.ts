import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PageModule } from './page/page.module';
import { ProductModule } from './product/product.module';
import { FeedbackModule } from './feedback/feedback.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from './config/config.module';
import { SubscriptionModule } from './subscription/subscription.module';

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
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
