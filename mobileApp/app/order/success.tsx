import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCartStore, useUserStore } from '../../lib/store';
import { CheckCircle, Home, ShoppingBag, AlertCircle } from 'lucide-react-native';
import { updateOrderStatus } from '../../lib/orderApi';

export default function SuccessScreen() {
    const router = useRouter();
    const { orderId } = useLocalSearchParams();
    const { clearCart } = useCartStore();
    const { auth_token } = useUserStore();
    
    const [updating, setUpdating] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const finalizeOrder = async () => {
            if (!orderId || typeof orderId !== 'string') {
                setError("Order ID missing");
                setUpdating(false);
                return;
            }

            if (!auth_token) {
                setError("Authentication required");
                setUpdating(false);
                return;
            }

            try {
                // Update order status to paid
                const response = await updateOrderStatus(orderId, 'paid', auth_token);
                
                if (response.success) {
                    // Clear the local cart
                    await clearCart();
                } else {
                    console.warn("Fast update failed, might be handled by webhook:", response.message);
                }
            } catch (err) {
                console.error("Order finalization error:", err);
            } finally {
                setUpdating(false);
            }
        };

        finalizeOrder();
    }, [orderId, auth_token, clearCart]);

    if (updating) {
        return (
            <SafeAreaView className="flex-1 bg-white justify-center items-center p-6">
                <ActivityIndicator size="large" color="#29beb3" />
                <Text className="mt-4 text-gray-500 font-medium">Confirming your payment...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-1 justify-center items-center px-8">
                {error ? (
                    <>
                        <View className="w-24 h-24 bg-red-50 rounded-full items-center justify-center mb-6">
                            <AlertCircle size={48} color="#ef4444" />
                        </View>
                        <Text className="text-2xl font-bold text-gray-900 text-center mb-2">Something went wrong</Text>
                        <Text className="text-gray-500 text-center mb-10">
                            {error}. However, if your payment was successful, your order will be updated shortly via our system.
                        </Text>
                    </>
                ) : (
                    <>
                        <View className="w-24 h-24 bg-cyan-50 rounded-full items-center justify-center mb-6">
                            <CheckCircle size={48} color="#29beb3" />
                        </View>
                        <Text className="text-3xl font-bold text-gray-900 text-center mb-3">Order Placed!</Text>
                        <Text className="text-gray-500 text-center mb-10 text-lg">
                            Thank you for your purchase. Your payment was successful and your order is being processed.
                        </Text>
                    </>
                )}

                <View className="w-full space-y-4">
                    <Pressable 
                        onPress={() => router.push('/(tabs)')}
                        className="bg-babyshopBlack w-full py-4 rounded-xl flex-row justify-center items-center shadow-md active:opacity-90"
                    >
                        <Home size={20} color="white"/>
                        <Text className="text-white font-bold text-lg ml-2">Return Home</Text>
                    </Pressable>
                    
                    <Pressable 
                        onPress={() => router.push('/orders')}
                        className="bg-white border border-gray-200 w-full py-4 rounded-xl flex-row justify-center items-center active:bg-gray-50"
                    >
                        <ShoppingBag size={20} color="#334155" />
                        <Text className="text-gray-700 font-bold text-lg ml-2">View My Orders</Text>
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
    );
}
