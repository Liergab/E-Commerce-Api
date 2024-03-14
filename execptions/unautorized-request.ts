import { ErrorCode, httpExecption } from "./root"

export class UnautorizedRequestException extends httpExecption{
    constructor(message:string, errorCode:ErrorCode){
        super(message, errorCode, 401, null);
    }
}