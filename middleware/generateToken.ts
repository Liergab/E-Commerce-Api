import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../secret'

export const generateToken = (userId:number) => {
    return jwt.sign({userId}, JWT_SECRET)
   
}
