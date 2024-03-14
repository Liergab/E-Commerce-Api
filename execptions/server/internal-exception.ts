import {  httpExecption } from "./root"

export class InternalException extends httpExecption{
    constructor( message:string, errors:any,  errorCode:number){
        super(message, errorCode, 500, errors);
    }
}