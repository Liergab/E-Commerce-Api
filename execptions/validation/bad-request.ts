import { ErrorCode, httpExecption } from "../root";

export class BadRequestsExeption extends httpExecption{
    constructor(message:string, errorCode:ErrorCode){
        super(message, errorCode, 400, null);

    }
}