import { NextFunction, Request, Response } from "express";
import { AuthenticatedRequest }   from "../types/express";
import { prismaClient }           from "..";
import { InternalException }      from "../execptions/server/internal-exception";
import { ErrorCode }              from "../execptions/root";
import { createAddressSchema } from "../schema/user";
import { createAddressRequestBody } from "../types/user/types";
import { NotFoundException } from "../execptions/database/not-found-request";
import { ForbiddenRequestException } from "../execptions/authentication/forbidden-request";

/* 
    Path: path api/user/address
    method: POST
    purpose:create Address of user

*/
export const createAddress = async (req:AuthenticatedRequest, res:Response, next:NextFunction) => {
    try {
        createAddressSchema.parse(req.body)
        const {lineOne, lineTwo, city, country, pincode} = req.body as createAddressRequestBody
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


/* 
    Path: path api/user/address
    method: DELETE
    purpose:dlete Address of user

*/

// export const getaddress = (req, res, next) => {
//     try {
        
//     } catch (error) {
        
//     }
// }





