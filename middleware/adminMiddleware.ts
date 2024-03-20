import { NextFunction, Response }      from "express";
import { AuthenticatedRequest }        from "../types/express";
import { UnautorizedRequestException } from "../execptions/authentication/unautorized-request";
import { ErrorCode }                   from "../execptions/root";

export const adminMiddleware = async(req:AuthenticatedRequest, res:Response, next:NextFunction) => {
    if(req.user?.role == "ADMIN"){
        next()
    }else{
        next(new UnautorizedRequestException('Unauthorized Your not Admin', ErrorCode.UNAUTHORIZED))
    }
}