import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Alert, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useCartStore, useUserStore } from '../../lib/store';
import { ChevronLeft, MapPin, CreditCard, Lock, AlertCircle, CheckCircle } from 'lucide-react-native';
import PriceFormatter from '../../components/common/PriceFormatter';
import { createOrderFromCart, createStripeCheckoutSession } from '../../lib/orderApi';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

export default function CheckoutScreen() {
    const router = useRouter();
    const { cartItemsWithQuantities, clearCart } = useCartStore();
    const { authUser, auth_token } = useUserStore();
    
    const [selectedAddress, setSelectedAddress] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [isCreatingOrder, setIsCreatingOrder] = useState(false);

    useEffect(() => {
        if (authUser?.addresses && authUser.addresses.length > 0) {
            const defaultAddr = authUser.addresses.find(a => a.isDefault);
            setSelectedAddress(defaultAddr || authUser.addresses[0]);
        }
    }, [authUser]);

    const subtotal = cartItemsWithQuantities.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    const shipping = subtotal > 100 ? 0 : 15;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    const handlePayment = async () => {
        if (!selectedAddress) {
            Alert.alert("Error", "Please select a shipping address");
            return;
        }

        if (!auth_token) {
            Alert.alert("Error", "You must be logged in to checkout");
            return;
        }

        setLoading(true);
        try {
            // 1. Create order
            setIsCreatingOrder(true);
            const orderItems = cartItemsWithQuantities.map((item) => ({
                _id: item.product._id,
                name: item.product.name,
                price: item.product.price,
                quantity: item.quantity,
                image: item.product.image,
            }));

            const orderResponse = await createOrderFromCart(auth_token, orderItems, {
                street: selectedAddress.street,
                city: selectedAddress.city,
                country: selectedAddress.country,
                postalCode: selectedAddress.postalCode,
            });

            if (!orderResponse.success) {
                throw new Error(orderResponse.message || "Failed to create order");
            }

            const order = orderResponse.order;

            // 2. Create Stripe Session
            const stripeItems = cartItemsWithQuantities.map((item) => ({
                name: item.product.name,
                description: `Quantity: ${item.quantity}`,
                amount: Math.round(item.product.price * 100),
                currency: "usd",
                quantity: item.quantity,
                images: item.product.image ? [item.product.image] : [],
            }));

            const successUrl = Linking.createURL('order/success', {
                queryParams: { orderId: order._id },
            });
            const cancelUrl = Linking.createURL('order/checkout', {
                queryParams: { orderId: order._id },
            });

            const stripeResponse = await createStripeCheckoutSession(auth_token, {
                items: stripeItems,
                customerEmail: authUser?.email || "",
                successUrl,
                cancelUrl,
                metadata: {
                    orderId: order._id,
                }
            });

            if (!stripeResponse.success || !stripeResponse.url) {
                throw new Error(stripeResponse.message || "Failed to initialize payment");
            }

            // 3. Open Browser
            await WebBrowser.openBrowserAsync(stripeResponse.url);

        } catch (error: any) {
            Alert.alert("Payment Error", error.message || "Something went wrong");
        } finally {
            setLoading(false);
            setIsCreatingOrder(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <View className="bg-white px-4 py-3 flex-row items-center border-b border-gray-200">
                <Pressable onPress={() => router.back()} className="mr-3 p-1">
                    <ChevronLeft size={24} color="#333" />
                </Pressable>
                <Text className="text-lg font-bold text-gray-900">Checkout</Text>
            </View>

            <ScrollView className="flex-1 px-4 py-6" showsVerticalScrollIndicator={false}>
                {/* Shipping Address */}
                <View className="mb-6">
                    <Text className="text-xl font-bold text-gray-900 mb-4">Shipping Address</Text>
                    {authUser?.addresses && authUser.addresses.length > 0 ? (
                        authUser.addresses.map((addr) => (
                            <Pressable 
                                key={addr._id}
                                onPress={() => setSelectedAddress(addr)}
                                className={`p-4 rounded-xl border mb-3 flex-row items-center bg-white ${selectedAddress?._id === addr._id ? 'border-babyshopSky bg-cyan-50' : 'border-gray-200'}`}
                            >
                                <View className="mr-3">
                                    <MapPin size={20} color={selectedAddress?._id === addr._id ? "#29beb3" : "#94a3b8"} />
                                </View>
                                <View className="flex-1">
                                    <Text className="font-semibold text-gray-800">{addr.street}</Text>
                                    <Text className="text-gray-500 text-xs">{addr.city}, {addr.postalCode}, {addr.country}</Text>
                                </View>
                                {selectedAddress?._id === addr._id && (
                                    <CheckCircle size={20} color="#29beb3" />
                                )}
                            </Pressable>
                        ))
                    ) : (
                        <View className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex-row items-center">
                            <AlertCircle size={20} color="#eab308" className="mr-2" />
                            <Text className="text-yellow-700 font-medium">Please add an address in your profile first</Text>
                        </View>
                    )}
                </View>

                {/* Order Summary */}
                <View className="mb-6 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <Text className="text-lg font-bold text-gray-900 mb-4">Order Summary</Text>
                    <View className="space-y-3">
                        <View className="flex-row justify-between mb-2">
                            <Text className="text-gray-500">Subtotal</Text>
                            <PriceFormatter amount={subtotal} className="text-gray-800 font-medium" />
                        </View>
                        <View className="flex-row justify-between mb-2">
                            <Text className="text-gray-500">Shipping</Text>
                            <Text className={shipping === 0 ? "text-green-600 font-medium" : "text-gray-800 font-medium"}>
                                {shipping === 0 ? "Free" : <PriceFormatter amount={shipping} />}
                            </Text>
                        </View>
                        <View className="flex-row justify-between mb-2">
                            <Text className="text-gray-500">Estimated Tax</Text>
                            <PriceFormatter amount={tax} className="text-gray-800 font-medium" />
                        </View>
                        <View className="h-[1px] bg-gray-100 my-2" />
                        <View className="flex-row justify-between items-center">
                            <Text className="text-lg font-bold text-gray-900">Total</Text>
                            <PriceFormatter amount={total} className="text-xl font-bold text-babyshopBlack" />
                        </View>
                    </View>
                </View>

                {/* Secure Payment Note */}
                <View className="flex-row items-center justify-center space-x-2 mb-10">
                    <Lock size={14} color="#64748b" />
                    <Text className="text-gray-400 text-xs text-center">Your payment is secured with 256-bit SSL encryption</Text>
                </View>
            </ScrollView>

            <View className="p-5 bg-white border-t border-gray-100 shadow-2xl">
                <Pressable 
                    onPress={handlePayment}
                    disabled={loading || !selectedAddress || cartItemsWithQuantities.length === 0}
                    className={`flex-row justify-center items-center py-4 rounded-xl shadow-lg ${loading || !selectedAddress ? 'bg-gray-300' : 'bg-babyshopBlack'}`}
                >
                    {loading ? (
                        <>
                            <ActivityIndicator color="white" className="mr-2" />
                            <Text className="text-white font-bold text-lg">
                                {isCreatingOrder ? "Creating Order..." : "Processing..."}
                            </Text>
                        </>
                    ) : (
                        <>
                            <CreditCard size={20} color="white"/>
                            <Text className="text-white font-bold text-lg ml-2">Pay with Stripe</Text>
                        </>
                    )}
                </Pressable>
            </View>
        </SafeAreaView>
    );
}
