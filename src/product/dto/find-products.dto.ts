import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class FindByCategoryDto {
  @IsString()
  @IsNotEmpty()
  category: string;

  @IsNumber()
  @IsNotEmpty()
  limit: number;
}
