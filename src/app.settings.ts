import {BadRequestException, INestApplication, ValidationPipe} from "@nestjs/common";
import cookieParser from 'cookie-parser';
import {useContainer} from "class-validator";
import {AppModule} from "./app.module";
import {HttpExceptionFilter} from "./exception.filter";

export const appSettings = (app: INestApplication) => {
    app.use(cookieParser())
    app.enableCors()
    useContainer(app.select(AppModule), {fallbackOnErrors: true});
    app.useGlobalPipes(new ValidationPipe(
        {

            transform: true,
            stopAtFirstError: true,
            exceptionFactory: (errors) => {
                const errorsMessages: any = []
                errors.forEach((e) => {
                    if (e.constraints) {
                        const s = Object.keys(e.constraints)
                        s.forEach((key) => {
                            if (e.constraints) {
                                errorsMessages.push({
                                    field: e.property,
                                    message: e.constraints[key]
                                })
                            }
                        })
                    }
                })
                throw new BadRequestException({errorsMessages})
            }

        }
    ))
    
    app.useGlobalFilters(new HttpExceptionFilter())///
}