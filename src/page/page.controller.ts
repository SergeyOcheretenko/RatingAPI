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
import { CreatePageDto } from './dto/create-page.dto';
import { FindRatingPageDto } from './dto/find-page.dto';
import { Page } from './schema/page.schema';

@Controller('page')
export class PageController {
  @Post('create')
  async create(@Body() body: CreatePageDto) {}

  @Get(':id')
  async get(@Param('id') id: string) {}

  @Delete(':id')
  async delete(@Param('id') id: string) {}

  @Patch(':id')
  async patch(@Param('id') id: string, @Body() dto: Page) {}

  @HttpCode(200)
  @Post()
  async find(@Body() dto: FindRatingPageDto) {}
}
