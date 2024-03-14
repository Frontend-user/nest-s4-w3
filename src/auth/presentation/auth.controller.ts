import {
    Body,
    Controller,
    Post,
    Response,
    UseGuards, HttpCode, HttpException, Get
} from "@nestjs/common";
import {LocalAuthGuard} from "../guards/local-auth.guard";
import {AuthService} from "../application/auth.service";
import {
    AccessRefreshTokens, EmailValidClass,LoginOrEmailPasswordModel, RegistrationDataClass
} from "../types/auth.types";
import {CommandBus} from "@nestjs/cqrs";
import { RegistrationUseCaseCommand} from "../application/use-cases/registration-use-case";
import {
    RegistrationEmailResendingUseCaseCommand
} from "../application/use-cases/registration-email-resending-use-case";


@Controller('/auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private commandBus: CommandBus,
    ) {
    }
    // @Get('/try')
    // getHello() {
    //     return this.commandBus.execute(
    //         new RegistrationUseCaseCommand({'a':'b'}),
    //     );
    // }

    @UseGuards(LocalAuthGuard)
    @HttpCode(200)
    @Post('/login')
    async login(@Response({passthrough:true}) res, @Body() body: LoginOrEmailPasswordModel): Promise<{
        accessToken: string
    } | void> {
        const {
            accessToken,
            refreshToken
        }: AccessRefreshTokens = await this.authService.login(body);
        if (accessToken && refreshToken) {

            res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true})

            return   {accessToken}
        }
        throw new Error('Something is not work')
    }

    @HttpCode(204)
    @Post('/registration')
    async registration(@Body() body: RegistrationDataClass) {
        const response = await this.commandBus.execute(
            new RegistrationUseCaseCommand(body),
        );
        if (!response) {
            throw new HttpException('Falied registration', 400)
        }
    }

    @HttpCode(204)
    @Post('/registration-email-resending')
    async registrationEmailResending(@Body() body: EmailValidClass) {

        const response = await this.commandBus.execute( new RegistrationEmailResendingUseCaseCommand(body.email))
        if (!response) {
            throw new HttpException({message: 'wrong email', field: "email"}, 400)
        }

    }

    @Post('/registration-confirmation')
    @HttpCode(204)
    async registrationConfirmation(@Body() body: any) {
        console.log(body)
        const response = await this.authService.registrationConfirmation(body.code)
        if (!response) {
            throw new HttpException({field: 'code', message: 'code in Invalid'}, 400)
        }

    }

}