/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { AuthCredentialDto } from './auth-credential.dto';
import * as bcrypt from 'bcrypt'
import { JwtPayload } from './payload.interface';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
    constructor(private usersRepository: UsersRepository, private jwtService: JwtService){}

    signUp(credentials: AuthCredentialDto){
        return this.usersRepository.createUser(credentials)
    }

    async signIn(credentials:AuthCredentialDto): Promise<{access_token: string}>{
        const {username, password} = credentials
        const user = await this.usersRepository.findOne({where: {username}})
        if (user && (await bcrypt.compare(password, user.password))) {
            const payload: JwtPayload = {username}
            const access_token: string = await this.jwtService.sign(payload)
            return {access_token}
        };
        throw new UnauthorizedException();
    }
}
