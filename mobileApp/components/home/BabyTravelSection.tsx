import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';

const travelImage = "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=800";

export default function BabyTravelSection() {
    const router = useRouter();

    return (
        <View className="mx-5 my-4">
            <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center gap-2">
                    <View className="w-1 h-5 bg-babyshopPurple rounded-full" />
                    <Text className="text-lg font-extrabold text-gray-900">Baby Travel</Text>
                </View>
                <Pressable onPress={() => router.push('/shop' as any)} className="flex-row items-center">
                    <Text className="text-babyshopPurple font-bold text-xs uppercase tracking-wider mr-1">Explore</Text>
                    <ChevronRight size={14} color="#a96bde" />
                </Pressable>
            </View>

            <View
                className="overflow-hidden relative"
                style={{
                    borderRadius: 22,
                    shadowColor: '#a96bde',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.15,
                    shadowRadius: 12,
                    elevation: 5,
                }}
            >
                {/* Background image */}
                <Image
                    source={{ uri: travelImage }}
                    className="absolute right-0 top-0 w-full h-full opacity-30"
                    resizeMode="cover"
                />

                {/* Gradient-like tint */}
                <View className="absolute inset-0 bg-violet-50" style={{ opacity: 0.85 }} />

                <View className="p-7 relative z-10 w-3/4">
                    <View className="bg-babyshopPurple/20 self-start px-3 py-1 rounded-full mb-3">
                        <Text className="text-babyshopPurple font-bold text-[10px] uppercase tracking-widest">On The Go</Text>
                    </View>
                    <Text className="text-2xl font-extrabold text-gray-900 leading-tight mb-1">Comfort & Safety</Text>
                    <Text className="text-sm text-gray-600 mb-5">for every journey</Text>
                    <Pressable
                        onPress={() => router.push('/shop' as any)}
                        className="bg-babyshopPurple self-start px-6 py-3 rounded-full"
                        style={{
                            shadowColor: '#a96bde',
                            shadowOffset: { width: 0, height: 3 },
                            shadowOpacity: 0.3,
                            shadowRadius: 6,
                            elevation: 4,
                        }}
                    >
                        <Text className="text-white font-bold text-xs uppercase tracking-wider">View Strollers</Text>
                    </Pressable>
                </View>

                {/* Floating image on the right */}
                <Image
                    source={{ uri: travelImage }}
                    className="absolute right-0 top-0 w-2/5 h-full"
                    resizeMode="cover"
                    style={{ borderTopRightRadius: 22, borderBottomRightRadius: 22, opacity: 0.9 }}
                />
            </View>
        </View>
    );
}
