import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  validateSync,
  IsEnum,
} from 'class-validator';
import { plainToClass, Transform } from 'class-transformer';

export enum Environment {
  DEV = 'dev',
  PROD = 'prod',
}

export class EnvironmentVariables {
  @Transform(({ value }) => value.toLowerCase())
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsString()
  @IsNotEmpty()
  PRODUCTION_MONGO_URL: string;

  @IsString()
  @IsOptional()
  DEVELOP_MONGO_URL?: string;
}

@Injectable()
export class ConfigService implements OnModuleInit {
  constructor(@Inject('ENV') private env: EnvironmentVariables) {}

  async onModuleInit() {
    this.env = this.validateConfig();
  }

  public getEnvironment() {
    return this.env.NODE_ENV;
  }

  public getProductionMongoConfig() {
    return {
      uri: this.env.PRODUCTION_MONGO_URL,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
  }

  public getDevelopMongoConfig() {
    return {
      uri: this.env.DEVELOP_MONGO_URL,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
  }

  private validateConfig() {
    const validatedConfig = plainToClass(EnvironmentVariables, this.env, {
      enableImplicitConversion: true,
    });
    const errors = validateSync(validatedConfig, {
      skipMissingProperties: false,
    });

    if (errors.length > 0) {
      throw new Error(errors.toString());
    }
    return validatedConfig;
  }
}
