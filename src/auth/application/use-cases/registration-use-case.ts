import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { RegistrationDataClass } from "../../types/auth.types";
import { HttpException } from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";
import { add } from "date-fns/add";
import { User } from "../../../users/domain/users-schema";
import { UsersQueryRepository } from "../../../users/repositories/users.query-repository";
import { NodemailerService } from "../../../_common/nodemailer-service";
import { UsersRepository } from "../../../users/repositories/users.repository";

export class RegistrationUseCaseCommand {
  constructor(public userInputData: RegistrationDataClass) {}
}

@CommandHandler(RegistrationUseCaseCommand)
export class RegistrationUseCase implements ICommandHandler<RegistrationUseCaseCommand> {
  constructor(
    private usersQueryRepository: UsersQueryRepository,
    private nodemailerService: NodemailerService,
    private usersRepository: UsersRepository,
  ) {}

  async execute(command: RegistrationUseCaseCommand): Promise<boolean> {
    const userInputData = command.userInputData;
    const isExistEmail = await this.usersQueryRepository.getUserByEmailOrLogin(userInputData.email);
    const isExistLogin = await this.usersQueryRepository.getUserByEmailOrLogin(userInputData.login);
    if (isExistLogin) {
      throw new HttpException({ field: "login", message: "login is exist" }, 400);
    }
    if (isExistEmail) {
      throw new HttpException({ field: "email", message: "email is exist" }, 400);
    }
    const confirmationCode = process.env.LOCAL_CONFIRMATION_CODE || uuidv4()
    const confirmationDate = add(new Date(), { hours: 1, minutes: 3 });
    const userEmailEntity: User = await User.createUserEntity(userInputData, false, confirmationCode, confirmationDate);

    const mailSendResponse = await this.nodemailerService.send(
      userEmailEntity.emailConfirmation.confirmationCode,
      userInputData.email,
      "REGISTRATION",
    );
    if (mailSendResponse) {
      const userId = await this.usersRepository.createUser(userEmailEntity);
      return !!userId;
    }
    return false;
  }
}
