import {Model, Types} from 'mongoose';
import {InjectModel} from '@nestjs/mongoose';
import {Injectable} from '@nestjs/common';
import {User, UserDocumentType} from '../domain/users-schema';

@Injectable()
export class UsersRepository {
    constructor(@InjectModel(User.name) public userModel: Model<User>) {
    }

    async createUser(user: any): Promise<UserDocumentType | false> {
        const response = new this.userModel(user);
        const getCreatedUser = await response.save();

        return response ? getCreatedUser : false;
    }

    async deleteUser(id: string): Promise<boolean> {
        const response = await this.userModel.deleteOne({_id: new Types.ObjectId(id)});
        return response.deletedCount === 1 ? true : false;
    }

    async updateIsConfirmed(code: string, isConfirmed: boolean) {
        const response = await this.userModel.findOneAndUpdate({'emailConfirmation.confirmationCode': code},
            {isConfirmed: isConfirmed}
        )
        return response ? response : null
    }

    async updateUserConfirmationCode(userId: string, newConfirmationCode: string): Promise<null | UserDocumentType> {
        const response = await this.userModel.findOneAndUpdate({_id: new Types.ObjectId(userId)},
            {'emailConfirmation.confirmationCode': newConfirmationCode}
        )
        return response ? response : null
    }

    async deleteAllData(): Promise<true> {
        await this.userModel.deleteMany({});
        return true;
    }
}
