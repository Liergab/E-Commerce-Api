import { ErrorCode, httpExecption } from "../root";

export class ConflictRequestsExeption extends httpExecption{
    constructor(message:string, errorCode:ErrorCode){
        super(message, errorCode, 409, null);

    }
}