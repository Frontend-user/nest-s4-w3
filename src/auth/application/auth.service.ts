import {  HttpException,Injectable } from "@nestjs/common";
import { UsersQueryRepository } from "../../users/repositories/users.query-repository";
import { MyJwtService } from "../../_common/jwt-service";
import { JwtService } from "@nestjs/jwt";

import {
  AccessRefreshTokens,
} from "../types/auth.types";
import { UsersRepository } from "../../users/repositories/users.repository";
import { NodemailerService } from "../../_common/nodemailer-service";

@Injectable()
export class AuthService {
  constructor(
    private readonly myJwtService: MyJwtService,
    private readonly jwtService: JwtService,
    private readonly usersQueryRepository: UsersQueryRepository,
    private readonly usersRepository: UsersRepository,
    private readonly nodemailerService: NodemailerService,
  ) {}

  async validateUser(loginOrEmail: string, password: string): Promise<{ userId: string } | null> {
    const getUserForAuth = await this.usersQueryRepository.getUserByEmailOrLogin(loginOrEmail);
    if (getUserForAuth) {
      const passwordSalt = getUserForAuth.passwordSalt;
      const passwordHash = getUserForAuth.passwordHash;
      const newPasswordHash = await this.myJwtService.generateHash(password, passwordSalt);
      if (newPasswordHash === passwordHash) {
        return { userId: String(getUserForAuth._id) };
      }
    }
    return null;
  }

  async login(user: any): Promise<AccessRefreshTokens | any> {
    const userId:any = (await this.usersQueryRepository.getUserByEmailOrLogin(user.loginOrEmail))?._id
    if(!userId){
      return  {
        accessToken:false,
        refreshToken:false
      }
    }
    const payload = { userId};
    console.log(payload,'payload login');
    const payloadForRefreshToken = { userId: user.userId };
    const accessToken = await this.myJwtService.createJWT(payload, "10m");
    const refreshToken = await this.myJwtService.createRefreshToken(payloadForRefreshToken, "10m");
    return {
      accessToken,
      refreshToken,
    };
  }


  async registrationConfirmation(code: string): Promise<boolean> {
    const getUser = await this.usersQueryRepository.getUserEmailByConfirmCode(code);
    if (getUser) {
      if (getUser.isConfirmed) {
        throw new HttpException({ message: "code is confirmed", field: "code" }, 400);
      }
      if (!getUser.isConfirmed) {
        await this.usersRepository.updateIsConfirmed(code, true);
        return true;
      }

      return false;
    }
    return false;
  }

}
