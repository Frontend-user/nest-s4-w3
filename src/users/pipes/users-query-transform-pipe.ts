import {ArgumentMetadata, Injectable, PipeTransform} from '@nestjs/common';
import {SortParamsType} from "../../_common/types/query";

@Injectable()
export class UsersQueryTransformPipe implements PipeTransform<string, string> {
    transform(usersQuery: any, metadata: ArgumentMetadata): any {
        const newPageNumber = !usersQuery.pageNumber ? 1 : +usersQuery.pageNumber;
        const newPageSize = !usersQuery.pageSize ? 10 : +usersQuery.pageSize;
        const skip = (newPageNumber - 1) * newPageSize;
        const limit = newPageSize;

        let newSortBy: string
        if (usersQuery.sortBy) {
            newSortBy = `accountData.${usersQuery.sortBy}`;
        } else {
            newSortBy = 'accountData.createdAt';
        }
        const newSortDir = usersQuery.sortDirection ?? 'desc';
        let findQuery: any = {};
        if (usersQuery.searchLoginTerm || usersQuery.searchEmailTerm) {
            findQuery = {
                $or: [
                    {
                        'accountData.login': {
                            $regex: String(usersQuery.searchLoginTerm),
                            $options: 'i',
                        },
                    },
                    {'accountData.email': {$regex: String(usersQuery.searchEmailTerm), $options: 'i'}},
                ],
            };
        }
        const sortParams:SortParamsType = {};
        sortParams[newSortBy] = newSortDir;
        return {
            skip,
            limit,
            newPageNumber,
            newPageSize,
            sortParams,
            findQuery
        }
    }
}

export class UsersQueryTransformTypes {
    skip:number
    limit:number
    newPageNumber:number
    newPageSize:number
    sortParams:SortParamsType
    findQuery:any
}

