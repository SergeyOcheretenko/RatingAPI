import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum TopLevelCategory {
  COURSES = 'courses',
  SERVICES = 'services',
  BOOKS = 'books',
  PRODUCTS = 'products',
}

export class UpworkData {
  @Prop({ required: true })
  count: number;

  @Prop({ required: true })
  juniorSalary: number;

  @Prop({ required: true })
  middleSalary: number;

  @Prop({ required: true })
  seniorSalary: number;
}

export class PageAdvantage {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;
}

export type PageDocument = Page & Document;

@Schema({ timestamps: true })
export class Page {
  @Prop({ required: true, enum: TopLevelCategory })
  firstCategory: TopLevelCategory;

  @Prop({ required: true })
  secondCategory: string;

  @Prop({ required: true, unique: true })
  alias: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: false, type: UpworkData })
  upwork?: UpworkData;

  @Prop({ required: true, type: PageAdvantage })
  advantages: PageAdvantage[];

  @Prop({ required: true })
  seoText: string;

  @Prop({ required: true })
  tagsTitle: string;

  @Prop({ required: true, type: [String] })
  tags: string[];
}

export const PageSchema = SchemaFactory.createForClass(Page);
