import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

export enum TopLevelCategory {
  COURSES = 'courses',
  SERVICES = 'services',
  BOOKS = 'books',
  PRODUCTS = 'products',
}

export class UpworkData {
  @prop()
  count: number;

  @prop()
  juniorSalary: number;

  @prop()
  middleSalary: number;

  @prop()
  seniorSalary: number;
}

export class RatingPageAdvantage {
  @prop()
  title: string;

  @prop()
  description: string;
}

export interface RatingPageModel extends Base, TimeStamps {}
export class RatingPageModel {
  @prop({ enum: TopLevelCategory })
  firstCategory: TopLevelCategory;

  @prop()
  secondCategory: string;

  @prop({ unique: true })
  alias: string;

  @prop()
  title: string;

  @prop()
  category: string;

  @prop({ type: () => UpworkData })
  upwork?: UpworkData;

  @prop({ type: () => [RatingPageAdvantage] })
  advantages: RatingPageAdvantage[];

  @prop()
  seoText: string;

  @prop()
  tagsTitle: string;

  @prop({ type: () => [String] })
  tags: string[];
}
