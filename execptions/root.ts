export class httpExecption extends Error {
    message    : string;
    errorCode  : any;
    statusCode : number;
    errors     : ErrorCode;

    constructor(message:string, errorCode:ErrorCode, statusCode:number, errors:any ){
        super(message)
        this.message    = message
        this.errorCode  = errorCode
        this.statusCode = statusCode
        this.errors     = errors 
    }
}

export enum ErrorCode {
    NOT_FOUND             = 404,
    CONFLICT_REQUEST      = 409,
    INCORRECT_CREDENTIALS = 401,
    UNAUTHORIZED          = 401,
    BAD_REQUEST           = 400,
    UNPROCESSABLE_ENTITY  = 422,
    INTERNAL_ERROR        = 500,
    FORBIDDEN             = 403
}