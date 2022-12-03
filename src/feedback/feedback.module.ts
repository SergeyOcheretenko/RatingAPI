import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { FeedbackController } from './feedback.controller';
import { FeedbackModel } from './models/feedback.model';
import { FeedbackService } from './feedback.service';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: FeedbackModel,
        schemaOptions: {
          collection: 'Feedback',
        },
      },
    ]),
  ],
  controllers: [FeedbackController],
  providers: [FeedbackService],
})
export class FeedbackModule {}
