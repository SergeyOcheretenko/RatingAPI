import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { MONGO_ID_VALIDATION_ERROR } from './mongo-id.constants';

export class MongoIdValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type != 'param') return value;

    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException(MONGO_ID_VALIDATION_ERROR);
    }

    return value;
  }
}
