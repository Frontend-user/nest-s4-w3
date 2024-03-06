import {Module} from '@nestjs/common';
import {AuthController} from "./presentation/auth.controller";
import {BasicStrategy} from "./strategies/basic.strategy";
import {AuthService} from "./application/auth.service";
import {JwtModule, JwtService} from "@nestjs/jwt";
import {LocalStrategy} from "./strategies/local.strategy";
import {UsersModule} from "../users/users.module";
import {PassportModule} from "@nestjs/passport";
import {MyJwtService} from "../_common/jwt-service";
import {NodemailerService} from "../_common/nodemailer-service";
import {IsConfirmationCodeValidConstraint} from "./pipes/confirm-code.pipe";

@Module({
    imports: [
        UsersModule,
        PassportModule,
        JwtModule.register({
            secret: '123456',
            signOptions: {expiresIn: '10s'},
        })
    ],
    controllers: [AuthController],
    providers: [BasicStrategy, AuthService, LocalStrategy,
        MyJwtService, JwtService, NodemailerService,
        IsConfirmationCodeValidConstraint],
    exports: [JwtService,MyJwtService]
})
export class AuthModule {
}
