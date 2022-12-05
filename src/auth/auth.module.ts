import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { Auth, AuthSchema } from './schema/auth.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Auth.name, schema: AuthSchema }]),
  ],
  controllers: [AuthController],
})
export class AuthModule {}
