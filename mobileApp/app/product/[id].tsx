import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image as RNImage, ActivityIndicator, Dimensions } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Truck, Box, Star } from 'lucide-react-native';

import { fetchData } from '../../lib/api';
import { Product } from '../../types/types';
import PriceContainer from '../../components/common/PriceContainer';
import AddToCartButton from '../../components/AddToCartButton';
import WishListButton from '../../components/WishListButton';
import DiscountBadge from '../../components/DiscountBadge';

const { width } = Dimensions.get('window');

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
            <SafeAreaView className="flex-1 justify-center items-center bg-white">
                <View className="w-16 h-16 rounded-full bg-babyshopSky/10 items-center justify-center">
                    <ActivityIndicator size="large" color="#29beb3" />
                </View>
            </SafeAreaView>
        );
    }

    if (!product) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center bg-white px-6">
                <Text className="text-lg font-bold text-gray-700">Product not found</Text>
                <Text className="text-sm text-gray-400 mt-2 text-center">The product you're looking for may have been removed.</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Hero Image — Full Width */}
                <View className="relative" style={{ width, height: width }}>
                    <RNImage
                        source={{ uri: product.image }}
                        style={{ width, height: width }}
                        resizeMode="cover"
                    />
                    <View className="absolute top-4 left-4">
                         <DiscountBadge discountPercentage={product?.discountPercentage ?? 0} />
                    </View>
                    <WishListButton product={product} />
                </View>

                {/* Product Info */}
                <View className="px-5 pt-5 pb-3">
                    <Text className="text-xs text-babyshopSky font-bold uppercase tracking-widest mb-2">
                        {typeof product.category === 'object' ? product.category?.name : ''}
                    </Text>
                    <Text className="text-xl font-extrabold text-gray-900 leading-tight mb-3">{product.name}</Text>
                    
                    <View className="flex-row items-center justify-between mb-5">
                        <PriceContainer 
                            price={product.price} 
                            discountPercentage={product?.discountPercentage ?? 0} 
                        />
                        <View className="flex-row items-center bg-amber-50 px-3 py-1.5 rounded-lg">
                            <Star size={14} color="#fbbf24" fill="#fbbf24" />
                            <Text className="ml-1.5 text-xs text-amber-700 font-semibold">(0 reviews)</Text>
                        </View>
                    </View>

                    <AddToCartButton product={product} className="w-full py-3.5" />
                </View>

                {/* Delivery Info */}
                <View className="mx-5 mt-3 mb-4 bg-gray-50 rounded-2xl p-5" style={{ borderWidth: 1, borderColor: '#f1f5f9' }}>
                    <View className="flex-row items-center gap-4 mb-4">
                        <View className="w-10 h-10 rounded-xl bg-babyshopSky/10 items-center justify-center">
                            <Truck size={20} color="#29beb3" />
                        </View>
                        <View>
                            <Text className="font-bold text-sm text-gray-800">Estimated Delivery</Text>
                            <Text className="text-xs text-gray-400 mt-0.5">Within 14 business days</Text>
                        </View>
                    </View>
                    <View className="flex-row items-center gap-4">
                        <View className="w-10 h-10 rounded-xl bg-blue-50 items-center justify-center">
                            <Box size={20} color="#3b82f6" />
                        </View>
                        <View>
                            <Text className="font-bold text-sm text-gray-800">Free Shipping & Returns</Text>
                            <Text className="text-xs text-gray-400 mt-0.5">On all qualifying orders</Text>
                        </View>
                    </View>
                </View>

                {/* Description */}
                <View className="mx-5 mb-10 bg-white rounded-2xl p-5" style={{ borderWidth: 1, borderColor: '#f1f5f9' }}>
                    <Text className="text-base font-bold text-gray-900 mb-3">Description</Text>
                    <Text className="text-sm text-gray-500 leading-6">{product.description}</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
