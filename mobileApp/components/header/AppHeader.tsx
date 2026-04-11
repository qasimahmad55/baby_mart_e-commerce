import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { Heart, Package } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useWishlistStore, useOrderStore } from '../../lib/store';
import SelectCurrency from './SelectCurrency';
import SearchInput from './SearchInput';

const logo = require('../../assets/images/logo.png');

export default function AppHeader() {
    const router = useRouter();
    const wishlistCount = useWishlistStore((state) => state.wishlistIds.length);
    const ordersCount = useOrderStore((state) => state.orders.length);

    return (
        <View className="bg-white border-b border-gray-200 mt-8">
            {/* Top bar with currency */}
            <View className="bg-babyshopPurple px-4 py-1.5 flex-row items-center justify-between">
                <Text className="text-white text-[10px] font-medium flex-1">
                    100% Secure delivery
                </Text>
                <SelectCurrency />
            </View>

            {/* Main header row */}
            <View className="flex-row items-center justify-between px-4 py-2.5">
                {/* Logo */}
                <Pressable onPress={() => router.push('/(tabs)')}>
                    <Image
                        source={logo}
                        className="w-28 h-8"
                        resizeMode="contain"
                    />
                </Pressable>

                {/* Right side icons */}
                <View className="flex-row items-center gap-5">
                    {/* Orders */}
                    <Pressable
                        onPress={() => router.push('/orders' as any)}
                        className="relative"
                    >
                        <Package size={22} color="#333" />
                        <View className="absolute -right-2 -top-2 bg-babyshopSky w-4 h-4 rounded-full items-center justify-center">
                            <Text className="text-white text-[9px] font-bold">
                                {ordersCount > 99 ? '99+' : ordersCount}
                            </Text>
                        </View>
                    </Pressable>

                    {/* Wishlist */}
                    <Pressable
                        onPress={() => router.push('/wishlist' as any)}
                        className="relative"
                    >
                        <Heart size={22} color="#333" />
                        <View className="absolute -right-2 -top-2 bg-babyshopSky w-4 h-4 rounded-full items-center justify-center">
                            <Text className="text-white text-[9px] font-bold">
                                {wishlistCount > 99 ? '99+' : wishlistCount}
                            </Text>
                        </View>
                    </Pressable>
                </View>
            </View>

            {/* Search Bar section */}
            <View className="pb-3">
                <SearchInput />
            </View>
        </View>
    );
}
