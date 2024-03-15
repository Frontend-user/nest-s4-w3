import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { MyJwtService } from "../../_common/jwt-service";
import { UsersQueryRepository } from "../../users/repositories/users.query-repository";
import { ExtractJwt, Strategy } from "passport-jwt";


@Injectable()
export class BasicBearerStrategy extends PassportStrategy(Strategy) {
  constructor(
    protected myJwtService: MyJwtService,
    protected usersQueryRepository: UsersQueryRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }
  // async validate(payload: any) {
  // return true
  // }
  // public validate = async (payload: any): Promise<boolean> => {
  // }
  public validate = async (payload: any): Promise<boolean> => {
    // if (
    //   process.env.SUPERADMIN_LOGIN === username &&
    //   process.env.SUPERADMIN_PASSWORD === password
    // ) {
    // return true;
    console.log(payload);
    // if (!payload.headers.authorization) {
    //   throw new UnauthorizedException();
    // }
    // const token = payload.headers.authorization!.split(" ")[1];
    //
    // const userId = await this.myJwtService.checkToken(token);
    const userId = payload.userId;
    console.log(payload,'payload');
    // const getUserByID = await this.usersQueryRepository.getUserById(userId);
    if (!userId) {
      throw new UnauthorizedException();
    } else {
      return true;
    }
  };
}
