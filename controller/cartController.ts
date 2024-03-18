import { NextFunction, Response } from "express";
import { AuthenticatedRequest }   from "../types/express";
import { createCart, updateCart }             from "../schema/cart";
import { NotFoundException }      from "../execptions/database/not-found-request";
import { ErrorCode }              from "../execptions/root";
import { prismaClient }           from "..";
import { cartCreateRequestBody, cartUpdateRequestBody }  from "../types/cart/types";
import { InternalException }      from "../execptions/server/internal-exception";
import { BadRequestsExeption }    from "../execptions/validation/bad-request";
import { ForbiddenRequestException } from "../execptions/authentication/forbidden-request";


/* 
    Path: path api/cart
    method: POST
    purpose:create cart 
*/

export const addItemTocart = async(req:AuthenticatedRequest,res:Response,next:NextFunction) => {
    try {
        createCart.parse(req.body)

        let hasError = false

        const {productId, quantity} = req.body as cartCreateRequestBody

        const findProductId = await prismaClient.product.findFirst({
            where:{
                id:productId
            }
        })

        if(!findProductId){
            next(new NotFoundException('Product Id not found!', ErrorCode.NOT_FOUND))
            hasError = true
        }

        const findProductIdInCart = await prismaClient.cartItem.findFirst({
            where:{
                productId:findProductId?.id
            }
        })

        if(findProductIdInCart){
            next(new BadRequestsExeption('Product already in cart', ErrorCode.BAD_REQUEST))
            hasError = true
        }
        if(!hasError){
            const addToCart = await prismaClient.cartItem.create({
                data:{
                    userId    :req?.user?.id!,
                    productId :findProductId?.id!,
                    quantity  :quantity
                }
            })
    
            res.status(201).json({data:addToCart})
        }
      
        
    } catch (err:any) {
        next( 
            new InternalException(
                'Internal Error',
                 err?.issues,
                 ErrorCode.UNPROCESSABLE_ENTITY
            )
        )
    }
}

export const deleteItemTocart = async(req:AuthenticatedRequest,res:Response,next:NextFunction) => {
    try {
        const {id} = req.params
        const convertIdToNumber = Number(id)
        let hasError = false

        const findCart = await prismaClient.cartItem.findFirstOrThrow({
            where:{
                id:convertIdToNumber
            }
        })

        if(findCart.userId !== req.user?.id){
            next(
                new ForbiddenRequestException('You cant delete the carts of other user', ErrorCode.FORBIDDEN))
            hasError = true
        }
        if(!hasError){
            const deleteCart = await prismaClient.cartItem.delete({
                where:{
                    id:findCart.id
                }
            })

            return res.status(200).json('Successfully Deleted!')
        }
    } catch (err:any) {
        next( 
            new InternalException(
                'Internal Error',
                 err?.issues,
                 ErrorCode.UNPROCESSABLE_ENTITY
            )
        )
    }
}


export const changeQuantity = async(req:AuthenticatedRequest,res:Response,next:NextFunction) => {
    try {
        updateCart.parse(req.body)

        const {id} = req.params

        const {quantity} = req.body as cartUpdateRequestBody

        const convertIdToNumber = Number(id);

        let hasError = false

        const findCartItem = await prismaClient.cartItem.findFirst({
            where:{
                id:convertIdToNumber
            }
        })
        if(!findCartItem){
            next(
                new NotFoundException(
                    'Id not found', 
                     ErrorCode.NOT_FOUND
                )
            )

            hasError = true
        }

        if(findCartItem?.userId !== req.user?.id){
            next(
                new ForbiddenRequestException(
                    'Cant change quantity of other user cart',
                     ErrorCode.FORBIDDEN
                )
            )
            hasError = true
        }

      

        if(!hasError){
            const updateQuantityCart = await prismaClient.cartItem.update({
                where:{
                    id:findCartItem?.id
                },
                data:{
                    quantity:quantity
                }
            })

            res.status(200).json({data:updateQuantityCart})
        }


    } catch (err:any) {
        next( 
            new InternalException(
                'Internal Error',
                 err?.issues,
                 ErrorCode.UNPROCESSABLE_ENTITY
            )
        )
    }
}


export const getCart = async(req:AuthenticatedRequest, res:Response, next:NextFunction) => {
    try {
        const cart = await prismaClient.cartItem.findMany({
            where:{
                userId:req.user?.id
            },
            include:{
                product:true
            }
        })
        res.status(200).json({
            name:req.user?.name,
            data:cart
        })
    } catch (err:any) {
        next( 
            new InternalException(
                'Internal Error',
                 err?.issues,
                 ErrorCode.UNPROCESSABLE_ENTITY
            )
        )
    }
}