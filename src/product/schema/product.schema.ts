import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

class ProductCharacteristic {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  value: string;
}

export type ProductDocument = Product & Document;

export class Product {
  @Prop({ required: true })
  image: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  oldPrice: number;

  @Prop({ required: true })
  credit: number;

  @Prop({ required: true })
  calculatedRating: number;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  advantages: string;

  @Prop({ required: true })
  disAdvantages: string;

  @Prop({ required: true, type: [String] })
  categories: string[];

  @Prop({ required: true, type: [String] })
  tags: string[];

  @Prop({ required: true, _id: false, type: [ProductCharacteristic] })
  characteristics: ProductCharacteristic[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
