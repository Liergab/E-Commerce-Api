import {z} from 'zod';

export const SignupSchema = z.object({
    name     : z.string().min(1,'Name is required'),
    email    : z.string().email().min(1, 'Email is required'),
    password : z.string().min(8, 'Password atleast 8 character').max(12)
});

export const LoginSchema = z.object({
    email    : z.string().email().min(1, 'Email is required'),
    password : z.string()
});