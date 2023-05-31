import { Inject, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import {
  ALREADY_REGISTERED_ERROR,
  USER_NOT_FOUND_ERROR,
  WRONG_PASSWORD_ERROR,
} from './auth.constants';
import { UserData } from './dto/auth.dto';
import { compare } from 'bcryptjs';
import { User } from '../../schemas/user.schema';
import { JwtService } from '@nestjs/jwt/dist';

export class AlreadyRegisteredException extends Error {}
export class UserNotFoundException extends Error {}
export class WrongPasswordException extends Error {}

@Injectable()
export class AuthService {
  constructor(
    @Inject(UserService) private readonly userService: UserService,
    @Inject(JwtService) private readonly jwtService: JwtService,
  ) {}

  async register(userData: UserData) {
    const user = await this.userService.findByEmail(userData.email);
    if (user) {
      throw new AlreadyRegisteredException(ALREADY_REGISTERED_ERROR);
    }

    return this.userService.create(userData);
  }

  async validateUser(userData: UserData): Promise<Pick<User, 'email'>> {
    const user = await this.userService.findByEmail(userData.email);
    if (!user) {
      throw new UserNotFoundException(USER_NOT_FOUND_ERROR);
    }

    const isPasswordCorrect = await compare(
      userData.password,
      user.passwordHash,
    );
    if (!isPasswordCorrect) {
      throw new WrongPasswordException(WRONG_PASSWORD_ERROR);
    }

    return { email: userData.email };
  }

  async login(payload: Pick<User, 'email'>) {
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
