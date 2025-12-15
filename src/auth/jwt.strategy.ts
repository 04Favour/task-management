/* eslint-disable prettier/prettier */
import { ConfigService } from "@nestjs/config";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersRepository } from "./users.repository";
import { PassportStrategy } from "@nestjs/passport";
import { JwtPayload } from "./payload.interface";
import { Users } from "./users.entity";
import { UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";


export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(private _configService: ConfigService,@InjectRepository(Users) private userRepo: UsersRepository){
        super({
            secretOrKey: process.env.JWT_SECRET!,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false
        })
    }

    async validate(payload: JwtPayload): Promise<Users>{
        const {username} = payload
        const user = await this.userRepo.findOne({where:{username: username}})
        if(!user) throw new UnauthorizedException('You cannot access this route');
        return user
    }
}