import React, { useEffect, useState, useCallback } from "react";
import { View, Text, ScrollView, ActivityIndicator, Pressable, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchData } from "../../lib/api";
import { Product } from "../../types/types";
import ProductCard from "../../components/common/pages/ProductCard";
import Banner from "../../components/home/Banner";
import CategoriesSection from "../../components/home/CategoriesSection";
import BabyTravelSection from "../../components/home/BabyTravelSection";
import ComfyApparelSection from "../../components/home/ComfyApparelSection";
import FeaturedServicesSection from "../../components/home/FeaturedServicesSection";
import { useRouter } from "expo-router";

interface ProductsResponse {
  products: Product[];
  total: number;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const loadProducts = useCallback(async () => {
    try {
      const data = await fetchData<ProductsResponse>("/products?page=1&limit=6");
      if (data && data.products) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error("Home products fetch error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadProducts();
  }, [loadProducts]);

  if (loading && !refreshing) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#29beb3" />
        <Text className="mt-4 text-gray-500 font-medium">Preparing BabyMart Experience...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['bottom']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#29beb3"]} />
        }
      >
        <Banner />
        <CategoriesSection />

        {/* Featured Products List */}
        <View className="px-4 py-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-xl font-bold text-babyshopBlack">Hot Products</Text>
            <Pressable onPress={() => router.push('/shop' as any)}>
              <Text className="text-babyshopSky font-bold text-xs uppercase">View All</Text>
            </Pressable>
          </View>
          <View className="flex-row flex-wrap justify-between">
            {products.map((product) => (
              <View key={product._id} className="w-[48%] mb-4">
                <ProductCard product={product} />
              </View>
            ))}
          </View>
        </View>

        <BabyTravelSection />
        <ComfyApparelSection />
        <FeaturedServicesSection />

        <View className="h-4" />
      </ScrollView>
    </SafeAreaView>
  );
}
