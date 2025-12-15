/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {InternalServerErrorException, Logger, ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
dotenv.config()

//  console.log(process.env.DB_PASSWORD)

async function bootstrap() {
  const logger = new Logger()
  const app = await NestFactory.create(AppModule);
  app.enableCors()
  app.useGlobalPipes(new ValidationPipe({
    forbidNonWhitelisted: true,
    whitelist: true
  }));
  const port = process.env.PORT
  if(port === undefined) throw new InternalServerErrorException()
  await app.listen(port, ()=> logger.log(`Server running on port: ${port}`));
}
bootstrap();
