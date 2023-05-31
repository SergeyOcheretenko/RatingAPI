import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../../schemas/user.schema';
import { genSalt, hash } from 'bcryptjs';
import { RegisterDto } from '../auth/dto/register.dto';

export type UserWithId = User & { _id: Types.ObjectId };

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async create(userData: RegisterDto): Promise<User> {
    const salt = await genSalt(10);
    const passwordHash = await hash(userData.password, salt);
    const user = new this.userModel({
      email: userData.email,
      username: userData.username,
      telegramId: userData.telegramId,
      passwordHash,
    });
    return user.save();
  }

  getAll(): Promise<UserWithId[]> {
    return this.userModel.find().exec();
  }

  getById(id: string): Promise<UserWithId> {
    return this.userModel.findById(id).exec();
  }

  getByUsername(username: string): Promise<UserWithId> {
    return this.userModel.findOne({ username }).exec();
  }

  getByEmail(email: string): Promise<UserWithId> {
    return this.userModel.findOne({ email }).exec();
  }

  update(id: string, userData: Partial<User>): Promise<UserWithId> {
    return this.userModel.findByIdAndUpdate(id, userData, { new: true }).exec();
  }

  delete(id: string): Promise<UserWithId> {
    return this.userModel.findByIdAndDelete(id).exec();
  }
}
