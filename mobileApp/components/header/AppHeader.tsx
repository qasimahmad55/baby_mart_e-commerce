import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { Heart, Package, Bell } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useWishlistStore, useOrderStore } from '../../lib/store';
import SelectCurrency from './SelectCurrency';
import SearchInput from './SearchInput';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const logo = require('../../assets/images/logo.png');

export default function AppHeader() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const wishlistCount = useWishlistStore((state) => state.wishlistIds.length);
    const ordersCount = useOrderStore((state) => state.orders.length);

    return (
        <View
            style={{
                paddingTop: insets.top,
                backgroundColor: '#fff',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 8,
                elevation: 4,
            }}
        >
            {/* Main header row */}
            <View className="flex-row items-center justify-between px-5 py-3">
                {/* Logo */}
                <Pressable onPress={() => router.push('/(tabs)')}>
                    <Image
                        source={logo}
                        className="w-32 h-9"
                        resizeMode="contain"
                    />
                </Pressable>

                {/* Right side icons */}
                <View className="flex-row items-center gap-2">
                    {/* Currency */}
                    <SelectCurrency />

                    {/* Orders */}
                    <Pressable
                        onPress={() => router.push('/orders' as any)}
                        className="relative w-10 h-10 rounded-full bg-gray-50 items-center justify-center"
                    >
                        <Package size={20} color="#475569" />
                        {ordersCount > 0 && (
                            <View
                                className="absolute -right-0.5 -top-0.5 bg-babyshopSky rounded-full items-center justify-center"
                                style={{ minWidth: 18, height: 18, paddingHorizontal: 4 }}
                            >
                                <Text className="text-white text-[10px] font-bold">
                                    {ordersCount > 99 ? '99+' : ordersCount}
                                </Text>
                            </View>
                        )}
                    </Pressable>

                    {/* Wishlist */}
                    <Pressable
                        onPress={() => router.push('/wishlist' as any)}
                        className="relative w-10 h-10 rounded-full bg-gray-50 items-center justify-center"
                    >
                        <Heart size={20} color="#475569" />
                        {wishlistCount > 0 && (
                            <View
                                className="absolute -right-0.5 -top-0.5 bg-rose-500 rounded-full items-center justify-center"
                                style={{ minWidth: 18, height: 18, paddingHorizontal: 4 }}
                            >
                                <Text className="text-white text-[10px] font-bold">
                                    {wishlistCount > 99 ? '99+' : wishlistCount}
                                </Text>
                            </View>
                        )}
                    </Pressable>
                </View>
            </View>

            {/* Search Bar */}
            <View className="pb-2.5">
                <SearchInput />
            </View>
        </View>
    );
}
