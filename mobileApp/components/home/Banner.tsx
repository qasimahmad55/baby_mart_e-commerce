import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, Dimensions, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { fetchData } from '../../lib/api';
import { Banners } from '../../types/types';

const { width } = Dimensions.get('window');

export default function Banner() {
    const [banners, setBanners] = useState<Banners[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const loadBanners = async () => {
            try {
                const data = await fetchData<Banners[]>("/banners");
                if (data) setBanners(data);
            } catch (error) {
                console.error("Banner fetch error:", error);
            } finally {
                setLoading(false);
            }
        };
        loadBanners();
    }, []);

    if (loading) {
        return (
            <View className="h-48 w-full items-center justify-center bg-gray-50 rounded-xl mx-4 my-2">
                <ActivityIndicator color="#29beb3" />
            </View>
        );
    }

    if (banners.length === 0) return null;

    return (
        <View className="my-3">
            <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16 }}
            >
                {banners.map((banner, index) => (
                    <Pressable
                        key={banner._id || index}
                        onPress={() => router.push('/shop' as any)}
                        style={{ width: width - 32 }}
                        className="h-48 rounded-2xl overflow-hidden relative mr-4"
                    >
                        <Image
                            source={{ uri: banner.image }}
                            className="w-full h-full"
                            style={{ position: 'absolute' }}
                        />
                        <View className="absolute inset-0 bg-black/20 p-5 justify-center">
                            <Text className="text-white text-xs font-bold uppercase tracking-widest">{banner.name}</Text>
                            <Text className="text-white text-2xl font-bold mt-1 mb-3 leading-tight w-2/3">
                                {banner.title}
                            </Text>
                            <View className="bg-white self-start px-4 py-2 rounded-full shadow-sm">
                                <Text className="text-babyshopBlack font-bold text-xs">SHOP NOW</Text>
                            </View>
                        </View>
                    </Pressable>
                ))}
            </ScrollView>
        </View>
    );
}
