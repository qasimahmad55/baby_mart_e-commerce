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

    const wishlistIdsString = wishlistIds.join(',');

    const fetchWishlistProducts = useCallback(async () => {
        if (!isAuthenticated || !auth_token || !wishlistIdsString) return;

        setLoading(true);
        try {
            const idsList = wishlistIdsString.split(',');
            const response = await getWishlistProducts(idsList, auth_token);
            if (response.success && response.products) {
                setWishlistItems(response.products);
            }
        } catch (error) {
            console.error("Failed to fetch wishlist products:", error);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, auth_token, wishlistIdsString, setWishlistItems]);

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
            <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center px-6">
                <View className="w-20 h-20 bg-red-50 rounded-full items-center justify-center mb-5">
                    <Heart size={36} color="#fca5a5" />
                </View>
                <Text className="text-lg font-bold text-gray-700 mb-2">Sign In Required</Text>
                <Text className="text-sm text-gray-400 mb-6 text-center">Please sign in to view your wishlist</Text>
                <Pressable
                    className="bg-babyshopSky px-8 py-3.5 rounded-xl"
                    onPress={() => router.push('/auth/signin')}
                    style={{ shadowColor: '#29beb3', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.25, shadowRadius: 6, elevation: 4 }}
                >
                    <Text className="text-white font-bold">Sign In</Text>
                </Pressable>
            </SafeAreaView>
        );
    }

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
                <View className="w-14 h-14 rounded-full bg-babyshopSky/10 items-center justify-center mb-3">
                    <ActivityIndicator size="large" color="#29beb3" />
                </View>
                <Text className="text-gray-400 text-sm font-medium">Loading wishlist...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <ScrollView className="flex-1 px-5 pt-5" contentContainerStyle={{ paddingBottom: 20 }}>
                {wishlistItems.length === 0 ? (
                    <View className="bg-white p-8 items-center mt-8" style={{
                        borderRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 3
                    }}>
                        <View className="w-20 h-20 bg-red-50 rounded-full items-center justify-center mb-4">
                            <Heart size={36} color="#fca5a5" />
                        </View>
                        <Text className="text-lg font-bold text-gray-700 mb-1">Your wishlist is empty</Text>
                        <Text className="text-sm text-gray-400 text-center mb-5">Items you love will appear here</Text>
                        <Pressable
                            className="bg-gray-900 px-6 py-3 rounded-xl"
                            onPress={() => router.push('/(tabs)/shop')}
                        >
                            <Text className="text-white font-bold text-sm">Browse Products</Text>
                        </Pressable>
                    </View>
                ) : (
                    wishlistItems.map((product: Product) => (
                        <View
                            key={product._id}
                            className="bg-white mb-4 flex-row overflow-hidden"
                            style={{
                                borderRadius: 18,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.05,
                                shadowRadius: 8,
                                elevation: 2,
                            }}
                        >
                            <RNImage
                                source={{ uri: product.image }}
                                style={{ width: 110, height: 110, borderTopLeftRadius: 18, borderBottomLeftRadius: 18 }}
                                resizeMode="cover"
                            />
                            <View className="flex-1 p-4 justify-between">
                                <View>
                                    <Text className="text-sm font-semibold text-gray-800 leading-[18px]" numberOfLines={2}>
                                        {product.name}
                                    </Text>
                                    <View className="mt-2">
                                        <PriceContainer
                                            price={product.price}
                                            discountPercentage={product.discountPercentage ?? 0}
                                        />
                                    </View>
                                </View>
                                <View className="flex-row items-center justify-end mt-2">
                                    <Pressable
                                        onPress={() => handleRemove(product._id)}
                                        className="flex-row items-center gap-1.5 bg-red-50 px-3.5 py-2 rounded-xl"
                                    >
                                        <Trash2 size={13} color="#ef4444" />
                                        <Text className="text-red-500 text-xs font-bold">Remove</Text>
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
