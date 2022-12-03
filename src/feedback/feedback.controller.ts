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
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { FEEDBACK_NOT_FOUND_MESSAGE } from './feedback.constants';
import { FeedbackService } from './feedback.service';

@Controller('feedback')
export class FeedbackController {
  constructor(
    @Inject(FeedbackService) private readonly feedbackService: FeedbackService,
  ) {}

  @Post('create')
  async create(@Body() body: CreateFeedbackDto) {
    return this.feedbackService.create(body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const deletedFeedback = await this.feedbackService.delete(id);

    if (!deletedFeedback) {
      throw new HttpException(FEEDBACK_NOT_FOUND_MESSAGE, HttpStatus.NOT_FOUND);
    }

    return deletedFeedback;
  }

  @Get('byProduct/:productId')
  async getByProduct(@Param('productId') productId: string) {
    return this.feedbackService.findByProductId(productId);
  }
}
