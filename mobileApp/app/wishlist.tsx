import React, { useEffect, useCallback, useState } from 'react';
import { View, Text, ScrollView, Image as RNImage, Pressable, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWishlistStore, useUserStore } from '../lib/store';
import { useRouter } from 'expo-router';
import { Heart, Trash2 } from 'lucide-react-native';
import { getWishlistProducts, removeFromWishlist } from '../lib/wishlistApi';
import PriceContainer from '../components/common/PriceContainer';
import { Product } from '../types/types';

export default function WishlistScreen() {
    const { wishlistIds, wishlistItems, setWishlistItems, removeFromWishlist: removeFromStore } = useWishlistStore();
    const { isAuthenticated, auth_token } = useUserStore();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const fetchWishlistProducts = useCallback(async () => {
        if (!isAuthenticated || !auth_token || wishlistIds.length === 0) return;

        setLoading(true);
        try {
            const response = await getWishlistProducts(wishlistIds, auth_token);
            if (response.success && response.products) {
                setWishlistItems(response.products);
            }
        } catch (error) {
            console.error("Failed to fetch wishlist products:", error);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, auth_token, wishlistIds, setWishlistItems]);

    useEffect(() => {
        fetchWishlistProducts();
    }, [fetchWishlistProducts]);

    const handleRemove = async (productId: string) => {
        if (!auth_token) return;
        try {
            await removeFromWishlist(productId, auth_token);
            removeFromStore(productId);
        } catch (error) {
            console.error("Failed to remove from wishlist:", error);
            Alert.alert("Error", "Failed to remove item from wishlist");
        }
    };

    if (!isAuthenticated) {
        return (
            <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
                <Heart size={48} color="#ccc" />
                <Text className="text-lg text-gray-500 mt-4 mb-4">Please sign in to view your wishlist</Text>
                <Pressable
                    className="bg-babyshopSky px-8 py-3 rounded-full"
                    onPress={() => router.push('/auth/signin')}
                >
                    <Text className="text-white font-bold">Sign In</Text>
                </Pressable>
            </SafeAreaView>
        );
    }

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
                <ActivityIndicator size="large" color="#29beb3" />
                <Text className="text-gray-500 mt-3">Loading wishlist...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <View className="px-4 py-3 border-b border-gray-200 bg-white">
                <Text className="text-xl font-bold text-gray-900">My Wishlist</Text>
                <Text className="text-sm text-gray-500 mt-1">{wishlistIds.length} item(s)</Text>
            </View>

            <ScrollView className="flex-1 p-4" contentContainerStyle={{ paddingBottom: 20 }}>
                {wishlistItems.length === 0 ? (
                    <View className="bg-white p-8 rounded-xl items-center mt-10 border border-gray-200">
                        <Heart size={48} color="#ccc" />
                        <Text className="text-lg text-gray-500 mt-4">Your wishlist is empty</Text>
                        <Text className="text-sm text-gray-400 mt-1 text-center">Items you add to your wishlist will appear here</Text>
                        <Pressable
                            className="bg-babyshopSky px-6 py-3 rounded-full mt-5"
                            onPress={() => router.push('/(tabs)/shop')}
                        >
                            <Text className="text-white font-bold">Browse Products</Text>
                        </Pressable>
                    </View>
                ) : (
                    wishlistItems.map((product: Product) => (
                        <View key={product._id} className="bg-white rounded-xl mb-3 border border-gray-100 shadow-sm flex-row overflow-hidden">
                            <RNImage
                                source={{ uri: product.image }}
                                className="w-28 h-28"
                                resizeMode="cover"
                            />
                            <View className="flex-1 p-3 justify-between">
                                <View>
                                    <Text className="text-sm font-medium text-gray-800" numberOfLines={2}>
                                        {product.name}
                                    </Text>
                                    <View className="mt-1">
                                        <PriceContainer
                                            price={product.price}
                                            discountPercentage={product.discountPercentage ?? 0}
                                        />
                                    </View>
                                </View>
                                <View className="flex-row items-center justify-end mt-2">
                                    <Pressable
                                        onPress={() => handleRemove(product._id)}
                                        className="flex-row items-center gap-1 bg-red-50 px-3 py-1.5 rounded-full"
                                    >
                                        <Trash2 size={14} color="#ef4444" />
                                        <Text className="text-red-500 text-xs font-medium">Remove</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
