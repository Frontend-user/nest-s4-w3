import {SortOrder} from "mongoose";

export type SortParamsType = {
    [key: string]: SortOrder
}

export type  PaginationDataType = {
    skip:number
    limit:number
    newPageNumber:number
    newPageSize:number
    sortParams:SortParamsType
}