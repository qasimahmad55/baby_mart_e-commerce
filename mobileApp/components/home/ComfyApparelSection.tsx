import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

const apparelImage = "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800";

export default function ComfyApparelSection() {
    const router = useRouter();

    return (
        <View className="mx-4 my-4">
            <View className="bg-babyshopPurple rounded-3xl overflow-hidden flex-row shadow-lg">
                <View className="w-1/2 p-6 justify-center">
                    <Text className="text-babyshopWhite/70 font-bold text-xs uppercase tracking-widest mb-1">New Arrivals</Text>
                    <Text className="text-2xl font-bold text-white leading-tight">Comfy & Cute Apparel</Text>
                    <Text className="text-white/80 text-xs mt-2 font-medium">For little explorers aged 0-24m</Text>
                    <Pressable
                        onPress={() => router.push('/shop' as any)}
                        className="bg-white self-start px-6 py-2.5 rounded-full mt-5"
                    >
                        <Text className="text-babyshopPurple font-bold text-xs">SHOP CLOTHING</Text>
                    </Pressable>
                </View>

                <View className="w-1/2 relative bg-babyshopPurple/20">
                    <Image
                        source={{ uri: apparelImage }}
                        className="w-full h-full"
                        resizeMode="cover"
                    />
                </View>
            </View>
        </View>
    );
}
