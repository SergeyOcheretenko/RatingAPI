import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { HttpException } from '@nestjs/common/exceptions';
import { AuthGuard } from '@nestjs/passport';
import { MongoIdValidationPipe } from '../../pipes/mongo-id.pipe';
import { CreateProductDto } from './dto/create-product.dto';
import { PRODUCT_NOT_FOUND_ERROR } from './product.constants';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(
    @Inject(ProductService) private readonly productService: ProductService,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() body: CreateProductDto) {
    return this.productService.create(body);
  }

  @Get()
  async getAll() {
    return this.productService.getAll();
  }

  @Get(':id')
  async getById(@Param('id', MongoIdValidationPipe) id: string) {
    const product = await this.productService.getById(id);

    if (!product) {
      throw new HttpException(PRODUCT_NOT_FOUND_ERROR, HttpStatus.NOT_FOUND);
    }

    return product;
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async delete(@Param('id', MongoIdValidationPipe) id: string) {
    const product = await this.productService.delete(id);

    if (!product) {
      throw new HttpException(PRODUCT_NOT_FOUND_ERROR, HttpStatus.NOT_FOUND);
    }

    return product;
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Param('id', MongoIdValidationPipe) id: string,
    @Body() body: Partial<CreateProductDto>,
  ) {
    const product = await this.productService.update(id, body);

    if (!product) {
      throw new HttpException(PRODUCT_NOT_FOUND_ERROR, HttpStatus.NOT_FOUND);
    }

    return product;
  }

  @HttpCode(200)
  @Get('category/:category')
  async findByCategory(@Param('category') category: string) {
    return this.productService.findByCategory(category);
  }
}
