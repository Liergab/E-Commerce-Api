import express          from 'express';
import * as controller  from '../controller/authController'
import { errorHandler } from '../middleware/error-handler';

const authRouter = express.Router()

authRouter.post('/signup', errorHandler(controller.signup))
authRouter.post('/login', errorHandler(controller.login))

export default authRouter