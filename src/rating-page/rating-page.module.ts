import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { RatingPageController } from './rating-page.controller';
import { RatingPageModel } from './rating-page.model';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: RatingPageModel,
        schemaOptions: {
          collection: 'RatingPage',
        },
      },
    ]),
  ],
  controllers: [RatingPageController],
})
export class RatingPageModule {}
