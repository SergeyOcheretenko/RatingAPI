import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class AddSubscriberDto {
  @IsMongoId()
  @IsString()
  productId: string;

  @IsMongoId()
  @IsString()
  userId: string;
}
