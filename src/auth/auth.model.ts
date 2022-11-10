import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

export interface AuthModel extends Base, TimeStamps {}
export class AuthModel {
  @prop({ unique: true })
  email: string;

  @prop()
  passwordHash: string;
}
