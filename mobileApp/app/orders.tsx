import React, { useEffect, useCallback } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOrderStore, useUserStore } from '../lib/store';
import { useRouter } from 'expo-router';
import { Package, ChevronRight, ShoppingBag } from 'lucide-react-native';
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

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'paid': return { bg: '#ECFDF5', text: '#059669' };
            case 'pending': return { bg: '#FFFBEB', text: '#D97706' };
            case 'completed': return { bg: '#EFF6FF', text: '#2563EB' };
            case 'cancelled': return { bg: '#FFF1F2', text: '#DC2626' };
            default: return { bg: '#F9FAFB', text: '#6B7280' };
        }
    };

    if (!isAuthenticated) {
        return (
            <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center px-6">
                <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-5">
                    <Package size={36} color="#d1d5db" />
                </View>
                <Text className="text-lg font-bold text-gray-700 mb-2">Sign In Required</Text>
                <Text className="text-sm text-gray-400 mb-6 text-center">Please sign in to view your orders</Text>
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

    if (isLoading) {
        return (
            <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
                <View className="w-14 h-14 rounded-full bg-babyshopSky/10 items-center justify-center mb-3">
                    <ActivityIndicator size="large" color="#29beb3" />
                </View>
                <Text className="text-gray-400 text-sm font-medium">Loading orders...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <ScrollView className="flex-1 px-5 pt-5" contentContainerStyle={{ paddingBottom: 20 }}>
                {orders.length === 0 ? (
                    <View className="bg-white p-8 items-center mt-8" style={{
                        borderRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 3
                    }}>
                        <View className="w-20 h-20 bg-gray-50 rounded-full items-center justify-center mb-4">
                            <ShoppingBag size={36} color="#d1d5db" />
                        </View>
                        <Text className="text-lg font-bold text-gray-700 mb-1">No orders yet</Text>
                        <Text className="text-sm text-gray-400 text-center">Your order history will appear here</Text>
                    </View>
                ) : (
                    [...orders]
                        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                        .map((order) => {
                            const statusStyle = getStatusStyle(order.status);
                            return (
                                <Pressable
                                    key={order._id}
                                    onPress={() => router.push(`/order/${order._id}` as any)}
                                    className="bg-white mb-4 overflow-hidden active:opacity-70"
                                    style={{
                                        borderRadius: 18,
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.05,
                                        shadowRadius: 8,
                                        elevation: 2,
                                    }}
                                >
                                    {/* Status accent strip */}
                                    <View style={{ height: 3, backgroundColor: statusStyle.text }} />
                                    
                                    <View className="px-4 py-3.5 flex-row items-center justify-between bg-gray-50/50">
                                        <View>
                                            <Text className="text-xs font-bold text-gray-700">Order #{order._id.slice(-8).toUpperCase()}</Text>
                                            <Text className="text-[10px] text-gray-400 mt-0.5 font-medium">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </Text>
                                        </View>
                                        <View className="px-3 py-1.5 rounded-lg" style={{ backgroundColor: statusStyle.bg }}>
                                            <Text className="text-[10px] font-bold capitalize" style={{ color: statusStyle.text }}>{order.status}</Text>
                                        </View>
                                    </View>

                                    <View className="px-4 py-3.5 flex-row items-center justify-between">
                                        <View>
                                            <Text className="text-[11px] text-gray-400 font-medium">{order.items.length} item(s)</Text>
                                            <PriceFormatter amount={order.total} className="text-lg font-extrabold text-gray-900 mt-0.5" />
                                        </View>
                                        <View className="w-8 h-8 rounded-lg bg-gray-50 items-center justify-center">
                                            <ChevronRight size={16} color="#94a3b8" />
                                        </View>
                                    </View>
                                </Pressable>
                            );
                        })
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
