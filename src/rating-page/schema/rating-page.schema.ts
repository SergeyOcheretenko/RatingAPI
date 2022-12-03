import { Prop, SchemaFactory } from '@nestjs/mongoose';
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

export class RatingPageAdvantage {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;
}

export type RatingPageDocument = RatingPage & Document;

export class RatingPage {
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

  @Prop({ required: true, type: UpworkData })
  upwork?: UpworkData;

  @Prop({ required: true, type: RatingPageAdvantage })
  advantages: RatingPageAdvantage[];

  @Prop({ required: true })
  seoText: string;

  @Prop({ required: true })
  tagsTitle: string;

  @Prop({ required: true, type: String })
  tags: string[];
}

export const RatingPageSchema = SchemaFactory.createForClass(RatingPage);
