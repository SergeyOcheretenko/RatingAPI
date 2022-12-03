import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RatingPageController } from './rating-page.controller';
import { RatingPage } from './schema/rating-page.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: RatingPage.name, schema: RatingPage }]),
  ],
  controllers: [RatingPageController],
})
export class RatingPageModule {}
