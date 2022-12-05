import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductController } from './product.controller';
import { Product, ProductSchema } from './schema/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],
  controllers: [ProductController],
})
export class ProductModule {}
