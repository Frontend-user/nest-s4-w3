import {ArgumentMetadata, Injectable, PipeTransform} from '@nestjs/common';
import {SortParamsType} from "../../_common/types/query";
import {SortOrder} from "mongoose";
import {QueryUtilsClass} from "../../_common/query.utils";

@Injectable()
export class PostsQueryTransformPipe implements PipeTransform<PostsQueryTypes, PostsQueryTransformTypes> {
    transform(postsQuery: PostsQueryTypes, metadata: ArgumentMetadata): any {
        return QueryUtilsClass.getPagination(postsQuery)
    }
}

export class PostsQueryTransformTypes {
    skip: number
    limit: number
    newPageNumber: number
    newPageSize: number
    sortParams: SortParamsType
}

export class PostsQueryTypes {
    sortBy?: string
    sortDirection?: SortOrder
    pageNumber?: number
    pageSize?: number
}
