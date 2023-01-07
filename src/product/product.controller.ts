import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { HttpException } from '@nestjs/common/exceptions';
import { AuthGuard } from '@nestjs/passport';
import { CreateProductDto } from './dto/create-product.dto';
import { FindByCategoryDto } from './dto/find-products.dto';
import { PRODUCT_NOT_FOUND_ERROR } from './product.constants';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(
    @Inject(ProductService) private readonly productService: ProductService,
  ) {}

  @Post('create')
  async create(@Body() body: CreateProductDto) {
    return this.productService.create(body);
  }

  @Get()
  async getAll() {
    return this.productService.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    const product = await this.productService.getById(id);

    if (!product) {
      throw new HttpException(PRODUCT_NOT_FOUND_ERROR, HttpStatus.NOT_FOUND);
    }

    return product;
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const product = await this.productService.delete(id);

    if (!product) {
      throw new HttpException(PRODUCT_NOT_FOUND_ERROR, HttpStatus.NOT_FOUND);
    }

    return product;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: CreateProductDto) {
    const product = await this.productService.update(id, body);

    if (!product) {
      throw new HttpException(PRODUCT_NOT_FOUND_ERROR, HttpStatus.NOT_FOUND);
    }

    return product;
  }

  @HttpCode(200)
  @Post('byCategory')
  async findByCategory(@Body() body: FindByCategoryDto) {
    return this.productService.findByCategory(body);
  }
}
