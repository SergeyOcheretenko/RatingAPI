import { Module, Provider } from '@nestjs/common';
import { ConfigModule } from '../../config/config.module';
import { ConfigService } from '../../config/config.service';
import { TelegramService } from './telegram.service';
import { UserModule } from '../user/user.module';

const telegramConfigFactory: Provider = {
  provide: 'TELEGRAM_CONFIG',
  useFactory: (configService: ConfigService) =>
    configService.getTelegramConfig(),
  inject: [ConfigService],
};

@Module({
  imports: [ConfigModule, UserModule],
  providers: [TelegramService, telegramConfigFactory],
  exports: [TelegramService],
})
export class TelegramModule {}
