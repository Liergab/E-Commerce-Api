import express             from 'express';
import * as controller      from '../controller/productController'
import { authMiddleware }   from '../middleware/authMiddleware';
import { adminMiddleware }  from '../middleware/adminMiddleware';
const productRoutes = express.Router();

productRoutes.post('/',     [authMiddleware, adminMiddleware], controller.createProduct)
productRoutes.patch('/:id', [authMiddleware, adminMiddleware], controller.updateProduct)
productRoutes.delete('/:id',[authMiddleware, adminMiddleware], controller.deleteProduct)
productRoutes.get('/:id',   [authMiddleware, adminMiddleware], controller.getProductById)
productRoutes.get('/',   [authMiddleware, adminMiddleware], controller.getAllProduct)

export default productRoutes