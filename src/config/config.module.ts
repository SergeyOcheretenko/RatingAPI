import { Module } from '@nestjs/common';
import { ConfigService } from './config.service';
import 'dotenv/config';

@Module({
  providers: [ConfigService, { provide: 'ENV', useValue: process.env }],
  exports: [ConfigService, 'ENV'],
})
export class ConfigModule {}
