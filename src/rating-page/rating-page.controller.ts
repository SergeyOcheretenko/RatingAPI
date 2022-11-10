import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FindRatingPageDto } from './dto/find-rating-page.dto';
import { RatingPageModel } from './rating-page.model';

@Controller('rating-page')
export class RatingPageController {
  @Post('create')
  async create(@Body() dto: Omit<RatingPageModel, '_id'>) {}

  @Get(':id')
  async get(@Param('id') id: string) {}

  @Delete(':id')
  async delete(@Param('id') id: string) {}

  @Patch(':id')
  async patch(@Param('id') id: string, @Body() dto: RatingPageModel) {}

  @HttpCode(200)
  @Post()
  async find(@Body() dto: FindRatingPageDto) {}
}
