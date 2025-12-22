/* eslint-disable prettier/prettier */
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialDto } from './auth-credential.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  SignUp(@Body() credentials: AuthCredentialDto){
    return this.authService.signUp(credentials)
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  SignIn(@Body() credentials: AuthCredentialDto){
    return this.authService.signIn(credentials)
  }

  @Get()
  greetings(){
    return "Greetings Oga Fred"
  }

  @UseGuards(AuthGuard())
  @Get('protected')
  Protected(@Req() req){
    console.log(req)
  }

  @Get('userId')
  @UseGuards(AuthGuard())
  getUserId(@GetUser('username') username: string){
    console.log(`my name is ${username}`)
    return {username}
  }
}
