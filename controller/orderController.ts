
import { NextFunction, Request, Response } from "express";
import { AuthenticatedRequest } from "../types/express";
import { prismaClient } from "..";
import { InternalException } from "../execptions/server/internal-exception";
import { ErrorCode } from "../execptions/root";
import { NotFoundException } from "../execptions/database/not-found-request";
import { ForbiddenRequestException } from "../execptions/authentication/forbidden-request";

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

            if(!address){
                return res.json({message:'Update and set up your Billing and shipping address'})
            }

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
// ###############################################################################################################//
/*
    path api/order/
    methos get
    get order
*/
export const getOrder = async(req: AuthenticatedRequest, res:Response, next:NextFunction) => {
    try {
        const order = await prismaClient.order.findMany({
            where:{
                userId:req.user?.id
            }
        })
        return res.status(200).json({data:order})
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
// ###############################################################################################################//
/*
    path api/order/id
    methos put
    update order
*/
export const cancelOrder = async(req:AuthenticatedRequest, res:Response, next:NextFunction) => {
    try {
        const {id} = req.params
        
        const convertIdIntoNumber = Number(id)

        return await prismaClient.$transaction(async(tx)=>{

            const order = await tx.order.update({
                where:{
                    id:convertIdIntoNumber
                },
                data:{
                    status:'CANCELLED'
                }
            }) 

            if(order?.userId !== req.user?.id){
                next(
                    new ForbiddenRequestException(
                        'You can update others detail',
                         ErrorCode.FORBIDDEN
                    )
                )
            }

             await tx.orderEvent.updateMany({
                where:{
                    orderId:order.id
                },
                data:{
            
                    status:'CANCELLED'
                }
            })
    
            if(order){
                res.status(200).json({message:'Cancel Order!'})
            }else{
                next(
                    new NotFoundException(
                        'Order not found',
                        ErrorCode.NOT_FOUND
                    )
                )
            }

        })
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

// ###############################################################################################################//
/*
    path api/order/id
    methos get
    getByid
*/
export const getOrderById = async(req: AuthenticatedRequest, res:Response, next:NextFunction) => {
    try {
        const{id} = req.params
        const convertIdToNumber = Number(id)

        const order = await prismaClient.order.findFirst({
            where:{
                id:convertIdToNumber
            },
            include:{
                order_events:true,
                order_products:true
            }
        })
        if(order){
            res.status(200).json({data:order})
        }else{
            next(
                 new NotFoundException(
                    'Order not found (ID)',
                     ErrorCode.NOT_FOUND
                )
            )
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

// ###############################################################################################################//
/*
    path api/order/id
    method get
    Get All Order
*/

export const listAllOrder = async(req:Request, res:Response, next:NextFunction) => {
    try {
        let whereClause ={}
        const {status} = req.query
        const{page} = req.query
        if(status){
            whereClause={
                status
            }
        }
        const order = await prismaClient.order.findMany({
            where:whereClause,
            skip: Number(page) || 0,
            take:5,
            
        })
       
        res.status(200).json({data:order})
         
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

// ###############################################################################################################//
/*
    path api/order/id/status
    method PUT
    Chnage Status
*/

export const changeStatus = async(req:Request, res:Response, next:NextFunction) => {
    try {
        const{id} = req.params
        const{status} = req.body
        const convertIdIntoNumber = Number(id)

        return await prismaClient.$transaction(async(tx) => {
            const order = await tx.order.update({
                where:{
                    id:convertIdIntoNumber
                },
                data:{
                    status:status
                }
            })
            if(!order){

              return res.status(404).json({message:'Id not found'})
            }

            await tx.orderEvent.updateMany({
                where:{
                    orderId:order.id
                },
                data:{
                    status:status
                }
            })

           res.status(200).json({data:order})
        })
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

// ###############################################################################################################//
/*
    path api/order/id/status
    method PUT
    Chnage Status
*/

export const listUserOrder = async(req:Request, res:Response, next:NextFunction) => {
    try {
        let whereClause:any = {
            userId : Number(req.params.id)
        }
        const {status} = req.query

        if(status){
            whereClause = {
                ...whereClause,
                status
            }
        }

        const orders = await prismaClient.order.findMany({
            where: whereClause,
            skip: Number(req.query.page) || 0,
            take: 5
        })
        res.json(orders)

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
