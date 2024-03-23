import express             from 'express';
import * as controller     from '../controller/userController'
import { authMiddleware }  from '../middleware/authMiddleware';
import { adminMiddleware } from '../middleware/adminMiddleware';

const userRouter = express.Router();

userRouter.post('/address',       [authMiddleware], controller.createAddress);
userRouter.delete('/address/:id', [authMiddleware], controller.deleteAddress);
userRouter.get('/address',        [authMiddleware], controller.getaddress);
userRouter.put('/',               [authMiddleware], controller.updateUser);
userRouter.get('/', [authMiddleware,adminMiddleware], controller.listUser);
userRouter.get('/get/:id', [authMiddleware,adminMiddleware], controller.getUserById);
userRouter.put('/:id/role', [authMiddleware,adminMiddleware], controller.changeUserRole)

export default userRouter