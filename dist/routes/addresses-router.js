"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addressesRouter = void 0;
const express_1 = require("express");
exports.addressesRouter = (0, express_1.Router)({});
const address = [{ id: 1, value: 'Nezalejnasti 12' }, { id: 2, value: 'Selickaga 11' }];
exports.addressesRouter.get('/:id', (req, res) => {
    let addres = address.find(a => a.id === +req.params.id);
    if (addres) {
        res.send(addres);
    }
    else {
        res.send(404);
    }
});
exports.addressesRouter.get('/', (req, res) => {
    if (address) {
        res.send(address);
    }
    else {
        res.send(404);
    }
});
