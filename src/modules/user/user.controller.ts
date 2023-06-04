import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { MongoIdValidationPipe } from '../../pipes/mongo-id.pipe';
import { RegisterDto } from '../auth/dto/register.dto';
import {
  USER_HAS_NO_PERMISSION_ERROR,
  USER_NOT_FOUND_ERROR,
} from './user.constants';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getAll() {
    return this.userService.getAll();
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async getMe(@Request() req) {
    const user = await this.userService.getByEmail(req.user.email);

    if (!user) {
      throw new HttpException(USER_NOT_FOUND_ERROR, HttpStatus.NOT_FOUND);
    }

    return user;
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Request() req,
    @Param('id', MongoIdValidationPipe) id: string,
    @Body() body: Partial<RegisterDto>,
  ) {
    if (req.user.id !== id) {
      throw new HttpException(
        USER_HAS_NO_PERMISSION_ERROR,
        HttpStatus.FORBIDDEN,
      );
    }

    const user = await this.userService.update(id, body);

    if (!user) {
      throw new HttpException(USER_NOT_FOUND_ERROR, HttpStatus.NOT_FOUND);
    }

    return user;
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async delete(@Request() req, @Param('id', MongoIdValidationPipe) id: string) {
    if (req.user.id !== id) {
      throw new HttpException(
        USER_HAS_NO_PERMISSION_ERROR,
        HttpStatus.FORBIDDEN,
      );
    }

    const user = await this.userService.delete(id);

    if (!user) {
      throw new HttpException(USER_NOT_FOUND_ERROR, HttpStatus.NOT_FOUND);
    }

    return user;
  }
}
