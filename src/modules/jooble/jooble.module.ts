import { Module, Provider } from '@nestjs/common';
import { ConfigService } from '../../config/config.service';
import { JoobleService } from './jooble.service';

const configFactory: Provider = {
  provide: 'JOOBLE_CONFIG',
  useFactory: (configService: ConfigService) => configService.getJoobleConfig(),
  inject: [ConfigService],
};

@Module({
  providers: [JoobleService, configFactory],
  exports: [JoobleService],
})
export class UpworkModule {}
