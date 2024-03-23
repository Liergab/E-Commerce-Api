import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import * as controller from '../controller/orderController'
const orderRouter = express.Router()

orderRouter.post('/',[authMiddleware], controller.createOrder)
orderRouter.get('/user',[authMiddleware],  controller.getOrder)
orderRouter.put('/:id',[authMiddleware], controller.cancelOrder)
orderRouter.get('/:id',[authMiddleware], controller.getOrderById)




export default orderRouter