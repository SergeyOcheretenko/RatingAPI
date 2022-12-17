import { Module } from '@nestjs/common';
import { UserRepositoryModule } from '../user-repository/user-repository.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [UserRepositoryModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
