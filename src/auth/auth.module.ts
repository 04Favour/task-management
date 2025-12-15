/* eslint-disable prettier/prettier */
import { Module,} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './users.entity';
import { UsersRepository } from './users.repository';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';


@Module({
  imports: [TypeOrmModule.forFeature([Users]), PassportModule.register({defaultStrategy: 'jwt'}), JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: await configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: await configService.get<number>('EXPIRES_IN'),
        },
      }),
      inject: [ConfigService],
    }),],
  controllers: [AuthController],
  providers: [AuthService, UsersRepository, JwtStrategy],
  exports: [JwtStrategy, PassportModule]
})
export class AuthModule {}
