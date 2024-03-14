import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { RegistrationDataClass } from "../../types/auth.types";
import { HttpException } from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";
import { UsersQueryRepository } from "../../../users/repositories/users.query-repository";
import { NodemailerService } from "../../../_common/nodemailer-service";
import { UsersRepository } from "../../../users/repositories/users.repository";

export class RegistrationEmailResendingUseCaseCommand {
  constructor(public email: string) {}
}

@CommandHandler(RegistrationEmailResendingUseCaseCommand)
export class RegistrationEmailResendingUseCase implements ICommandHandler<RegistrationEmailResendingUseCaseCommand> {
  constructor(
    private usersQueryRepository: UsersQueryRepository,
    private nodemailerService: NodemailerService,
    private usersRepository: UsersRepository,
  ) {}

  async execute(command: RegistrationEmailResendingUseCaseCommand): Promise<boolean> {
    const email = command.email
    const getUserForAuth = await this.usersQueryRepository.getUserByEmailOrLogin(email);
    if (getUserForAuth) {
      if (getUserForAuth.isConfirmed) {
        return false;
      }
      const newConfirmationCode = uuidv4();
      const isUpdateUser = await this.usersRepository.updateUserConfirmationCode(String(getUserForAuth._id), newConfirmationCode);
      if (isUpdateUser) {
        await this.nodemailerService.send(newConfirmationCode, email, "RESENDING");
        // return newConfirmationCode
        return true;
      } else {
        return false;
      }
    }
    return false;
  }
}
