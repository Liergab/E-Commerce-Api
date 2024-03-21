import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import * as controller from '../controller/orderController'
const orderRouter = express.Router()

orderRouter.post('/',[authMiddleware], controller.createOrder)
orderRouter.get('/',[authMiddleware])
orderRouter.put('/:id',[authMiddleware])
orderRouter.get('/:id',[authMiddleware])




export default orderRouter