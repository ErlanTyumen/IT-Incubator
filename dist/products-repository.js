"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productsRepository = void 0;
let products = [{ id: '1', title: 'tomato' }, { id: '2', title: 'orange' }];
exports.productsRepository = {
    getProduct() {
        return products;
    },
    createProduct(title) {
        if (!title.trim()) {
            return null;
        }
        const newProduct = {
            title,
            id: Date.now().toString()
        };
        products.unshift(newProduct);
        return newProduct;
    },
};
