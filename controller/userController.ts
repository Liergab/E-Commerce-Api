import { NextFunction, Request, Response } from "express";
import { AuthenticatedRequest }      from "../types/express";
import { prismaClient }              from "..";
import { InternalException }         from "../execptions/server/internal-exception";
import { ErrorCode }                 from "../execptions/root";
import { createAddressSchema,
         updateUserSchema }          from "../schema/user";
import { createAddressRequestBody }  from "../types/user/types";
import { NotFoundException }         from "../execptions/database/not-found-request";
import { ForbiddenRequestException } from "../execptions/authentication/forbidden-request";
import { Address }                   from "@prisma/client";
import { BadRequestsExeption }       from "../execptions/validation/bad-request";

/* 
    Path: path api/user/address
    method: POST
    purpose:create Address of user

*/
export const createAddress = async (req:AuthenticatedRequest, res:Response, next:NextFunction) => {
    try {
        createAddressSchema.parse(req.body)

        const {lineOne, lineTwo, city, country, pincode} = req.body as createAddressRequestBody

        let hasError = false

        const currentUser =  await prismaClient.address.findFirst({
            where:{
                userId : req.user?.id
            }
        })

        if(req.user?.id == currentUser?.userId){
            next(
                new BadRequestsExeption(
                    'You already have Address!',
                     ErrorCode.BAD_REQUEST
                )
            )

            hasError = true
        }
        if(!hasError){

            const address = await prismaClient.address.create({
                data:{
                    lineOne,
                    lineTwo,
                    city,
                    country,
                    pincode,
                    userId:Number(req?.user?.id)
                }
            })
            res.status(201).json({data:address})
            
        }
        
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

//################################################################################################################//
/* 
    Path: path api/user/address
    method: DELETE
    purpose:dlete Address of user

*/

export const deleteAddress = async(req:AuthenticatedRequest, res:Response, next:NextFunction) => {
    try {
        const {id} = req.params

        const convertIdToNumber = Number(id)

        const findUserId = await prismaClient.address.findFirst({where:{id:convertIdToNumber}})

        if(findUserId?.userId !== req?.user?.id){
            next( 
                new ForbiddenRequestException(
                    'You cant delete others address',
                     ErrorCode.FORBIDDEN))
        }
        
        if(!convertIdToNumber){
            next(
                new NotFoundException(
                    'Id not found!',
                     ErrorCode.NOT_FOUND
                )
            )
        }else{
            await prismaClient.address.delete({
                where:{
                    id:convertIdToNumber
                }
            })

            res.status(200).json('Successfully Deleted!')
        }
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

//################################################################################################################//
/* 
    Path: path api/user/address
    method: DELETE
    purpose:dlete Address of user

*/

export const getaddress = async(req:AuthenticatedRequest, res:Response, next:NextFunction) => {
    try {
        const address = await prismaClient.address.findMany({
            where:{
                userId:req?.user?.id
            },
            include:{
                user:true
            },
        })

        res.status(200).json({data:address})

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

//################################################################################################################//
/* 
    Path: path api/user/id
    method: PUT
    purpose:UPDATE of user

*/

export const updateUser = async(req:AuthenticatedRequest, res:Response, next:NextFunction) => {
  
    try {
        
        updateUserSchema.parse(req.body)

        const{name, defaultBillingAddress, defaultShippingAddress} = req.body
        let hasError = false;       

          const ShippingAddress:Address = await prismaClient.address.findFirstOrThrow({
                   where:{id:defaultShippingAddress}
            })
                
            if(ShippingAddress.userId !== req?.user?.id){
                next( 
                    new ForbiddenRequestException(
                        'Address shipping does not belong to user',
                         ErrorCode.FORBIDDEN
                    )
                )
                hasError = true;
            }
                  
            const BillingAddress:Address = await prismaClient.address.findFirstOrThrow({
                where:{id:defaultBillingAddress}
            })
            if(BillingAddress.userId !== req?.user?.id){
                next( 
                    new ForbiddenRequestException(
                        'Address billing does not belong to user',
                         ErrorCode.FORBIDDEN
                    )
                )
                hasError = true;
            }
    
           if(!hasError){
                const user = await prismaClient.user.update({
                    where:{
                        id:req?.user?.id
                    },
                    data:{
                        name,
                        defaultBillingAddress,
                        defaultShippingAddress
                    }
                })
            
                return res.status(200).json({data:user})
           }
    
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

//################################################################################################################//
/* 
    Path: path api/user/
    method: get
    purpose:get all user

*/

export const listUser = async(req:Request, res:Response, next:NextFunction) => {
    try {
             const{page} = req.query
        const user = await prismaClient.user.findMany({
            skip:Number(page) || 0,
            take:5,
            select:{
                id        : true,
                name      : true,
                role      : true,
                email     : true,
                createAt  : true,
                updatedAt : true,
                defaultShippingAddress:true,
                defaultBillingAddress:true
            }
        })
        res.status(200).json({data:user})
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

//################################################################################################################//
/* 
    Path: Path api/user/id
    method: GET
    purpose:Get  user by id

*/

export const getUserById = async(req:Request, res:Response, next:NextFunction) => {
    try {
        const{id} = req.params
        const convertIdToNumber = Number(id)
        const user = await prismaClient.user.findFirst({
            where:{
                id:convertIdToNumber
            },
            select:{
                id        : true,
                name      : true,
                role      : true,
                email     : true,
                createAt  : true,
                updatedAt : true,
                defaultShippingAddress:true,
                defaultBillingAddress:true
            }
        })
        if(user){
            res.status(200).json({data:user})
        }else{
            next(
                new NotFoundException(
                    'Id not found', 
                    ErrorCode.NOT_FOUND
                )
            )
        }
      
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
//################################################################################################################//
/* 
    Path: path api/user/id/role
    method: PUT
    purpose:Change user role

*/
export const changeUserRole = async(req:Request, res:Response, next:NextFunction) => {
    try {
        const{id} = req.params
        const {role} = req.body
        const convertIdToNumber = Number(id)
        const currentUser = await prismaClient.user.findUnique({
            where: { id: convertIdToNumber },
          });
      
          if (!currentUser) {
            return res.status(404).json({ message: 'User not found' });
          }
        const user = await prismaClient.user.update({
            where:{
                id:convertIdToNumber
            },
            data:{
                role: currentUser.role === 'ADMIN' ? 'USER' : 'ADMIN',
            }
        })
        return res.status(200).json({data:user})
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






