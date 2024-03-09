import dotenv from 'dotenv';
dotenv.config({path:'.env'});

export const  PORT = process.env.PORT || process.env.SUPPORT_PORT
export const JWT_SECRET = process.env.JWT_SECRET!