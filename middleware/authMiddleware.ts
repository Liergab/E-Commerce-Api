import { NextFunction, Response }      from "express";
import  * as jwt                       from 'jsonwebtoken';
import { UnautorizedRequestException } from "../execptions/authentication/unautorized-request"
import { ErrorCode }                   from "../execptions/root";
import { JWT_SECRET }                  from "../secret";
import { prismaClient }                from "..";
import { AuthenticatedRequest }        from "../types/express";

export const  authMiddleware = async(req:AuthenticatedRequest, res:Response, next:NextFunction) => {
    let token 

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
        try {
            const payload = jwt.verify(token, JWT_SECRET) as any
            const user = await prismaClient.user.findFirst({
                where:{id:payload.userId},
                select:{
                    name:true,
                    email:true,
                    createAt:true,
                    updatedAt:true,
                    id:true,
                }
            })
            if(!user){
                next(new UnautorizedRequestException('Unauthorized', ErrorCode.UNAUTHORIZED))
            }
            req.user = user
            next();
        } catch (error) {
            next(new UnautorizedRequestException('Unauthorized', ErrorCode.UNAUTHORIZED))
        }
    }else{
    next(new UnautorizedRequestException('Unauthorized', ErrorCode.UNAUTHORIZED))
    }
}