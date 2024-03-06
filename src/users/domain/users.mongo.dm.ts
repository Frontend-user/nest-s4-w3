import {UserDocumentType, UserViewModel} from './users-schema';
import {UserResponseType, WithId} from '../types/users.types';
import {UsersQueryTransformTypes} from "../pipes/users-query-transform-pipe";

export class UsersMongoDataMapper {
    static toView(user: UserDocumentType): WithId<UserViewModel> {
        return {
            id: String(user._id),
            login: user.accountData.login,
            email: user.accountData.email,
            createdAt: user.accountData.createdAt,
        };
    }
    static createAndGetClearResponse(): UserResponseType {
        return {
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 0,
            items: [],
        };
    }
}
