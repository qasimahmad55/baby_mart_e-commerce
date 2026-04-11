import React, { useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Image as RNImage, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCartStore, useUserStore } from '../../lib/store';
import { Trash2, Plus, Minus } from 'lucide-react-native';
import PriceFormatter from '../../components/common/PriceFormatter';
import { useRouter } from 'expo-router';

export default function CartScreen() {
    const { cartItemsWithQuantities, syncCartFromServer, removeFromCart, updateCartItemQuantity } = useCartStore();
    const { isAuthenticated } = useUserStore();
    const router = useRouter();

    const syncCart = useCallback(() => {
        if (isAuthenticated) {
            syncCartFromServer();
        }
    }, [isAuthenticated, syncCartFromServer]);

    useEffect(() => {
        syncCart();
    }, [syncCart]);

    const total = cartItemsWithQuantities.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <View className="px-4 py-3 border-b border-gray-200 bg-white shadow-sm">
                <Text className="text-xl font-bold text-gray-900">Shopping Cart</Text>
            </View>

            <ScrollView className="flex-1 p-4" contentContainerStyle={{ paddingBottom: 20 }}>
                {!isAuthenticated ? (
                    <View className="bg-white p-6 rounded-lg items-center mt-10 shadow-sm border border-gray-200">
                        <Text className="text-lg text-gray-500 mb-4">Please sign in to view your cart</Text>
                        <Pressable
                            className="bg-babyshopSky px-8 py-3 rounded-full"
                            onPress={() => router.push('/auth/signin')}
                        >
                            <Text className="text-white font-bold">Sign In</Text>
                        </Pressable>
                    </View>
                ) : cartItemsWithQuantities.length === 0 ? (
                    <View className="bg-white p-6 rounded-lg items-center mt-10 shadow-sm border border-gray-200">
                        <Text className="text-lg text-gray-500">Your cart is empty</Text>
                    </View>
                ) : (
                    cartItemsWithQuantities.map((item) => (
                        <View key={item.product._id} className="bg-white p-3 rounded-xl mb-4 flex-row border border-gray-100 shadow-sm">
                            <View className="bg-gray-50 rounded-lg overflow-hidden">
                                <RNImage
                                    source={{ uri: item.product.image }}
                                    className="w-24 h-24"
                                    resizeMode="cover"
                                />
                            </View>
                            <View className="flex-1 ml-4 justify-between py-1">
                                <View>
                                    <Text className="text-sm font-medium text-gray-800 pr-6" numberOfLines={2}>
                                        {item.product.name}
                                    </Text>
                                    <View className="mt-1.5">
                                        <PriceFormatter amount={item.product.price} className="text-babyshopBlack text-base" />
                                    </View>
                                </View>

                                <View className="flex-row items-center justify-between mt-2 border-t border-gray-100 pt-2">
                                    <View className="flex-row items-center border border-gray-200 rounded-full bg-gray-50">
                                        <Pressable
                                            onPress={() => updateCartItemQuantity(item.product._id, Math.max(1, item.quantity - 1))}
                                            className="w-8 h-8 items-center justify-center rounded-l-full"
                                            disabled={item.quantity <= 1}
                                        >
                                            <Minus size={14} color={item.quantity <= 1 ? "#cbd5e1" : "#475569"} />
                                        </Pressable>
                                        <Text className="font-semibold mx-2 text-gray-700 min-w-[12px] text-center">
                                            {item.quantity}
                                        </Text>
                                        <Pressable
                                            onPress={() => updateCartItemQuantity(item.product._id, item.quantity + 1)}
                                            className="w-8 h-8 items-center justify-center rounded-r-full"
                                        >
                                            <Plus size={14} color="#475569" />
                                        </Pressable>
                                    </View>

                                    <Pressable
                                        onPress={() => removeFromCart(item.product._id)}
                                        className="p-2 bg-red-50 rounded-full"
                                    >
                                        <Trash2 size={16} color="#ef4444" />
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>

            {isAuthenticated && cartItemsWithQuantities.length > 0 && (
                <View className="bg-white p-5 border-t border-gray-200 shadow-lg">
                    <View className="flex-row justify-between mb-4 items-center">
                        <Text className="text-gray-500 font-medium text-base">Subtotal</Text>
                        <PriceFormatter amount={total} className="font-bold text-2xl text-black" />
                    </View>
                    <Pressable className="bg-babyshopBlack w-full py-4 rounded-xl items-center shadow-md">
                        <Text className="text-white font-bold text-lg">Proceed to Checkout</Text>
                    </Pressable>
                </View>
            )}
        </SafeAreaView>
    );
}
