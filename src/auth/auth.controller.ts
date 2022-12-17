import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { UserData } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  @Post('register')
  async register(@Body() dto: UserData) {}

  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: UserData) {}
}
