import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { RatingPageModule } from './rating-page/rating-page.module';
import { ProductModule } from './product/product.module';
import { FeedbackModule } from './feedback/feedback.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getMongoConfig } from './config/mongo.config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getMongoConfig,
    }),
    AuthModule,
    RatingPageModule,
    ProductModule,
    FeedbackModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
