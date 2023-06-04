import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
  NotFoundException,
  Post,
} from '@nestjs/common';
import {
  AlreadyRegisteredException,
  AuthService,
  UserNotFoundException,
  WrongPasswordException,
} from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterDto) {
    try {
      return await this.authService.register(body);
    } catch (err) {
      if (err instanceof AlreadyRegisteredException) {
        throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
      }
      throw err;
    }
  }

  @HttpCode(200)
  @Post('login')
  async login(@Body() body: LoginDto) {
    try {
      const payload = await this.authService.validateUser(body);
      return await this.authService.login(payload);
    } catch (err) {
      if (err instanceof UserNotFoundException) {
        throw new HttpException(err.message, HttpStatus.NOT_FOUND);
      }

      if (err instanceof WrongPasswordException) {
        throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
      }

      throw err;
    }
  }
}
