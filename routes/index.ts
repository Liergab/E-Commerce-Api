import express          from 'express'
import authRouter       from './auth';
import productRoutes    from './product';

const rootRouter = express.Router();

rootRouter.use('/auth', authRouter)
rootRouter.use('/product', productRoutes)

export default rootRouter