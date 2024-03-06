import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';
import {UsersQueryRepository} from "../../users/repositories/users.query-repository";

@ValidatorConstraint({async: true})
export class IsConfirmationCodeValidConstraint implements ValidatorConstraintInterface {
    constructor(protected usersQueryRepository: UsersQueryRepository) {
    }

    async validate(userName: any, args: ValidationArguments) {
        const getUser = await this.usersQueryRepository.getUserEmailByConfirmCode(userName)
        if(getUser){
            if(getUser.isConfirmed){
                return false
            }
            if(!getUser.isConfirmed){
                return true
            }

        }
        return false



    }
}

export function IsConfirmationCodeValid(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: {
                message:`Confirmation code is incorrect, expired or already been applied`,
            },
            constraints: [],
            validator: IsConfirmationCodeValidConstraint,
        });
    };
}

// import {ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments} from 'class-validator';
//
// @ValidatorConstraint({name: 'customText', async: false})
// export class CustomTextLength implements ValidatorConstraintInterface {
//     validate(code: string, args: ValidationArguments) {
//         console.log(code)
//         let error = {
//             message: 'confirmation code is incorrect',
//             field: 'code'
//         }
//         const errorsMessages: any = []
//         if (error) {
//             errorsMessages.push(error)
//         } else {
//             return true
//         }
//         if (true) {
//             return {errorsMessages}
//         }
//         // return code.length > 1 && code.length < 10; // для асинхронных проверок здесь должен быть возвращен Promise<boolean>
//     }
//
//     defaultMessage(args: ValidationArguments) {
//         // здесь можно предоставить сообщение об ошибке по умолчанию, если проверка не пройдена
//         return 'Текст ($value) слишком короткий или слишком длинный!';
//     }
// }
