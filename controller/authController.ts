import { NextFunction, Request,
         Response }                    from 'express';
import { prismaClient }                from '..';
import { hashpassword, 
         passwordCompared }            from '../config/bcrypt';
import { generateToken }               from '../middleware/generateToken';
import { BadRequestsExeption }         from '../execptions/bad-request';
import { ErrorCode }                   from '../execptions/root';
import { UnautorizedRequestException } from '../execptions/unautorized-request';
import { ConflictRequestsExeption }    from '../execptions/conflict-request';
import { UnprocessableEntity }         from '../execptions/validation';
import { SignupSchema }                from '../schema/user';

/*
    path api/auth/signup
    methos get
    signup
*/

type SignupRequestBody = {
    email    : string;
    password : string,
    name     : string
}
export const signup = async(req:Request<{}, {}, SignupRequestBody>,res:Response, next:NextFunction) => {
   
        SignupSchema.parse(req.body)
        const {email, password, name} = req.body
        const user = await prismaClient.user.findFirst({where:{email}});
        if(user){
            // res.status(400).json({error:'Email already Taken!'});
            next(new ConflictRequestsExeption('Email already Taken!', ErrorCode.CONFLICT_REQUEST))
        }
            const newUser = await prismaClient.user.create({
                data:{
                    email:email,
                    password: await hashpassword({password:password}),
                    name:name
                }
            });

        if(newUser){
            res.status(201).json({data:newUser});
        }else{
            next(new BadRequestsExeption('Failed to create Account!', ErrorCode.BAD_REQUEST))
        }

}


/* 
    Path: path api/auth/login
    method: Post
    purpose: signup

*/
type loginRequestBody = {
    email    : string;
    password : string;
}
export const login = async(req:Request<{},{}, loginRequestBody>, res:Response, next:NextFunction) => {
    const{email, password} = req.body;
    try {
        const user = await prismaClient.user.findFirst({where:{email}});
        if(user && await passwordCompared({plain:password, hashPassword:user.password })){
            const userId = user.id;
            res.status(200).json({
                id:user.id,
                name:user.name,
                email:user.email,
                createAt:user.createAt,
                token:generateToken(userId)
            });
        }else{
            
            next(new UnautorizedRequestException('Invalid Credentials', ErrorCode.INCORRECT_CREDENTIALS))
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({error:error});
    }
}


