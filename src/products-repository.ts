type ProductType = {
    title: string
    id: string
}

let products: ProductType[] = [{id: '1', title: 'tomato'}, {id: '2', title: 'orange'}]

export const productsRepository = {
    getProduct(): ProductType[] {
        return products
    },
    createProduct(title: string): ProductType | null {
        if (!title.trim()) {
            return null
        }

        const newProduct : ProductType = {
            title,
            id: Date.now().toString()
        }

        products.unshift(newProduct)
        return newProduct
    },
}