import {z} from 'zod';

export const createCart = z.object({
    productId : z.number(),
    quantity  : z.number()
})

export const updateCart = z.object({
    quantity : z.number()
})