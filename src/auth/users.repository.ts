/* eslint-disable prettier/prettier */
import { DataSource, Repository } from "typeorm";
import { Users } from "./users.entity";
import { ConflictException, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { AuthCredentialDto } from "./auth-credential.dto";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersRepository extends Repository<Users>{
    private Logger = new Logger(UsersRepository.name, {timestamp: true})
    constructor(private datasource: DataSource){
        super(Users, datasource.createEntityManager())
    }

    async createUser(authCredentialDto: AuthCredentialDto): Promise<void>{
        const {username, password} = authCredentialDto
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(password, salt)
        const user = this.create({
            username,
            password: hashedPassword
        })
        try{
            await this.save(user)
        }catch(error){
            this.Logger.error(`Error discovered`, error.stack)
            if(error.code === '23505') throw new ConflictException();
            throw new InternalServerErrorException()
        }
        
    }
}