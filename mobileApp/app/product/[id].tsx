import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image as RNImage, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Truck, Box, Star } from 'lucide-react-native';

import { fetchData } from '../../lib/api';
import { Product } from '../../types/types';
import PriceContainer from '../../components/common/PriceContainer';
import AddToCartButton from '../../components/AddToCartButton';
import WishListButton from '../../components/WishListButton';
import DiscountBadge from '../../components/DiscountBadge';

export default function ProductDetailScreen() {
    const { id } = useLocalSearchParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProduct = async () => {
            try {
                const data = await fetchData<Product>(`/products/${id}`);
                setProduct(data);
            } catch (error) {
                console.error("Failed to load product:", error);
            } finally {
                setLoading(false);
            }
        };
        if (id) {
            loadProduct();
        }
    }, [id]);

    if (loading) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center bg-gray-50">
                <ActivityIndicator size="large" color="#29beb3" />
            </SafeAreaView>
        );
    }

    if (!product) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center bg-gray-50">
                <Text className="text-lg">Product not found</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <ScrollView className="flex-1 p-4">
                <View className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-200">
                    <View className="relative w-full aspect-square mb-4">
                        <RNImage
                            source={{ uri: product.image }}
                            className="w-full h-full rounded-lg"
                            resizeMode="cover"
                        />
                        <View className="absolute top-2 left-2">
                             <DiscountBadge discountPercentage={product?.discountPercentage ?? 0} />
                        </View>
                        <WishListButton product={product} />
                    </View>

                    <Text className="text-xl font-bold mb-2">{product.name}</Text>
                    
                    <View className="flex-row items-center justify-between mb-4">
                        <PriceContainer 
                            price={product.price} 
                            discountPercentage={product?.discountPercentage ?? 0} 
                        />
                        <View className="flex-row items-center">
                            <Star size={16} color="#fbbf24" fill="#fbbf24" />
                            <Text className="ml-1 text-sm text-gray-500">(0 reviews)</Text>
                        </View>
                    </View>

                    <AddToCartButton product={product} className="w-full py-3 bg-babyshopBlack text-white" />

                    <View className="mt-6 space-y-4">
                         <View className="flex-row items-center gap-3">
                             <Truck size={24} color="#000" />
                             <Text className="flex-1 font-medium text-sm">Estimated Delivery: 14 days</Text>
                         </View>
                         <View className="flex-row items-center gap-3 mt-3">
                             <Box size={24} color="#000" />
                             <Text className="flex-1 font-medium text-sm">Free Shipping & Returns</Text>
                         </View>
                    </View>
                </View>

                <View className="bg-white rounded-xl shadow-sm p-4 mb-10 border border-gray-200">
                    <Text className="text-lg font-bold mb-2">Description</Text>
                    <Text className="text-sm text-gray-600 leading-6">{product.description}</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
