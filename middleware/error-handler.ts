import { NextFunction, Request, Response } from "express"
import { ErrorCode, httpExecption } from "../execptions/root"
import { InternalException } from "../execptions/internal-exception"

export const errorHandler = (method: Function) => {
    return async(req:Request, res:Response, next:NextFunction) => {
        try {
            await method(req,res,next)
        } catch (error:any) {
            let exception:httpExecption;
            if(error instanceof httpExecption){
                exception = error;
            }else{
                exception = new InternalException('Something went wrong', error ,ErrorCode.INTERNAL_ERROR )
            }
            next(exception)
        }
    }
}