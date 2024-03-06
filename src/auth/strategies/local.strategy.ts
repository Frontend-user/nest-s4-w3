import {Injectable, UnauthorizedException} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {Strategy} from 'passport-local';
import {AuthService} from "../application/auth.service";
import {UsersQueryRepository} from "../../users/repositories/users.query-repository";
import {LoginOrEmailPasswordModel} from "../types/auth.types";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super({
            usernameField: 'loginOrEmail',
        });
    }

    async validate(loginOrEmail:string,password:string): Promise<any> {
        const user = await this.authService.validateUser(loginOrEmail,password);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}
