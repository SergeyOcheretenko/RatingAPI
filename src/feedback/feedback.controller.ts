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
} from '@nestjs/common';
import { Types } from 'mongoose';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { FEEDBACK_NOT_FOUND_MESSAGE } from './feedback.constants';
import { FeedbackService } from './feedback.service';

@Controller('feedback')
export class FeedbackController {
  constructor(
    @Inject(FeedbackService) private readonly feedbackService: FeedbackService,
  ) {}

  @Post('create')
  async create(@Body() feedbackData: CreateFeedbackDto) {
    return this.feedbackService.create(feedbackData);
  }

  @Get()
  async getAll() {
    return this.feedbackService.getAll();
  }

  @Get('byProduct/:productId')
  async getByProduct(@Param('productId') productId: Types.ObjectId) {
    return this.feedbackService.findByProductId(productId);
  }

  @Delete(':id')
  async delete(@Param('id') id: Types.ObjectId) {
    const deletedFeedback = await this.feedbackService.delete(id);

    if (!deletedFeedback) {
      throw new HttpException(FEEDBACK_NOT_FOUND_MESSAGE, HttpStatus.NOT_FOUND);
    }

    return deletedFeedback;
  }
}
