import {Model} from 'mongoose';
import {InjectModel} from '@nestjs/mongoose';
import {Injectable} from '@nestjs/common';
import {createUserEntity, User, UserDocumentType} from '../domain/users-schema';
import {UsersQueryTransformTypes} from "../pipes/users-query-transform-pipe";
import {UserQueryResult} from "../../_common/object-result";

@Injectable()
export class UsersQueryRepository {
    constructor(@InjectModel('User') private userModel: Model<User> & createUserEntity) {
    }

    async getUserByEmailOrLogin(loginOrEmail: String): Promise<UserDocumentType | null> {
        const response: UserDocumentType | null = await this.userModel.findOne({$or: [{'accountData.login': loginOrEmail}, {'accountData.email': loginOrEmail}]}).lean()
        return response ? response : null
    }

    async getUserEmailByConfirmCode(code: string): Promise<UserDocumentType | null> {
        const response: UserDocumentType | null = await this.userModel.findOne({'emailConfirmation.confirmationCode': code}).lean()
        return response ? response : null
    }

    async getUsers(usersQueries: UsersQueryTransformTypes): Promise<any> {
        const query = this.userModel.find(usersQueries.findQuery);
        const totalCount = this.userModel.find(usersQueries.findQuery);
        let users
        users = await query.sort(usersQueries.sortParams).skip(usersQueries.skip).limit(usersQueries.limit).lean();
        if (users.length > 0) {
            const allUsers = await totalCount.countDocuments();
            return {totalCount: allUsers, users: users};
        } else {
            return {totalCount: 0, users: []};
        }
    }
}
