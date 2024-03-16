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

export const createAddressSchema = z.object({
    lineOne : z.string().min(1,'Lineone is required to fill up!'),
    lineTwo : z.string().optional(),
    pincode : z.string().min(1, 'Pincode is required!'),
    city    : z.string().min(1,'City is required to fill up!'),
    country : z.string().min(1,'Country is required to fill up!'),
})