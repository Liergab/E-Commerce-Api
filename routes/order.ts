import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import * as controller from '../controller/orderController'
import { adminMiddleware } from '../middleware/adminMiddleware';
const orderRouter = express.Router()

orderRouter.post('/',[authMiddleware], controller.createOrder)
orderRouter.get('/user',[authMiddleware],  controller.getOrder) //order of the user who login
orderRouter.put('/:id',[authMiddleware], controller.cancelOrder)
orderRouter.get('/:id',[authMiddleware], controller.getOrderById)
orderRouter.get('/all/orders', [authMiddleware,adminMiddleware], controller.listAllOrder)
orderRouter.put('/:id/status',[authMiddleware,adminMiddleware], controller.changeStatus)
orderRouter.get('/user/:id', [adminMiddleware,adminMiddleware], controller.listUserOrder)



export default orderRouter