import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { FindByCategoryDto } from './dto/find-products.dto';
import { Product, ProductDocument } from '../../schemas/product.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async create(productData: CreateProductDto): Promise<Product> {
    const product = new this.productModel(productData);
    return product.save();
  }

  async getAll(): Promise<Product[]> {
    return this.productModel.aggregate([
      {
        $lookup: {
          from: 'feedbacks',
          localField: '_id',
          foreignField: 'productId',
          as: 'feedbacks',
        },
      },
      {
        $addFields: {
          feedbacksAmount: { $size: '$feedbacks' },
          rating: { $avg: '$feedbacks.rating' },
        },
      },
      { $unset: 'feedbacks' },
    ]);
  }

  async getById(id: string) {
    return (
      await this.productModel.aggregate([
        {
          $match: {
            _id: new Types.ObjectId(id),
          },
        },
        {
          $limit: 1,
        },
        {
          $lookup: {
            from: 'feedbacks',
            localField: '_id',
            foreignField: 'productId',
            as: 'feedbacks',
          },
        },
        {
          $addFields: {
            feedbacksAmount: { $size: '$feedbacks' },
            rating: { $avg: '$feedbacks.rating' },
          },
        },
        { $unset: 'feedbacks' },
      ])
    )[0];
  }

  async findByCategory({ category, limit }: FindByCategoryDto) {
    return this.productModel.aggregate([
      {
        $match: {
          categories: category,
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
      {
        $limit: limit,
      },
      {
        $lookup: {
          from: 'feedbacks',
          localField: '_id',
          foreignField: 'productId',
          as: 'feedbacks',
        },
      },
      {
        $addFields: {
          feedbacksAmount: { $size: '$feedbacks' },
          rating: { $avg: '$feedbacks.rating' },
        },
      },
      { $unset: 'feedbacks' },
    ]);
  }

  async delete(id: string): Promise<Product> {
    return this.productModel.findByIdAndDelete(id);
  }

  async update(id: string, productData: CreateProductDto): Promise<Product> {
    return this.productModel.findByIdAndUpdate(id, productData, { new: true });
  }
}
