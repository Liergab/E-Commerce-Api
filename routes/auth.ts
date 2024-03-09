import express from 'express';
import * as controller from '../controller/authController'
const authRouter = express.Router()

authRouter.post('/signup', controller.signup)
authRouter.post('/login', controller.login)

export default authRouter