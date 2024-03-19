import dotenv from 'dotenv';
dotenv.config({path:'.env'});

export const  PORT = process.env.PORT || process.env.SUPPORT_PORT
export const JWT_SECRET = process.env.JWT_SECRET!
export const EMAIL_TEST = process.env.EMAIL_TEST!
export const EMAIL_TEST_APP = process.env.EMAIL_TEST_APP!