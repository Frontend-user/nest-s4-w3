import {BasicStrategy as Strategy} from 'passport-http';
import {Injectable, UnauthorizedException} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            passReqToCallback: true
        });
    }

    public validate = async (req, username, password): Promise<boolean> => {
        if (
            process.env.SUPERADMIN_LOGIN === username &&
            process.env.SUPERADMIN_PASSWORD === password
        ) {
            return true;
        }
        throw new UnauthorizedException();
    }
}