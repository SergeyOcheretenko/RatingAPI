import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { Inject, UseGuards } from '@nestjs/common/decorators';
import { AuthGuard } from '@nestjs/passport';
import { CreatePageDto } from './dto/create-page.dto';
import { PageService } from './page.service';
import { Page } from './schema/page.schema';
import {
  PAGE_NOT_FOUND_BY_ALIAS_ERROR,
  PAGE_NOT_FOUND_BY_ID_ERROR,
  PAGE_WITH_ALIAS_ALREADY_EXISTS_ERROR,
} from './page.constants';
import { MongoIdValidationPipe } from '../pipes/mongo-id.pipe';

@Controller('page')
export class PageController {
  constructor(@Inject(PageService) private readonly pageService: PageService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  async create(@Body() body: CreatePageDto): Promise<Page> {
    const pageByAlias = await this.pageService.getByAlias(body.alias);

    if (pageByAlias) {
      throw new HttpException(
        PAGE_WITH_ALIAS_ALREADY_EXISTS_ERROR,
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.pageService.create(body);
  }

  @Get()
  async getAll(): Promise<Page[]> {
    return this.pageService.getAll();
  }

  @Get(':id')
  async getById(@Param('id', MongoIdValidationPipe) id: string) {
    const page = await this.pageService.getById(id);

    if (!page) {
      throw new HttpException(PAGE_NOT_FOUND_BY_ID_ERROR, HttpStatus.NOT_FOUND);
    }

    return page;
  }

  @Get('byAlias/:alias')
  async getByAlias(@Param('alias') alias: string) {
    const page = await this.pageService.getByAlias(alias);

    if (!page) {
      throw new HttpException(
        PAGE_NOT_FOUND_BY_ALIAS_ERROR,
        HttpStatus.NOT_FOUND,
      );
    }

    return page;
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async delete(@Param('id', MongoIdValidationPipe) id: string) {
    const page = await this.pageService.delete(id);

    if (!page) {
      throw new HttpException(PAGE_NOT_FOUND_BY_ID_ERROR, HttpStatus.NOT_FOUND);
    }

    return page;
  }
}
