import {  httpExecption } from "../root"

export class UnprocessableEntity extends httpExecption{
    constructor(error:any, message:string,  errorCode:number){
        super(message, errorCode, 422, error);
    }
}

