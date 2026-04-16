import React, { useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Image as RNImage, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCartStore, useUserStore } from '../../lib/store';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react-native';
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
            {/* Header */}
            <View
                className="px-5 py-4 bg-white"
                style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.04,
                    shadowRadius: 6,
                    elevation: 3,
                }}
            >
                <Text className="text-xl font-extrabold text-gray-900">Shopping Cart</Text>
                {isAuthenticated && cartItemsWithQuantities.length > 0 && (
                    <Text className="text-xs text-gray-400 mt-0.5 font-medium">{cartItemsWithQuantities.length} item(s)</Text>
                )}
            </View>

            <ScrollView className="flex-1 px-5 pt-4" contentContainerStyle={{ paddingBottom: 20 }}>
                {!isAuthenticated ? (
                    <View className="bg-white p-8 rounded-2xl items-center mt-10" style={{
                        shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 3,
                    }}>
                        <View className="w-20 h-20 bg-gray-50 rounded-full items-center justify-center mb-4">
                            <ShoppingBag size={36} color="#d1d5db" />
                        </View>
                        <Text className="text-lg font-bold text-gray-700 mb-2">Sign In Required</Text>
                        <Text className="text-sm text-gray-400 mb-6 text-center">Please sign in to view your cart</Text>
                        <Pressable
                            className="bg-babyshopSky px-8 py-3.5 rounded-xl"
                            onPress={() => router.push('/auth/signin')}
                            style={{
                                shadowColor: '#29beb3', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.25, shadowRadius: 6, elevation: 4,
                            }}
                        >
                            <Text className="text-white font-bold">Sign In</Text>
                        </Pressable>
                    </View>
                ) : cartItemsWithQuantities.length === 0 ? (
                    <View className="bg-white p-8 rounded-2xl items-center mt-10" style={{
                        shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 3,
                    }}>
                        <View className="w-20 h-20 bg-gray-50 rounded-full items-center justify-center mb-4">
                            <ShoppingBag size={36} color="#d1d5db" />
                        </View>
                        <Text className="text-lg font-bold text-gray-700 mb-1">Your cart is empty</Text>
                        <Text className="text-sm text-gray-400 text-center">Start shopping to add items here</Text>
                    </View>
                ) : (
                    cartItemsWithQuantities.map((item) => (
                        <View
                            key={item.product._id}
                            className="bg-white p-4 mb-4 flex-row"
                            style={{
                                borderRadius: 18,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.05,
                                shadowRadius: 8,
                                elevation: 2,
                            }}
                        >
                            <View style={{ borderRadius: 14, overflow: 'hidden', backgroundColor: '#f8fafc' }}>
                                <RNImage
                                    source={{ uri: item.product.image }}
                                    style={{ width: 100, height: 100 }}
                                    resizeMode="cover"
                                />
                            </View>
                            <View className="flex-1 ml-4 justify-between py-0.5">
                                <View>
                                    <Text className="text-sm font-semibold text-gray-800 pr-6 leading-[18px]" numberOfLines={2}>
                                        {item.product.name}
                                    </Text>
                                    <View className="mt-2">
                                        <PriceFormatter amount={item.product.price} className="text-babyshopBlack text-base font-bold" />
                                    </View>
                                </View>

                                <View className="flex-row items-center justify-between mt-3">
                                    <View
                                        className="flex-row items-center bg-gray-50 rounded-xl overflow-hidden"
                                        style={{ borderWidth: 1, borderColor: '#e5e7eb' }}
                                    >
                                        <Pressable
                                            onPress={() => updateCartItemQuantity(item.product._id, Math.max(1, item.quantity - 1))}
                                            className="w-9 h-9 items-center justify-center"
                                            disabled={item.quantity <= 1}
                                        >
                                            <Minus size={14} color={item.quantity <= 1 ? "#d1d5db" : "#475569"} />
                                        </Pressable>
                                        <Text className="font-bold mx-3 text-gray-800 min-w-[16px] text-center">
                                            {item.quantity}
                                        </Text>
                                        <Pressable
                                            onPress={() => updateCartItemQuantity(item.product._id, item.quantity + 1)}
                                            className="w-9 h-9 items-center justify-center"
                                        >
                                            <Plus size={14} color="#475569" />
                                        </Pressable>
                                    </View>

                                    <Pressable
                                        onPress={() => removeFromCart(item.product._id)}
                                        className="w-9 h-9 bg-red-50 rounded-xl items-center justify-center"
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
                <View
                    className="bg-white px-5 py-5"
                    style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: -4 },
                        shadowOpacity: 0.08,
                        shadowRadius: 12,
                        elevation: 12,
                    }}
                >
                    <View className="flex-row justify-between mb-4 items-center">
                        <Text className="text-gray-500 font-medium text-sm">Subtotal</Text>
                        <PriceFormatter amount={total} className="font-extrabold text-2xl text-gray-900" />
                    </View>
                    <Pressable 
                        className="bg-gray-900 w-full py-4 rounded-xl items-center"
                        onPress={() => router.push('/order/checkout')}
                        style={{
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.15,
                            shadowRadius: 8,
                            elevation: 6,
                        }}
                    >
                        <Text className="text-white font-bold text-base uppercase tracking-wider">Proceed to Checkout</Text>
                    </Pressable>
                </View>
            )}
        </SafeAreaView>
    );
}
