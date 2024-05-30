import {Request, Response, Router} from "express"

export const addressesRouter = Router({});

const address = [{id: 1, value: 'Nezalejnasti 12'}, {id: 2, value: 'Selickaga 11'}]

addressesRouter.get('/:id', (req: Request, res: Response) => {
    let addres = address.find(a => a.id === +req.params.id)
    if (addres) {
        res.send(addres)
    } else {
        res.send(404);
    }
})
addressesRouter.get('/', (req: Request, res: Response) => {
    if (address) {
        res.send(address)
    } else {
        res.send(404);
    }
})
