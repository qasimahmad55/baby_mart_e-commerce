import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { fetchData } from '../../lib/api';
import { Category } from '../../types/types';

interface CategoriesResponse {
    categories: Category[];
}

export default function CategoriesSection() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await fetchData<CategoriesResponse>("/categories");
                if (data && data.categories) {
                    setCategories(data.categories);
                }
            } catch (error) {
                console.error("Categories fetch error:", error);
            } finally {
                setLoading(false);
            }
        };
        loadCategories();
    }, []);

    const featuredCategories = categories.filter((c) => c.categoryType === "Featured");

    if (loading) {
        return (
            <View className="my-4 px-4 h-24 items-center justify-center">
                <ActivityIndicator color="#29beb3" />
            </View>
        );
    }

    if (categories.length === 0) return null;

    return (
        <View className="my-2">
            <View className="flex-row items-center justify-between px-4 mb-3">
                <Text className="text-lg font-bold text-gray-900">Featured Categories</Text>
                <Pressable onPress={() => router.push('/shop' as any)}>
                    <Text className="text-babyshopSky font-bold text-xs uppercase">View All</Text>
                </Pressable>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16 }}
            >
                {featuredCategories.map((item) => (
                    <Pressable
                        key={item._id}
                        onPress={() => router.push({ pathname: '/shop' as any, params: { category: item._id } })}
                        className="items-center mr-6"
                    >
                        <View className="w-16 h-16 bg-white rounded-2xl p-3 border border-gray-100 shadow-sm items-center justify-center">
                            <Image
                                source={{ uri: item.image?.replace('.svg', '.png') }}
                                className="w-full h-full"
                                resizeMode="contain"
                            />
                        </View>
                        <Text className="text-xs font-semibold text-gray-700 mt-2 text-center" numberOfLines={1}>
                            {item.name}
                        </Text>
                    </Pressable>
                ))}
            </ScrollView>
        </View>
    );
}
