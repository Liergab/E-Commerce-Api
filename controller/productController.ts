import { NextFunction, 
         Request, 
         Response }                from "express";
import { createProductSchema, 
        updateProductSchema }      from "../schema/product";
import { prismaClient }            from "..";
import { UnprocessableEntity }     from "../execptions/validation/validation";
import { ErrorCode }               from "../execptions/root";
import { NotFoundException }       from "../execptions/database/not-found-request";
import { BadRequestsExeption }     from "../execptions/validation/bad-request";
import { createProductRequestBody, 
        updateProductRequestBody } from "../types/product/types";
import { InternalException }       from "../execptions/server/internal-exception";


/* 
    Path: path api/product/
    method: Post
    purpose: create product

*/

export const createProduct = async(req:Request<{},{},createProductRequestBody>, res:Response, next:NextFunction) => {
    try {
        createProductSchema.parse(req.body)
        const {name,  description, price, tags} = req.body

        const tagsArray = Array.isArray(tags) ? tags : [tags];

        const tagsString = tagsArray.join(', ');

        const product = await prismaClient.product.create({
            data:{name, description, price, tags:tagsString}
        })

        res.status(201).json({data:product})

    } catch (err:any) {
        next(
            new UnprocessableEntity(
                err?.issues,
                'Unprocessable Entity',
                ErrorCode.UNPROCESSABLE_ENTITY
            )
        )
    }
}

/* 
    Path: path api/product/id
    method: UPDATE
    purpose: update product

*/

export const updateProduct = async(req:Request, res:Response, next:NextFunction) => {
    try {
        updateProductSchema.parse(req.body)
        const {id} = req.params 
        const {name, description, price, tags} = req.body as updateProductRequestBody
        
        const findId = await prismaClient.product.findUnique({where:{id:Number(id)}})
        if(!findId){
            next(
                new NotFoundException(
                    'ID Not Found', 
                    ErrorCode.NOT_FOUND
                )
            );
        }

        const tagsArray = Array.isArray(tags) ? tags : [tags];
        const tagsString = tagsArray.join(', ');

        const product = await prismaClient.product.update({
            where:{
                id: Number(id),
            },

            data:{
                name,
                description,
                price,
                tags:tagsString
            }
        })

        if(!product){
            next(
                new BadRequestsExeption(
                    'Product update failed!', 
                     ErrorCode.BAD_REQUEST
                )
            )
        }

        res.status(201).json({data:product})
        
    } catch (err:any) {
        next(
            new UnprocessableEntity(
                err?.issues,
                'Unprocessable Entity',
                ErrorCode.UNPROCESSABLE_ENTITY
            )
        )
    }
}


/* 
    Path: path api/product/id
    method: DELETE
    purpose: delete product

*/

export const deleteProduct = async(req:Request,res:Response,next:NextFunction) => {
    try {
       const{id} = req.params

       const findId = await prismaClient.product.findUnique({where:{id:Number(id)}})

       if(!findId){
           next(
                new NotFoundException(
                    'ID Not Found',
                    ErrorCode.NOT_FOUND
                )
            );
       }

       const product = await prismaClient.product.delete({where:{id:Number(id)}})

       res.status(200).json('Successfully Deleted!')

    } catch (err:any) {
        next(
            new InternalException(
                'Internal Errror', 
                err?.issues,
                ErrorCode.INTERNAL_ERROR
            )
        )
    }
}

/* 
    Path: path api/product/all
    method: GET
    purpose: GET ALL product

*/

export const getAllProduct = async(req:Request, res:Response, next:NextFunction) => {
    try {
        const{page} = req.query
        const count = await prismaClient.product.count()
        const products = await prismaClient.product.findMany({
            skip:Number(page) || 0,
            take:5
        }) //pagination

        res.status(200).json({count, data: products })
    } catch (err:any) {
        next(
            new InternalException(
                'Internal Error',
                 err?.issues, 
                 ErrorCode.INTERNAL_ERROR 
            )
        )
    }
}

/* 
    Path: path api/product/:id
    method: GET
    purpose: GET  product BY ID

*/

export const getProductById = async(req:Request, res:Response, next:NextFunction) => {
    try {
        const{id} = req.params

        const product = await prismaClient.product.findUnique({where:{id:Number(id)}})
 
        if(!product){
            next(
                 new NotFoundException(
                     'ID Not Found',
                     ErrorCode.NOT_FOUND
                 )
             );
        }else{
            res.status(200).json({data:product})
        }
        
    } catch (err:any) {
        next(
            new InternalException(
                'Internal Error',
                 err?.issues, 
                 ErrorCode.INTERNAL_ERROR 
            )
        )
    }
}



