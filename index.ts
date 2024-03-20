import express,{Express} from  'express';
import { PORT } from './secret';
import rootRouter from './routes';
import { PrismaClient } from '@prisma/client';
import { errorMiddleware } from './middleware/errors';

const app:Express = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/api/',rootRouter);

export const prismaClient = new PrismaClient({
    // log:['query']
});

app.use(errorMiddleware)

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`)
});