import React, { useState, useEffect, useCallback } from 'react';
import { View, TextInput, Pressable, FlatList, Text, Image, ActivityIndicator } from 'react-native';
import { Search, X, ShoppingCart } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useDebounce } from 'use-debounce';
import { Product } from '../../types/types';
import { fetchData } from '../../lib/api';
import PriceFormatter from '../common/PriceFormatter';

interface ProductsResponse {
    products: Product[];
    total: number;
}

export default function SearchInput() {
    const [search, setSearch] = useState("");
    const [debouncedSearch] = useDebounce(search, 300);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const router = useRouter();

    const fetchProducts = useCallback(async (searchTerm: string) => {
        if (!searchTerm.trim()) {
            setProducts([]);
            setShowResults(false);
            return;
        }

        setLoading(true);
        try {
            const response = await fetchData<ProductsResponse>(`/products?page=1&limit=10&search=${encodeURIComponent(searchTerm)}`);
            if (response && response.products) {
                setProducts(response.products);
                setShowResults(true);
            }
        } catch (error) {
            console.error("Search error:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts(debouncedSearch);
    }, [debouncedSearch, fetchProducts]);

    const handleSelectProduct = (productId: string) => {
        setSearch("");
        setShowResults(false);
        router.push(`/product/${productId}` as any);
    };

    return (
        <View className="relative z-50">
            <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2 mt-2 mx-4 border border-gray-200">
                <Search size={20} color="#666" />
                <TextInput
                    className="flex-1 ml-2 text-gray-800 text-sm leading-tight h-10"
                    placeholder="Search for baby products..."
                    placeholderTextColor="#999"
                    value={search}
                    onChangeText={setSearch}
                    onFocus={() => search.trim() && setShowResults(true)}
                />
                {search.length > 0 && (
                    <Pressable onPress={() => { setSearch(""); setProducts([]); setShowResults(false); }}>
                        <X size={20} color="#666" />
                    </Pressable>
                )}
            </View>

            {showResults && (
                <View className="absolute top-14 left-4 right-4 bg-white rounded-2xl shadow-xl border border-gray-100 max-h-80 overflow-hidden">
                    {loading ? (
                        <View className="p-8 items-center">
                            <ActivityIndicator color="#29beb3" />
                            <Text className="text-gray-500 mt-2">Searching...</Text>
                        </View>
                    ) : products.length > 0 ? (
                        <FlatList
                            data={products}
                            keyExtractor={(item) => item._id}
                            renderItem={({ item }) => (
                                <Pressable
                                    onPress={() => handleSelectProduct(item._id)}
                                    className="flex-row items-center p-3 border-b border-gray-50 active:bg-gray-50"
                                >
                                    <View className="w-12 h-12 bg-gray-50 rounded-lg overflow-hidden">
                                        <Image source={{ uri: item.image }} className="w-full h-full" resizeMode="contain" />
                                    </View>
                                    <View className="flex-1 ml-3">
                                        <Text className="text-sm font-semibold text-gray-800" numberOfLines={1}>{item.name}</Text>
                                        <Text className="text-xs text-babyshopSky font-bold mt-1">
                                            $ {item.price}
                                        </Text>
                                    </View>
                                </Pressable>
                            )}
                            ListFooterComponent={
                                <Pressable
                                    onPress={() => {
                                        setShowResults(false);
                                        router.push({ pathname: '/shop' as any, params: { search: debouncedSearch } });
                                    }}
                                    className="p-3 items-center"
                                >
                                    <Text className="text-babyshopSky font-bold text-xs uppercase tracking-wider">View All Results</Text>
                                </Pressable>
                            }
                        />
                    ) : (
                        <View className="p-8 items-center">
                            <Text className="text-gray-400">No products found for "{search}"</Text>
                        </View>
                    )}
                </View>
            )}
        </View>
    );
}
