
import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../types/express";
import { prismaClient } from "..";
import { InternalException } from "../execptions/server/internal-exception";
import { ErrorCode } from "../execptions/root";

/*
    path api/order/
    methos Post
    create order
*/
export const createOrder = async(req: AuthenticatedRequest, res:Response, next:NextFunction) => {
    try {

        /* transaction for multiple model or table operation  with single trasaction
        if one operation is failed it will roll back alll the operation and will not change the current data in table
        */
        return await prismaClient.$transaction(async(tx) => { 
            const cartItem = await tx.cartItem.findMany({
                where:{
                    userId:req.user?.id
                },
                include:{
                    product:true
                }
            })

            if(cartItem.length === 0){
              return res.json({message:'Cart is Empty'})
            }

            const price = cartItem.reduce((prev, current) => {
                return prev + (current.quantity * +current.product.price)
            },0)

            const address = await tx.address.findFirst({
                where:{
                    id:req.user?.defaultShippingAddress!
                }
            })

            const order = await tx.order.create({
                data:{
                    userId: req.user?.id!,
                    netAmount: price,
                    address: address?.formattedAddress!,
                    order_products:{
                        create: cartItem.map((cart) => {
                            return {
                                productId:cart.productId,
                                quantity: cart.quantity
                            }
                        })
                    }
                }
            })

            const orderEvent = await tx.orderEvent.create({
                data:{
                    orderId:order.id
                }
            })
            await tx.cartItem.deleteMany({
                where:{
                    userId:req.user?.id
                }
            })
            res.json(order)
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

/*
    path api/order/
    methos get
    get order
*/
export const getOrder = async(req: AuthenticatedRequest, res:Response, next:NextFunction) => {
    try {
        
    } catch (error) {
        
    }
}

/*
    path api/order/id
    methos put
    update order
*/
export const cancelOrder = async(req: AuthenticatedRequest, res:Response, next:NextFunction) => {
    try {
        
    } catch (error) {
        
    }
}

/*
    path api/order/id
    methos get
    getByid
*/
export const getOrderById = async(req: AuthenticatedRequest, res:Response, next:NextFunction) => {
    try {
        
    } catch (error) {
        
    }
}


