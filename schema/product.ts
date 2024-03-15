import {z} from 'zod';

export const createProductSchema = z.object({
    name        : z.string().min(1,'Name is required!'),
    description : z.string(),
    price       : z.number(),
    tags        : z.array(z.string()),
})

export const updateProductSchema = z.object({
    name        : z.string().optional(),
    description : z.string().optional(),
    price       : z.number().optional(),
    tags        : z.array(z.string()).optional(),
})