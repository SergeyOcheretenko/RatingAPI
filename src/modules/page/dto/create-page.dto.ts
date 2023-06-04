import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { TopLevelCategory } from '../../../schemas/page.schema';

export class UpworkData {
  @IsNumber()
  @IsNotEmpty()
  count: number;

  @IsNumber()
  @IsNotEmpty()
  juniorSalary: number;

  @IsNumber()
  @IsNotEmpty()
  middleSalary: number;

  @IsNumber()
  @IsNotEmpty()
  seniorSalary: number;
}

export class PageAdvantage {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}

export class CreatePageDto {
  @IsEnum(TopLevelCategory)
  @IsNotEmpty()
  firstCategory: TopLevelCategory;

  @IsNotEmpty()
  @IsString()
  secondCategory: string;

  @IsString()
  @IsNotEmpty()
  alias: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsOptional()
  @Type(() => UpworkData)
  @ValidateNested()
  upwork?: UpworkData;

  @IsArray()
  @Type(() => PageAdvantage)
  @ValidateNested()
  advantages: PageAdvantage[];

  @IsString()
  @IsNotEmpty()
  seoText: string;

  @IsNotEmpty()
  @IsString()
  tagsTitle: string;

  @IsArray()
  @IsString({ each: true })
  tags: string[];
}
