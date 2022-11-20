import { ConfigService } from '@nestjs/config';
import { TypegooseModuleOptions } from 'nestjs-typegoose';

function getMongoString(configService: ConfigService) {
  return (
    'mongodb://' +
    configService.get('MONGO_LOGIN') +
    ':' +
    configService.get('MONGO_PASSWORD') +
    '@' +
    configService.get('MONGO_HOST') +
    ':' +
    configService.get('MONGO_PORT') +
    '/' +
    configService.get('MONGO_AUTH_DATABASE')
  );
}

function getMongoOptions() {
  return {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true,
  };
}

export async function getMongoConfig(
  configService: ConfigService,
): Promise<TypegooseModuleOptions> {
  return {
    uri: getMongoString(configService),
    ...getMongoOptions(),
  };
}
