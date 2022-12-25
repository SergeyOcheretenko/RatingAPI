import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class ProductCharacteristicDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  value: string;
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  image: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  oldPrice?: number;

  @IsNumber()
  @IsNotEmpty()
  credit: number;

  // calculatedRating: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  advantages: string;

  @IsString()
  @IsNotEmpty()
  disAdvantages: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  categories: string[];

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  tags: string[];

  @ValidateNested()
  @Type(() => ProductCharacteristicDto)
  @IsNotEmpty()
  characteristics: ProductCharacteristicDto[];
}
