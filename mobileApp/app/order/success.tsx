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
                <View className="w-20 h-20 rounded-full bg-babyshopSky/10 items-center justify-center mb-5">
                    <ActivityIndicator size="large" color="#29beb3" />
                </View>
                <Text className="text-gray-500 font-semibold text-sm">Confirming your payment...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-1 justify-center items-center px-8">
                {error ? (
                    <>
                        <View className="w-28 h-28 bg-red-50 rounded-full items-center justify-center mb-8">
                            <AlertCircle size={52} color="#ef4444" />
                        </View>
                        <Text className="text-2xl font-extrabold text-gray-900 text-center mb-3">Something went wrong</Text>
                        <Text className="text-gray-400 text-center text-sm mb-10 leading-5">
                            {error}. If your payment was successful, your order will be updated shortly.
                        </Text>
                    </>
                ) : (
                    <>
                        <View className="w-28 h-28 rounded-full items-center justify-center mb-8" style={{ backgroundColor: '#E8F8F5' }}>
                            <CheckCircle size={52} color="#29beb3" />
                        </View>
                        <Text className="text-3xl font-extrabold text-gray-900 text-center mb-3">Order Placed!</Text>
                        <Text className="text-gray-400 text-center text-sm mb-10 leading-5">
                            Thank you for your purchase. Your payment was successful and your order is being processed.
                        </Text>
                    </>
                )}

                <View className="w-full gap-4">
                    <Pressable 
                        onPress={() => router.push('/(tabs)')}
                        className="bg-gray-900 w-full py-4 rounded-xl flex-row justify-center items-center"
                        style={{
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.15,
                            shadowRadius: 8,
                            elevation: 6,
                        }}
                    >
                        <Home size={18} color="white"/>
                        <Text className="text-white font-bold text-base ml-2">Return Home</Text>
                    </Pressable>
                    
                    <Pressable 
                        onPress={() => router.push('/orders')}
                        className="bg-white w-full py-4 rounded-xl flex-row justify-center items-center"
                        style={{ borderWidth: 1.5, borderColor: '#e5e7eb' }}
                    >
                        <ShoppingBag size={18} color="#475569" />
                        <Text className="text-gray-700 font-bold text-base ml-2">View My Orders</Text>
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
    );
}
