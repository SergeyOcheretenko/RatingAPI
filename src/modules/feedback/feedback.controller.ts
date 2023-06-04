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
import { MongoIdValidationPipe } from '../../pipes/mongo-id.pipe';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { FEEDBACK_NOT_FOUND_MESSAGE } from './feedback.constants';
import { FeedbackService } from './feedback.service';
import { NotifyService } from '../notify/notify.service';

@Controller('feedbacks')
export class FeedbackController {
  constructor(
    @Inject(FeedbackService) private readonly feedbackService: FeedbackService,
    @Inject(NotifyService) private readonly notifyService: NotifyService,
  ) {}

  @Post()
  async create(@Body() feedbackData: CreateFeedbackDto) {
    const feedback = await this.feedbackService.create(feedbackData);
    await this.notifyService.newFeedbackNotify(feedback);
    return feedback;
  }

  @Get()
  async getAll() {
    return this.feedbackService.getAll();
  }

  @Get(':id')
  async getById(@Param('id', MongoIdValidationPipe) id: string) {
    const feedback = await this.feedbackService.getById(id);

    if (!feedback) {
      throw new HttpException(FEEDBACK_NOT_FOUND_MESSAGE, HttpStatus.NOT_FOUND);
    }

    return feedback;
  }

  @Get('product/:productId')
  async getByProduct(
    @Param('productId', MongoIdValidationPipe) productId: string,
  ) {
    return this.feedbackService.getByProductId(productId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async delete(@Param('id', MongoIdValidationPipe) id: string) {
    const deletedFeedback = await this.feedbackService.delete(id);

    if (!deletedFeedback) {
      throw new HttpException(FEEDBACK_NOT_FOUND_MESSAGE, HttpStatus.NOT_FOUND);
    }

    return deletedFeedback;
  }

  @Delete('product/:productId')
  @UseGuards(AuthGuard('jwt'))
  async deleteByProduct(
    @Param('productId', MongoIdValidationPipe) productId: string,
  ) {
    return this.feedbackService.deleteByProductId(productId);
  }
}
