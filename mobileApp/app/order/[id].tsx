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
            <SafeAreaView className="flex-1 bg-white justify-center items-center px-6">
                <View className="w-20 h-20 bg-gray-50 rounded-full items-center justify-center mb-5">
                    <Package size={36} color="#d1d5db" />
                </View>
                <Text className="text-xl font-extrabold text-gray-800 mb-2">Order Not Found</Text>
                <Text className="text-gray-400 text-center text-sm mb-8 leading-5">
                    We couldn't find the order you're looking for.
                </Text>
                <Pressable
                    onPress={() => router.back()}
                    className="bg-babyshopSky px-8 py-3.5 rounded-xl"
                    style={{ shadowColor: '#29beb3', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.25, shadowRadius: 6, elevation: 4 }}
                >
                    <Text className="text-white font-bold">Go Back</Text>
                </Pressable>
            </SafeAreaView>
        );
    }

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'paid': return { bg: '#ECFDF5', text: '#059669', border: '#A7F3D0' };
            case 'pending': return { bg: '#FFFBEB', text: '#D97706', border: '#FDE68A' };
            case 'completed': return { bg: '#EFF6FF', text: '#2563EB', border: '#BFDBFE' };
            case 'cancelled': return { bg: '#FFF1F2', text: '#DC2626', border: '#FECDD3' };
            default: return { bg: '#F9FAFB', text: '#6B7280', border: '#E5E7EB' };
        }
    };

    const statusStyle = getStatusStyle(order.status);

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}>
                {/* Status Section */}
                <View className="bg-white px-5 py-5 mb-3">
                    <View className="flex-row items-center justify-between mb-4">
                        <View className="flex-row items-center gap-2">
                            <View className="w-8 h-8 rounded-lg bg-gray-50 items-center justify-center">
                                <Clock size={16} color="#64748b" />
                            </View>
                            <Text className="text-sm font-bold text-gray-700">Status</Text>
                        </View>
                        <View className="px-3.5 py-1.5 rounded-lg" style={{ backgroundColor: statusStyle.bg, borderWidth: 1, borderColor: statusStyle.border }}>
                            <Text className="text-[11px] font-bold capitalize" style={{ color: statusStyle.text }}>{order.status}</Text>
                        </View>
                    </View>
                    <View className="bg-gray-50 p-4 rounded-xl">
                        <View className="flex-row justify-between items-center">
                            <Text className="text-gray-400 text-xs font-medium">Placed on</Text>
                            <Text className="text-gray-800 font-bold text-sm">{new Date(order.createdAt).toLocaleString()}</Text>
                        </View>
                    </View>
                </View>

                {/* Items Section */}
                <View className="bg-white px-5 py-5 mb-3">
                    <View className="flex-row items-center gap-2 mb-5">
                        <View className="w-1 h-5 bg-babyshopSky rounded-full" />
                        <Text className="text-base font-extrabold text-gray-900">Ordered Items</Text>
                    </View>
                    {order.items.map((item: OrderItem, index: number) => (
                        <View key={`${item.productId}-${index}`} className={`flex-row ${index < order.items.length - 1 ? 'mb-4 pb-4 border-b border-gray-50' : ''}`}>
                            <View style={{ width: 72, height: 72, borderRadius: 14, overflow: 'hidden', backgroundColor: '#f9fafb' }}>
                                {item.image ? (
                                    <Image source={{ uri: item.image }} className="w-full h-full" resizeMode="cover" />
                                ) : (
                                    <View className="w-full h-full items-center justify-center">
                                        <Package size={22} color="#d1d5db" />
                                    </View>
                                )}
                            </View>
                            <View className="flex-1 ml-4 justify-between">
                                <View>
                                    <Text className="text-sm font-semibold text-gray-800 leading-[18px]" numberOfLines={2}>{item.name}</Text>
                                    <Text className="text-xs text-gray-400 mt-1 font-medium">Qty: {item.quantity}</Text>
                                </View>
                                <PriceFormatter amount={item.price * item.quantity} className="text-sm font-bold text-babyshopSky" />
                            </View>
                        </View>
                    ))}
                </View>

                {/* Shipping & Payment Info */}
                <View className="bg-white px-5 py-5 mb-3">
                    {/* Shipping */}
                    <View className="mb-6">
                        <View className="flex-row items-center gap-2 mb-4">
                            <View className="w-8 h-8 rounded-lg bg-babyshopSky/10 items-center justify-center">
                                <MapPin size={16} color="#29beb3" />
                            </View>
                            <Text className="text-sm font-bold text-gray-800">Shipping Address</Text>
                        </View>
                        <View className="bg-gray-50 p-4 rounded-xl" style={{ borderWidth: 1, borderColor: '#f1f5f9' }}>
                            <Text className="text-gray-800 font-semibold text-sm">{order.shippingAddress.street}</Text>
                            <Text className="text-gray-400 text-xs mt-1">
                                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                            </Text>
                            <Text className="text-gray-400 text-xs">{order.shippingAddress.country}</Text>
                        </View>
                    </View>

                    {/* Order Summary */}
                    <View>
                        <View className="flex-row items-center gap-2 mb-4">
                            <View className="w-8 h-8 rounded-lg bg-purple-50 items-center justify-center">
                                <CreditCard size={16} color="#a96bde" />
                            </View>
                            <Text className="text-sm font-bold text-gray-800">Order Summary</Text>
                        </View>
                        <View className="gap-3">
                            <View className="flex-row justify-between">
                                <Text className="text-gray-400 text-sm">Subtotal</Text>
                                <PriceFormatter amount={order.total} className="text-gray-800 font-semibold text-sm" />
                            </View>
                            <View className="flex-row justify-between">
                                <Text className="text-gray-400 text-sm">Shipping</Text>
                                <Text className="text-green-600 font-semibold text-sm">Free</Text>
                            </View>
                            <View className="h-[1px] bg-gray-100 my-1" />
                            <View className="flex-row justify-between items-center">
                                <Text className="text-gray-900 font-extrabold text-base">Total</Text>
                                <PriceFormatter amount={order.total} className="text-lg font-extrabold text-gray-900" />
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
