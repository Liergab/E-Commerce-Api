import {z} from 'zod';

export const createCart = z.object({
    productId : z.number(),
    quantity  : z.number()
})