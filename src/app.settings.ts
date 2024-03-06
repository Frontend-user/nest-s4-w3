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
                        let s = Object.keys(e.constraints)
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
                // errors.forEach((e) => {
                //     const constraintKeys = Object.keys(e.constraints)
                //     constraintKeys.forEach((ckey) => {
                //         errorsMessages.push(
                //             {
                //                 message: e.constraints[ckey],
                //                 field: e.property
                //             }
                //         )
                //     })
                //
                // })
                throw new BadRequestException({errorsMessages})
            }

        }
    ))
    app.useGlobalFilters(new HttpExceptionFilter())///
}