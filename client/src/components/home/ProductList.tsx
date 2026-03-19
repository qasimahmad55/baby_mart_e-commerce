import { fetchData } from '@/lib/api'
import { Product } from '@/types/types'
import React from 'react'
import ProductCard from '../common/pages/ProductCard'

interface ProductResponse {
    products: Product[]
}

const ProductList = async () => {

    let products: Product[] = []

    try {
        const data = await fetchData<ProductResponse>("/products?perPage=10")
        products = data?.products

    } catch (error) {
        console.log("Product fetching Error", error);
    }

    // console.log(products);
    if (products.length === 0) {
        return (
            <div className="bg-babyshopWhite p-5 rounded-md border mt-3">
                <p className="text-xl font-semibold">No Products Available</p>
            </div>
        )
    }

    return (
        <div className="w-full bg-babyshopWhite border mt-3 rounded-md">
            <div className="w-full p-5 grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {products?.map((product) => (
                    <ProductCard key={product?._id} product={product} />
                ))}
            </div>
        </div>
    )
}

export default ProductList