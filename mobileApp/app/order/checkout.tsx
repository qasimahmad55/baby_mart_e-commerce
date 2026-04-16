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
            {/* Header */}
            <View
                className="bg-white px-5 py-3.5 flex-row items-center"
                style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.04,
                    shadowRadius: 6,
                    elevation: 3,
                }}
            >
                <Pressable onPress={() => router.back()} className="w-9 h-9 rounded-xl bg-gray-50 items-center justify-center mr-3">
                    <ChevronLeft size={20} color="#475569" />
                </Pressable>
                <Text className="text-lg font-extrabold text-gray-900">Checkout</Text>
            </View>

            <ScrollView className="flex-1 px-5 py-6" showsVerticalScrollIndicator={false}>
                {/* Shipping Address */}
                <View className="mb-6">
                    <View className="flex-row items-center gap-2 mb-4">
                        <View className="w-1 h-5 bg-babyshopSky rounded-full" />
                        <Text className="text-base font-extrabold text-gray-900">Shipping Address</Text>
                    </View>
                    {authUser?.addresses && authUser.addresses.length > 0 ? (
                        authUser.addresses.map((addr) => (
                            <Pressable 
                                key={addr._id}
                                onPress={() => setSelectedAddress(addr)}
                                className="p-4 mb-3 flex-row items-center bg-white"
                                style={{
                                    borderRadius: 16,
                                    borderWidth: 1.5,
                                    borderColor: selectedAddress?._id === addr._id ? '#29beb3' : '#f1f5f9',
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 1 },
                                    shadowOpacity: 0.03,
                                    shadowRadius: 4,
                                    elevation: 1,
                                }}
                            >
                                <View className="mr-3">
                                    <View className="w-10 h-10 rounded-xl items-center justify-center" style={{ backgroundColor: selectedAddress?._id === addr._id ? '#E8F8F5' : '#f9fafb' }}>
                                        <MapPin size={18} color={selectedAddress?._id === addr._id ? "#29beb3" : "#94a3b8"} />
                                    </View>
                                </View>
                                <View className="flex-1">
                                    <Text className="font-bold text-sm text-gray-800">{addr.street}</Text>
                                    <Text className="text-gray-400 text-xs mt-0.5">{addr.city}, {addr.postalCode}, {addr.country}</Text>
                                </View>
                                {selectedAddress?._id === addr._id && (
                                    <CheckCircle size={20} color="#29beb3" />
                                )}
                            </Pressable>
                        ))
                    ) : (
                        <View className="p-4 bg-amber-50 rounded-2xl flex-row items-center" style={{ borderWidth: 1, borderColor: '#fde68a' }}>
                            <AlertCircle size={18} color="#d97706" />
                            <Text className="text-amber-700 font-medium text-sm ml-3">Please add an address in your profile first</Text>
                        </View>
                    )}
                </View>

                {/* Order Summary */}
                <View
                    className="mb-6 bg-white p-5"
                    style={{
                        borderRadius: 20,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.04,
                        shadowRadius: 8,
                        elevation: 2,
                    }}
                >
                    <View className="flex-row items-center gap-2 mb-4">
                        <View className="w-1 h-5 bg-babyshopPurple rounded-full" />
                        <Text className="text-base font-extrabold text-gray-900">Order Summary</Text>
                    </View>
                    <View>
                        <View className="flex-row justify-between mb-3">
                            <Text className="text-gray-400 text-sm">Subtotal</Text>
                            <PriceFormatter amount={subtotal} className="text-gray-800 font-semibold text-sm" />
                        </View>
                        <View className="flex-row justify-between mb-3">
                            <Text className="text-gray-400 text-sm">Shipping</Text>
                            <Text className={`font-semibold text-sm ${shipping === 0 ? "text-green-600" : "text-gray-800"}`}>
                                {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                            </Text>
                        </View>
                        <View className="flex-row justify-between mb-3">
                            <Text className="text-gray-400 text-sm">Estimated Tax</Text>
                            <PriceFormatter amount={tax} className="text-gray-800 font-semibold text-sm" />
                        </View>
                        <View className="h-[1px] bg-gray-100 my-3" />
                        <View className="flex-row justify-between items-center">
                            <Text className="text-base font-extrabold text-gray-900">Total</Text>
                            <PriceFormatter amount={total} className="text-xl font-extrabold text-gray-900" />
                        </View>
                    </View>
                </View>

                {/* Secure Payment Note */}
                <View className="flex-row items-center justify-center gap-2 mb-10">
                    <Lock size={12} color="#94a3b8" />
                    <Text className="text-gray-300 text-[10px] text-center font-medium">Secured with 256-bit SSL encryption</Text>
                </View>
            </ScrollView>

            <View
                className="px-5 py-5 bg-white"
                style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -4 },
                    shadowOpacity: 0.08,
                    shadowRadius: 12,
                    elevation: 12,
                }}
            >
                <Pressable 
                    onPress={handlePayment}
                    disabled={loading || !selectedAddress || cartItemsWithQuantities.length === 0}
                    className="flex-row justify-center items-center py-4 rounded-xl"
                    style={{
                        backgroundColor: loading || !selectedAddress ? '#d1d5db' : '#1e293b',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: loading || !selectedAddress ? 0 : 0.15,
                        shadowRadius: 8,
                        elevation: loading || !selectedAddress ? 0 : 6,
                    }}
                >
                    {loading ? (
                        <>
                            <ActivityIndicator color="white" />
                            <Text className="text-white font-bold text-base ml-2">
                                {isCreatingOrder ? "Creating Order..." : "Processing..."}
                            </Text>
                        </>
                    ) : (
                        <>
                            <CreditCard size={18} color="white"/>
                            <Text className="text-white font-bold text-base ml-2">Pay with Stripe</Text>
                        </>
                    )}
                </Pressable>
            </View>
        </SafeAreaView>
    );
}
