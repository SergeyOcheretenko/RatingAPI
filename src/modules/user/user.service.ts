import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserData } from '../auth/dto/auth.dto';
import { User, UserDocument } from '../../schemas/user.schema';
import { genSalt, hash } from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async create(userData: UserData): Promise<User> {
    const salt = await genSalt(10);
    const passwordHash = await hash(userData.password, salt);
    const user = new this.userModel({ email: userData.email, passwordHash });
    return user.save();
  }

  findByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email }).exec();
  }
}
