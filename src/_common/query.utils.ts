import {SortOrder} from 'mongoose';
import {PaginationDataType, SortParamsType} from "./types/query";

export class QueryUtilsClass {
    static getPagination(queryData:any):PaginationDataType {
        const newPageNumber = !queryData.pageNumber ? 1 : +queryData.pageNumber;
        const newPageSize = !queryData.pageSize ? 10 : +queryData.pageSize;
        const skip = (newPageNumber - 1) * newPageSize;
        const limit = newPageSize;
        let newSortBy: string
        if (queryData.sortBy) {
            newSortBy = queryData.sortBy;
        } else {
            newSortBy = 'createdAt';
        }
        const newSortDir:SortOrder = queryData.sortDirection ?? 'desc';
        const sortParams: SortParamsType = {};
        sortParams[newSortBy] = newSortDir;

        return {
            skip,
            limit,
            newPageNumber,
            newPageSize,
            sortParams,
        };
    }

    static __getUserSortingOR(searchLoginTerm?: string, searchEmailTerm?: string) {
        let findQuery: any = {};
        if (searchLoginTerm || searchEmailTerm) {
            findQuery = {
                $or: [
                    {
                        'accountData.login': {
                            $regex: String(searchLoginTerm),
                            $options: 'i',
                        },
                    },
                    {'accountData.email': {$regex: String(searchEmailTerm), $options: 'i'}},
                ],
            };
        }
        return findQuery;
    }

    static __getUserSorting(sortBy?: string, sortDirection?: any | string) {
        const sortQuery: any = {'accountData.createdAt': -1};
        if (sortBy) {
            delete sortQuery['accountData.createdAt'];
            sortQuery[`accountData.${sortBy}`] = sortDirection === 'asc' ? 1 : -1;
        }
        if (sortDirection && !sortBy) {
            sortQuery['accountData.createdAt'] = sortDirection === 'asc' ? 1 : -1;
        }
        return sortQuery;
    }
}

// [string, SortOrder][]
export type SortParamsModel = { [key: string]: SortOrder };
