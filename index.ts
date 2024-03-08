import express,{Express, Request, Response} from  'express';
const app:Express = express();
console.log("Express1")
const PORT = 3000 || 5000;

app.get('/', (req:Request, res:Response) => {
    res.send('helllo');
    
})
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`)
})