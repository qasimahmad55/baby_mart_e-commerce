import React, { useEffect, useState } from 'react'
import { View, Text, ActivityIndicator } from 'react-native'
import { fetchData } from '../../lib/api'
import { Product } from '../../types/types'
import ProductCard from '../common/pages/ProductCard'

interface ProductResponse {
    products: Product[]
}

const ProductList = () => {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await fetchData<ProductResponse>("/products?perPage=10")
                setProducts(data?.products || [])
            } catch (error) {
                console.log("Product fetching Error", error)
            } finally {
                setLoading(false)
            }
        }
        fetchProducts()
    }, [])

    if (loading) {
        return <ActivityIndicator size="large" color="#29beb3" className="mt-4" />
    }

    if (products.length === 0) {
        return (
            <View className="bg-babyshopWhite p-5 rounded-md border border-gray-200 mt-3">
                <Text className="text-lg font-semibold text-center">No Products Available</Text>
            </View>
        )
    }

    return (
        <View className="w-full bg-babyshopWhite border border-gray-200 mt-3 rounded-md p-3">
            <View className="flex-row flex-wrap justify-between">
                {products?.map((product) => (
                    <View key={product?._id} className="w-[48%] mb-2">
                        <ProductCard product={product} />
                    </View>
                ))}
            </View>
        </View>
    )
}

export default ProductList
