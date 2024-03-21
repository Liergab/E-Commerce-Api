import express          from 'express'
import authRouter       from './auth';
import productRoutes    from './product';
import userRouter       from './user';
import cartRouter       from './cart';
import orderRouter      from './order';

const rootRouter = express.Router();

rootRouter.use('/auth', authRouter);
rootRouter.use('/product', productRoutes);
rootRouter.use('/user', userRouter);
rootRouter.use('/cart', cartRouter);
rootRouter.use('/order', orderRouter);

export default rootRouter