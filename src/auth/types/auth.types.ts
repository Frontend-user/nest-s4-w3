import {IsEmail, IsString, Length, Validate} from "class-validator";
import {IsConfirmationCodeValid} from "../pipes/confirm-code.pipe";

export type AccessRefreshTokens = {
    accessToken: string
    refreshToken: string
}

export class LoginOrEmailPasswordClass {
    @Length(3)
    @IsString()
    loginOrEmail: string

    @IsString()
    @Length(6, 20)
    password: string
}

export class LoginOrEmailPasswordModel {
    @Length(3)
    @IsString()
    loginOrEmail: string

    @IsString()
    @Length(6, 20)
    password: string
}

export class RegistrationDataClass {
    @Length(3, 9)
    @IsString()
    login: string

    @IsEmail()
    email: string


    @IsString()
    @Length(6, 20)
    password: string
}

export class EmailValidClass {
    @IsEmail()
    email: string
}

export class ConfirmationCodeClass {
    @IsString()
    code: string

}