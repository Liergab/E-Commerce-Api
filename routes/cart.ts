import express from 'express';
import * as controller from '../controller/cartController'
import { authMiddleware } from '../middleware/authMiddleware';
const cartRouter = express.Router();

cartRouter.post('/', [authMiddleware], controller.addItemTocart)
cartRouter.delete('/:id', [authMiddleware], controller.deleteItemTocart)
cartRouter.put('/:id', [authMiddleware], controller.changeQuantity)
cartRouter.get('/',[authMiddleware], controller.getCart)



export default cartRouter