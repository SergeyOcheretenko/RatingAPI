import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MongoIdValidationPipe } from '../pipes/mongo-id.pipe';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { FEEDBACK_NOT_FOUND_MESSAGE } from './dto/exceptions.constants';
import { FeedbackService } from './feedback.service';
import { NotifyService } from '../notify/notify.service';

@Controller('feedback')
export class FeedbackController {
  constructor(
    @Inject(FeedbackService) private readonly feedbackService: FeedbackService,
    @Inject(NotifyService) private readonly notifyService: NotifyService,
  ) {}

  @Post('create')
  async create(@Body() feedbackData: CreateFeedbackDto) {
    const feedback = await this.feedbackService.create(feedbackData);
    await this.notifyService.newFeedbackNotify(feedback);
    return feedback;
  }

  @Get()
  async getAll() {
    return this.feedbackService.getAll();
  }

  @Get('byProduct/:productId')
  async getByProduct(
    @Param('productId', MongoIdValidationPipe) productId: string,
  ) {
    return this.feedbackService.findByProductId(productId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async delete(@Param('id', MongoIdValidationPipe) id: string) {
    const deletedFeedback = await this.feedbackService.delete(id);

    if (!deletedFeedback) {
      throw new HttpException(FEEDBACK_NOT_FOUND_MESSAGE, HttpStatus.NOT_FOUND);
    }

    return deletedFeedback;
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('byProduct/:productId')
  async deleteByProduct(
    @Param('productId', MongoIdValidationPipe) productId: string,
  ) {
    return this.feedbackService.deleteByProductId(productId);
  }
}
