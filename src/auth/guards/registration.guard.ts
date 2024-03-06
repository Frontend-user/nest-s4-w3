import {
    Injectable,
    CanActivate,
    ExecutionContext,
    BadRequestException,
    NotFoundException,
    HttpException
} from '@nestjs/common';
import {Observable} from 'rxjs';
import {UsersQueryRepository} from "../../users/repositories/users.query-repository";

@Injectable()
export class RegistrationGuard implements CanActivate {
    constructor(protected usersQueryRepository: UsersQueryRepository) {
    }

    async canActivate(context: ExecutionContext): Promise<any> {
        const request = context.switchToHttp().getRequest();
        const res = context.switchToHttp().getResponse();
        // return validateRequest(request);
        const isExistEmail = await this.usersQueryRepository.getUserByEmailOrLogin(request.body.email)
        const isExistLogin = await this.usersQueryRepository.getUserByEmailOrLogin(request.body.login)
        const emailError = {
            message: 'email is exist',
            field: 'email'
        }
        const loginError = {
            message: 'login is exist',
            field: 'login'
        }

        if (!isExistEmail && !isExistLogin) {
            return true
        } else {
            const errorsMessages: any = []
            if (isExistLogin) {
                throw new HttpException(loginError, 400)
            }
            if (isExistEmail) {
                throw new HttpException(emailError, 400)
            }
            // res.sendStatus(404),
            // throw new NotFoundException('W??????????????/')
            // res.status(400).send({errorsMessages})

        }
    }
}