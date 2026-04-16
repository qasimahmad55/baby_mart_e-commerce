import React, { useState, useCallback, useEffect } from "react";
import { View, Text, ScrollView, ActivityIndicator, Pressable, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchData } from "../../lib/api";
import { Product } from "../../types/types";
import ProductCard from "../../components/common/pages/ProductCard";
import Banner from "../../components/home/Banner";
import CategoriesSection from "../../components/home/CategoriesSection";
import BabyTravelSection from "../../components/home/BabyTravelSection";
import FeaturedServicesSection from "../../components/home/FeaturedServicesSection";
import Footer from "../../components/common/Footer";
import { useRouter, useFocusEffect } from "expo-router";
import { Flame } from "lucide-react-native";

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

  useFocusEffect(
    useCallback(() => {
      loadProducts();
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadProducts();
  }, [loadProducts]);

  if (loading && !refreshing) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <View className="w-16 h-16 rounded-full bg-babyshopSky/10 items-center justify-center mb-4">
          <ActivityIndicator size="large" color="#29beb3" />
        </View>
        <Text className="text-gray-500 font-semibold text-sm">Loading BabyMart...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['bottom']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#29beb3"]} tintColor="#29beb3" />
        }
      >
        <Banner />
        <CategoriesSection />

        {/* Featured Products List */}
        <View className="px-5 pt-5 pb-2">
          <View className="flex-row items-center justify-between mb-5">
            <View className="flex-row items-center gap-2">
              <View className="w-1 h-5 bg-rose-500 rounded-full" />
              <Flame size={18} color="#ef4444" />
              <Text className="text-lg font-extrabold text-gray-900">Hot Products</Text>
            </View>
            <Pressable
              onPress={() => router.push('/shop' as any)}
              className="bg-gray-100 px-4 py-1.5 rounded-full"
            >
              <Text className="text-gray-700 font-bold text-[11px] uppercase tracking-wider">View All</Text>
            </Pressable>
          </View>
          <View className="flex-row flex-wrap justify-between">
            {products.map((product) => (
              <View key={product._id} className="w-[48%] mb-5">
                <ProductCard product={product} />
              </View>
            ))}
          </View>
        </View>

        <BabyTravelSection />
        <FeaturedServicesSection />

        <View className="h-2" />
        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
}
