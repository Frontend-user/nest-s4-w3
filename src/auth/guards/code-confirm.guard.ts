import {Injectable, CanActivate, ExecutionContext} from '@nestjs/common';
import {Observable} from 'rxjs';
import {UsersQueryRepository} from "../../users/repositories/users.query-repository";
import {add} from "date-fns/add";

@Injectable()
export class CodeConfirmGuard implements CanActivate {
    constructor(protected usersQueryRepository: UsersQueryRepository) {
    }

    async canActivate(context: ExecutionContext): Promise<any> {
        const request = context.switchToHttp().getRequest();
        const res = context.switchToHttp().getResponse();
        // return validateRequest(request);
        // const user = await this.usersQueryRepository.getUserEmailByConfirmCode(request.body.code)
const user = 's'
        let error: any
        if (!user) {
            error = {
                message: 'confirmation code is incorrect',
                field: 'code'
            }
        }
        // } else if (user.isConfirmed) {
        //     error = {
        //         message: 'confirmation code already been applied',
        //         field: 'code'
        //     }
        // } else if (user.emailConfirmation.expirationDate < add(new Date(), {hours: 0, minutes: 0})) {
        //     error = {
        //         message: 'confirmation code expired',
        //         field: 'code'
        //     }
        // }

        const errorsMessages: any = []
        if (error) {
            errorsMessages.push(error)
        } else {
            return true
        }
        res.status(400).send({errorsMessages})

    }
}