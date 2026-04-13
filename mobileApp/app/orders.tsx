import React, { useEffect, useCallback } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOrderStore, useUserStore } from '../lib/store';
import { useRouter } from 'expo-router';
import { Package, ChevronRight } from 'lucide-react-native';
import PriceFormatter from '../components/common/PriceFormatter';

export default function OrdersScreen() {
    const { orders, isLoading, loadOrders } = useOrderStore();
    const { isAuthenticated, auth_token } = useUserStore();
    const router = useRouter();

    const fetchOrders = useCallback(async () => {
        if (isAuthenticated && auth_token) {
            await loadOrders(auth_token);
        }
    }, [isAuthenticated, auth_token, loadOrders]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'paid': return 'bg-green-100 text-green-700';
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            case 'completed': return 'bg-blue-100 text-blue-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    if (!isAuthenticated) {
        return (
            <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
                <Package size={48} color="#ccc" />
                <Text className="text-lg text-gray-500 mt-4 mb-4">Please sign in to view your orders</Text>
                <Pressable
                    className="bg-babyshopSky px-8 py-3 rounded-full"
                    onPress={() => router.push('/auth/signin')}
                >
                    <Text className="text-white font-bold">Sign In</Text>
                </Pressable>
            </SafeAreaView>
        );
    }

    if (isLoading) {
        return (
            <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
                <ActivityIndicator size="large" color="#29beb3" />
                <Text className="text-gray-500 mt-3">Loading orders...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <View className="px-4 py-3 border-b border-gray-200 bg-white">
                <Text className="text-xl font-bold text-gray-900">My Orders</Text>
                <Text className="text-sm text-gray-500 mt-1">{orders.length} order(s)</Text>
            </View>

            <ScrollView className="flex-1 p-4" contentContainerStyle={{ paddingBottom: 20 }}>
                {orders.length === 0 ? (
                    <View className="bg-white p-8 rounded-xl items-center mt-10 border border-gray-200">
                        <Package size={48} color="#ccc" />
                        <Text className="text-lg text-gray-500 mt-4">No orders yet</Text>
                        <Text className="text-sm text-gray-400 mt-1 text-center">Your order history will appear here</Text>
                    </View>
                ) : (
                    [...orders]
                        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                        .map((order) => (
                            <Pressable
                                key={order._id}
                                onPress={() => router.push(`/order/${order._id}` as any)}
                                className="bg-white rounded-xl mb-3 border border-gray-100 shadow-sm overflow-hidden active:opacity-70"
                            >
                                <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
                                    <View>
                                        <Text className="text-xs text-gray-500">Order #{order._id.slice(-8).toUpperCase()}</Text>
                                        <Text className="text-[10px] text-gray-400 mt-0.5">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </Text>
                                    </View>
                                    <View className={`px-3 py-1 rounded-full ${getStatusColor(order.status)}`}>
                                        <Text className="text-xs font-semibold capitalize">{order.status}</Text>
                                    </View>
                                </View>

                                <View className="px-4 py-3">
                                    <Text className="text-xs text-gray-500">{order.items.length} item(s)</Text>
                                    <View className="flex-row items-center justify-between mt-2">
                                        <PriceFormatter amount={order.total} className="text-lg font-bold text-babyshopBlack" />
                                        <ChevronRight size={18} color="#999" />
                                    </View>
                                </View>
                            </Pressable>
                        ))
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
