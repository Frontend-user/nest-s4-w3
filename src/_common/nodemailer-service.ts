import {Injectable} from "@nestjs/common";

const nodemailer = require("nodemailer");

@Injectable()
export class NodemailerService  {
    async send(confirmationCode: string, emailToSend: string,RESENDING?:string) {
        try {
            const transporter = await nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: "robersargsyan2023@gmail.com",
                    pass: "vqcubthqzapwnboe",
                },
            });

            const info = await transporter.sendMail({
                from: '"Fred Foo 👻" <robersargsyan2023@gmail.com>',
                to: emailToSend,
                subject: "Hello ✔",
                text: `Hello world?`,
                html: ` <h1>Thank for your registration</h1>
 <p>To finish registration please follow the link below:
 ${confirmationCode}///${RESENDING}
     <a href='https://somesite.com/confirm-email?code=${confirmationCode}'>complete registration</a>
 </p>
`,
            });
            return true
        } catch (err: any) {
            console.error('Ошибка в отправке писем: ', err.body.responseCode)
            return false
        }

    }
    async sendRecoveryCode(recoveryCode: string, emailToSend: string) {
        try {
            const transporter = await nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: "robersargsyan2023@gmail.com",
                    pass: "vqcubthqzapwnboe",
                },
            });

            const info = await transporter.sendMail({
                from: '"Fred Foo 👻" <robersargsyan2023@gmail.com>',
                to: emailToSend,
                subject: "Hello ✔",
                text: `Hello world?`,
                html: `  <h1>Password recovery</h1>
       <p>To finish password recovery please follow the link below:
       ${recoveryCode}
          <a href='https://somesite.com/password-recovery?recoveryCode=${recoveryCode}'>recovery password</a>
      </p>
    
`,
            });
            return true
        } catch (err: any) {
            console.error('Ошибка в отправке писем: ', err.body.responseCode)
            return false
        }

    }
}