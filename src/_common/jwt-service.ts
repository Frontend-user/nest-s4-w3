import {JwtService} from "@nestjs/jwt";
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
import {Injectable} from '@nestjs/common';
import process from "process";

@Injectable()
export class MyJwtService {
    constructor( protected jwtService: JwtService) {
    }

    async createJWT(payload: { [key: string]: string }, expirationTime: string) {
        return await this.jwtService.signAsync(payload, {secret: process.env.JWT_SECRET, expiresIn: expirationTime})
    }

    async createRefreshToken(payload: { [key: string]: string }, expirationTime: string) {
        return await this.jwtService.signAsync(payload, {secret: process.env.REFRESH_TOKEN_SECRET, expiresIn: expirationTime})
        // async createRefreshToken(payload: { [key: string]: string }, newDeviceId?: string) {
        // return await jwt.sign(
        //     {
        //         userId: userId
        //         // deviceId: newDeviceId,
        //     },
        //     process.env.REFRESH_TOKEN_SECRET,
        //     {expiresIn: '20s'},
        // );
    }

    // async checkRefreshToken(token: string) {
    //   try {
    //     const result: any = await jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    //     const isFindUser = await this.usersQueryRepository.getUserById(
    //       new Types.ObjectId(result.userId),
    //     );
    //     return isFindUser ? result.userId : false;
    //   } catch (error) {
    //     return;
    //   }
    // }

    async getRefreshToken(token: string) {
        try {
            const result: any = await jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

            return result ? result : false;
        } catch (error) {
            return;
        }
    }

    // async checkToken(token: string) {
    //   try {
    //     const result: any = await jwt.verify(token, process.env.JWT_SECRET);
    //     const isFindUser = await this.usersQueryRepository.getUserById(
    //       new Types.ObjectId(result.userId),
    //     );
    //     return isFindUser ? result.userId : false;
    //   } catch (error) {
    //     return;
    //   }
    // }

    async generateSalt(saltNumber: number) {
        return await bcrypt.genSalt(saltNumber);
    }

    async generateHash(password: String, salt: string) {
        const hash = await bcrypt.hash(password, salt);
        if (hash) {
            return hash;
        }
        return false;
    }

    static async generateSalt(saltNumber: number) {
        return await bcrypt.genSalt(saltNumber);
    }

    static async generateHash(password: string, salt: string) {
        const hash = await bcrypt.hash(password, salt);
        if (hash) {
            return hash;
        }
        return false;
    }
}
