import express, {NextFunction, Request, Response, Router} from 'express'
import { productsRouter } from "./routes/products-router";
import { addressesRouter } from "./routes/addresses-router";


const app = express()
const port = 5000

const parserMiddleware = express.json()
app.use(parserMiddleware)

app.use('products', productsRouter)
app.use('addresses', addressesRouter)

app.get('/', (req: Request, res: Response) => {
    res.send('Hello Samurai')
})

app.use('/products', productsRouter)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})