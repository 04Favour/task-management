/* eslint-disable prettier/prettier */

import {IsString, Matches, MaxLength, MinLength } from "class-validator";

export class AuthCredentialDto {
    @IsString()
    @MinLength(4)
    @MaxLength(15)
    username: string;

    @IsString()
    @MinLength(8)
    @Matches(/^(?=.*[a-z]{2,})(?=.*[A-Z]{1,})(?=.*[0-9]{1,})(?=.*[!@#\$%\^&\*]).{8,}$/, {message: 'Password is too weak. You need to input 2 minimum lowercase, 1 number minimum, 1 minimum Uppercase and 1 minumum special character'})
    password: string;
}