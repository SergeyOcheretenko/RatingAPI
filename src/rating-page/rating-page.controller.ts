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
import { FindRatingPageDto } from './dto/find-rating-page.dto';
import { RatingPage } from './schema/rating-page.schema';

@Controller('rating-page')
export class RatingPageController {
  @Post('create')
  async create(@Body() dto: Omit<RatingPage, '_id'>) {}

  @Get(':id')
  async get(@Param('id') id: string) {}

  @Delete(':id')
  async delete(@Param('id') id: string) {}

  @Patch(':id')
  async patch(@Param('id') id: string, @Body() dto: RatingPage) {}

  @HttpCode(200)
  @Post()
  async find(@Body() dto: FindRatingPageDto) {}
}
