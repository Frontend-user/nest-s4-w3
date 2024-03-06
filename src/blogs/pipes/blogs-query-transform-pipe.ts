import {ArgumentMetadata, Injectable, PipeTransform, Query} from '@nestjs/common';
import {SortParamsType} from "../../_common/types/query";
import {SortOrder} from "mongoose";
import {QueryUtilsClass} from "../../_common/query.utils";

@Injectable()
export class BlogsQueryTransformPipe implements PipeTransform<BlogsQueryTypes, BlogsQueryTransformTypes> {
    transform(blogsQuery: BlogsQueryTypes, metadata: ArgumentMetadata): any {
        let transformQueryData = QueryUtilsClass.getPagination(blogsQuery)

        let findQuery: any = {};
        if (blogsQuery.searchNameTerm) {
            findQuery = {
                'name': {$regex: String(blogsQuery.searchNameTerm), $options: 'i'},
            };
        }
        return {
            ...transformQueryData,
            findQuery
        }
    }
}

export class BlogsQueryTransformTypes {
    skip: number
    limit: number
    newPageNumber: number
    newPageSize: number
    sortParams: SortParamsType
    findQuery: any
}

export class BlogsQueryTypes {
    searchNameTerm?: string
    sortBy?: string
    sortDirection?: SortOrder
    pageNumber?: number
    pageSize?: number
}
