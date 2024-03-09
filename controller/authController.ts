import { Request,
         Response }            from 'express';
import { prismaClient }        from '..';
import { hashpassword, 
         passwordCompared }    from '../config/bcrypt';
import   jwt                   from 'jsonwebtoken'
import { JWT_SECRET } from '../secret';

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
export const signup = async(req:Request<{}, {}, SignupRequestBody>,res:Response) => {
    const {email, password, name} = req.body
    try {
        const user = await prismaClient.user.findFirst({where:{email}});
        if(user){
            res.status(400).json({error:'Email already Taken!'});
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
            res.status(404).json({error:'User not Created!'})
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({error:error});
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
export const login = async(req:Request<{},{}, loginRequestBody>, res:Response) => {
    const{email, password} = req.body
    try {
        const user = await prismaClient.user.findFirst({where:{email}});
        if(user && await passwordCompared({plain:password, hashPassword:user.password })){
           const token = jwt.sign({userId: user.id}, JWT_SECRET)
            res.status(200).json({
                id:user.id,
                name:user.name,
                email:user.email,
                password:user.password,
                createAt:user.createAt,
                token:token
            });
        }else{
            res.status(400).json({error:'Invalid Credentials'})
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({error:error});
    }
}


