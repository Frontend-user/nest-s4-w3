import { Module } from "@nestjs/common";
import { AuthController } from "./presentation/auth.controller";
import { BasicStrategy } from "./strategies/basic.strategy";
import { AuthService } from "./application/auth.service";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { LocalStrategy } from "./strategies/local.strategy";
import { UsersModule } from "../users/users.module";
import { PassportModule } from "@nestjs/passport";
import { MyJwtService } from "../_common/jwt-service";
import { NodemailerService } from "../_common/nodemailer-service";
import { IsConfirmationCodeValidConstraint } from "./pipes/confirm-code.pipe";
import {
  RegistrationUseCase,
  RegistrationUseCaseCommand,
} from "./application/use-cases/registration-use-case";
import { CommandBus, CqrsModule } from "@nestjs/cqrs";

const authUseCases = [RegistrationUseCase];
const authUseCasesCommands = [RegistrationUseCaseCommand];
const services = [
  BasicStrategy,
  LocalStrategy,
  AuthService,
  MyJwtService,
  JwtService,
  NodemailerService,
  IsConfirmationCodeValidConstraint,
];

@Module({
  imports: [
    CqrsModule,
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: "123456",
      signOptions: { expiresIn: "10s" },
    }),
  ],
  controllers: [AuthController],
  providers: [...services, ...authUseCases, ...authUseCasesCommands],
  exports: [JwtService, MyJwtService],
})
export class AuthModule {}
