export class ObjectResult {
    status: string
    data: any
}

export class UserQueryResult {
    constructor(protected data: any) {
    }
}