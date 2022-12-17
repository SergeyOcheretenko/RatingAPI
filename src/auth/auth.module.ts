import { Module } from '@nestjs/common';
import { UserRepositoryModule } from '../user-repository/user-repository.module';

@Module({
  imports: [UserRepositoryModule],
})
export class AuthModule {}
