import React from 'react';
import { View, Text, ScrollView, Image, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useOrderStore } from '../../lib/store';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Package, MapPin, CreditCard, Clock } from 'lucide-react-native';
import PriceFormatter from '../../components/common/PriceFormatter';
import { Order, OrderItem } from '../../lib/orderApi';

export default function OrderDetailsScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { orders } = useOrderStore();
    const order = orders.find((o: Order) => o._id === id);

    if (!order) {
        return (
            <SafeAreaView className="flex-1 bg-white justify-center items-center p-5">
                <Package size={64} color="#ccc" />
                <Text className="text-xl font-bold text-gray-800 mt-4">Order Not Found</Text>
                <Text className="text-gray-500 text-center mt-2">
                    We couldn't find the order you're looking for. It may have been removed or doesn't exist.
                </Text>
                <Pressable
                    onPress={() => router.back()}
                    className="mt-8 bg-babyshopSky px-8 py-3 rounded-full"
                >
                    <Text className="text-white font-bold">Go Back</Text>
                </Pressable>
            </SafeAreaView>
        );
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'paid': return 'text-green-600 bg-green-50 border-green-100';
            case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-100';
            case 'completed': return 'text-blue-600 bg-blue-50 border-blue-100';
            case 'cancelled': return 'text-red-600 bg-red-50 border-red-100';
            default: return 'text-gray-600 bg-gray-50 border-gray-100';
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <View className="bg-white px-4 py-3 flex-row items-center border-b border-gray-200">
                <Pressable onPress={() => router.back()} className="mr-3">
                    <ChevronLeft size={24} color="#333" />
                </Pressable>
                <View>
                    <Text className="text-lg font-bold text-gray-900">Order Details</Text>
                    <Text className="text-xs text-gray-500">#{order._id.toUpperCase()}</Text>
                </View>
            </View>

            <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}>
                {/* Status Section */}
                <View className="bg-white p-4 mb-3 border-b border-gray-100">
                    <View className="flex-row items-center justify-between mb-4">
                        <View className="flex-row items-center gap-2">
                            <Clock size={16} color="#666" />
                            <Text className="text-gray-600 font-medium">Order Status</Text>
                        </View>
                        <View className={`px-3 py-1 rounded-full border ${getStatusColor(order.status)}`}>
                            <Text className="text-xs font-bold capitalize">{order.status}</Text>
                        </View>
                    </View>
                    <View className="flex-row justify-between items-center bg-gray-50 p-3 rounded-lg">
                        <Text className="text-gray-500 text-xs">Placed on</Text>
                        <Text className="text-gray-900 font-semibold">{new Date(order.createdAt).toLocaleString()}</Text>
                    </View>
                </View>

                {/* Items Section */}
                <View className="bg-white p-4 mb-3 border-y border-gray-100">
                    <Text className="text-base font-bold text-gray-900 mb-4">Ordered Items</Text>
                    {order.items.map((item: OrderItem, index: number) => (
                        <View key={`${item.productId}-${index}`} className="flex-row mb-4 last:mb-0">
                            <View className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                                {item.image ? (
                                    <Image source={{ uri: item.image }} className="w-full h-full" resizeMode="cover" />
                                ) : (
                                    <View className="w-full h-full items-center justify-center">
                                        <Package size={24} color="#ccc" />
                                    </View>
                                )}
                            </View>
                            <View className="flex-1 ml-4 justify-between">
                                <View>
                                    <Text className="text-sm font-semibold text-gray-900" numberOfLines={2}>{item.name}</Text>
                                    <Text className="text-xs text-gray-500 mt-1">Quantity: {item.quantity}</Text>
                                </View>
                                <PriceFormatter amount={item.price * item.quantity} className="text-sm font-bold text-babyshopSky" />
                            </View>
                        </View>
                    ))}
                </View>

                {/* Shipping & Payment Info */}
                <View className="bg-white p-4 mb-3 border-y border-gray-100">
                    <View className="mb-6">
                        <View className="flex-row items-center gap-2 mb-3">
                            <MapPin size={18} color="#29beb3" />
                            <Text className="text-base font-bold text-gray-900">Shipping Address</Text>
                        </View>
                        <View className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <Text className="text-gray-800 font-medium">{order.shippingAddress.street}</Text>
                            <Text className="text-gray-600 mt-1">
                                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                            </Text>
                            <Text className="text-gray-600">{order.shippingAddress.country}</Text>
                        </View>
                    </View>

                    <View>
                        <View className="flex-row items-center gap-2 mb-3">
                            <CreditCard size={18} color="#a96bde" />
                            <Text className="text-base font-bold text-gray-900">Order Summary</Text>
                        </View>
                        <View className="space-y-3">
                            <View className="flex-row justify-between">
                                <Text className="text-gray-500">Subtotal</Text>
                                <PriceFormatter amount={order.total} className="text-gray-900" />
                            </View>
                            <View className="flex-row justify-between">
                                <Text className="text-gray-500">Shipping</Text>
                                <Text className="text-green-600 font-medium">Free</Text>
                            </View>
                            <View className="h-[1px] bg-gray-100 my-1" />
                            <View className="flex-row justify-between">
                                <Text className="text-gray-900 font-bold">Total Amount</Text>
                                <PriceFormatter amount={order.total} className="text-lg font-bold text-babyshopBlack" />
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
