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
}).$extends({ //extend every time we used model address we can get the formatted date that came from adress model
    result:{
        address:{
            formattedAddress:{
                needs:{
                    lineOne:true,
                    lineTwo:true,
                    city:true,
                    country:true,
                    pincode:true
                },
                compute:(addr) => {
                    return `${addr.lineOne}, ${addr.lineTwo}, ${addr.city}, ${addr.country}-${addr.pincode}`
                }
            }
        }
    }
})

app.use(errorMiddleware)

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`)
});