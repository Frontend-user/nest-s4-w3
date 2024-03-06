import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import mongoose, {HydratedDocument, SchemaTypes} from 'mongoose';
import {MyJwtService} from '../../_common/jwt-service';
import {CreateUserInputModelType} from "../types/users.types";

export type UserDocumentType = HydratedDocument<User>;
export type UserAccountDBMethodsType = {
    canBeConfirmed: () => boolean;
};

// export type PostModelType = Model<Post, {}, PostAccountDBMethodsType>;

// export type BlogModelType = Model<Blog, {}, BlogAccountDBMethodsType>
@Schema()
export class User {
    name: 'User';
    @Prop({type: SchemaTypes.Mixed, required: true}) accountData: UserAccountDataModel;

    @Prop()
    passwordSalt: string;

    @Prop()
    passwordHash: string;

    @Prop({type: SchemaTypes.Mixed, required: false})
    emailConfirmation: UserEmailConfirmationModel;

    @Prop()

    isConfirmed: boolean;
    @Prop()
    isCreatedFromAdmin: boolean;

    static async createUserEntity(user: CreateUserInputModelType, isReqFromSuperAdmin: boolean, confirmationCode?: string, confirmationDate?: Date): Promise<User> {
        const passwordSalt = await MyJwtService.generateSalt(10);
        const passwordHash = await MyJwtService.generateHash(user.password, passwordSalt);
        const userEntity: any = {
            accountData: {
                login: user.login,
                email: user.email,
                createdAt: new Date(),
            },
            passwordSalt,
            passwordHash,
            emailConfirmation: {
                confirmationCode: isReqFromSuperAdmin ? 'superadmin' : confirmationCode,
                expirationDate: isReqFromSuperAdmin ? 'superadmin' : confirmationDate,
            },
            isConfirmed: false,
            isCreatedFromAdmin: isReqFromSuperAdmin,
        };

        return userEntity;
    }
}

export const UserSchema = SchemaFactory.createForClass(User);
export const UserForTestModel = mongoose.model('User', UserSchema);
UserSchema.statics = {
    createUserEntity: User.createUserEntity,
};

export type createUserEntity = (
    user: UserCreateModel,
    isReqFromSuperAdmin: boolean,
) => Promise<User>;

export type UserCreateModel = {
    login: string;
    password: string;
    email: string;
};

export type UserViewModel = {
    id: string;
    login: string;
    email: string;
    createdAt: Date;
};
type UserAccountDataModel = {
    login: string;
    email: string;
    createdAt: Date;
};
type UserEmailConfirmationModel = {
    confirmationCode: string;
    expirationDate: Date;
};
