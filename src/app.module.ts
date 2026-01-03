/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TaskModule } from './task/task.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CustomSerializeInterceptor } from './transform.interceptor';
import { ConfigValidation } from './common/schema.validation';

@Module({
  imports: [TaskModule, ConfigModule.forRoot({isGlobal: true,
    envFilePath:[`.env.stage.${process.env.STAGE}`],
    validationSchema: ConfigValidation
  }), TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (configService:ConfigService)=> ({
      type: 'postgres',
      host: configService.get<string>('DB_HOST'),
      username: configService.get<string>('DB_USERNAME'),
      port: configService.get<number>('DB_PORT'),
      password: configService.get<string>('DB_PASSWORD'),
      database: configService.get<string>('DATABASE'),
      ssl: process.env.STAGE === 'prod'?{rejectUnauthorized: false}: false,
      autoLoadEntities: true,
      synchronize: false,
      migrations: [__dirname + '/migrations/*{.ts,.js}'],
      migrationsRun: true
    }),
    // autoLoadEntities: true,
    // synchronize: true,
    // type: 'postgres',
    // host: process.env.DB_HOST,
    // port: Number(process.env.DB_PORT),
    // username: process.env.DB_USERNAME,
    // password: process.env.DB_PASSWORD,
    // database: process.env.DATABASE,
  }), AuthModule],
  controllers: [],
  providers: [{
    provide: APP_INTERCEPTOR,
    useClass: CustomSerializeInterceptor
  }],
})
export class AppModule {}
