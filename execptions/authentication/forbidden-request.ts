import { ErrorCode, httpExecption } from "../root"

export class ForbiddenRequestException extends httpExecption{
    constructor(message:string, errorCode:ErrorCode){
        super(message, errorCode, 403, null);
    }
}