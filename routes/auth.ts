import express          from 'express';
import * as controller  from '../controller/authController'
import { authMiddleware } from '../middleware/authMiddleware';

const authRouter = express.Router()

authRouter.post('/signup', controller.signup);
authRouter.post('/login', controller.login);
authRouter.get('/profile', authMiddleware, controller.me)
export default authRouter