import React from 'react';
import { View, Text, Image, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';

const travelImage = "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=800";

export default function BabyTravelSection() {
    const router = useRouter();

    return (
        <View className="mx-4 my-4">
            <View className="flex-row items-center justify-between mb-4">
                <Text className="text-xl font-bold text-babyshopBlack">Baby Travel</Text>
                <Pressable onPress={() => router.push('/shop' as any)} className="flex-row items-center">
                    <Text className="text-babyshopSky font-bold text-xs uppercase mr-1">Explore</Text>
                    <ChevronRight size={14} color="#29beb3" />
                </Pressable>
            </View>

            <View className="bg-babyshopSky/10 rounded-3xl overflow-hidden relative">
                <View className="p-6 relative z-10 w-2/3">
                    <Text className="text-babyshopSky font-bold text-xs uppercase tracking-widest mb-1">On The Go</Text>
                    <Text className="text-2xl font-bold text-babyshopBlack leading-tight">Comfort & Safety for every journey</Text>
                    <Pressable
                        onPress={() => router.push('/shop' as any)}
                        className="bg-babyshopSky self-start px-6 py-2.5 rounded-full mt-4 shadow-sm"
                    >
                        <Text className="text-white font-bold text-xs">VIEW STROLLERS</Text>
                    </Pressable>
                </View>

                <Image
                    source={{ uri: travelImage }}
                    className="w-1/2 h-full absolute right-0 top-0 opacity-80"
                    resizeMode="cover"
                />
            </View>
        </View>
    );
}
