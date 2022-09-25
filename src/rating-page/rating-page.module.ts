import { Module } from '@nestjs/common';
import { RatingPageController } from './rating-page.controller';

@Module({
  controllers: [RatingPageController]
})
export class RatingPageModule {}
