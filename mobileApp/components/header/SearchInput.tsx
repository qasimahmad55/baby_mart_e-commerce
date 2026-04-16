import React, { useState, useEffect, useCallback } from 'react';
import { View, TextInput, Pressable, FlatList, Text, Image, ActivityIndicator } from 'react-native';
import { Search, X } from 'lucide-react-native';
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
            <View
                className="flex-row items-center bg-gray-50 mx-5 mt-1 px-4"
                style={{ 
                    borderRadius: 14,
                    height: 44,
                    borderWidth: 1,
                    borderColor: '#f1f5f9',
                }}
            >
                <Search size={18} color="#94a3b8" />
                <TextInput
                    className="flex-1 ml-3 text-gray-800 text-sm"
                    placeholder="Search baby products..."
                    placeholderTextColor="#c0c0c0"
                    value={search}
                    onChangeText={setSearch}
                    onFocus={() => search.trim() && setShowResults(true)}
                />
                {search.length > 0 && (
                    <Pressable 
                        onPress={() => { setSearch(""); setProducts([]); setShowResults(false); }}
                        className="w-7 h-7 rounded-lg bg-gray-100 items-center justify-center"
                    >
                        <X size={14} color="#94a3b8" />
                    </Pressable>
                )}
            </View>

            {showResults && (
                <View
                    className="absolute top-14 left-5 right-5 bg-white max-h-80 overflow-hidden"
                    style={{
                        borderRadius: 18,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 8 },
                        shadowOpacity: 0.12,
                        shadowRadius: 16,
                        elevation: 10,
                        borderWidth: 1,
                        borderColor: '#f1f5f9',
                    }}
                >
                    {loading ? (
                        <View className="p-8 items-center">
                            <ActivityIndicator color="#29beb3" size="small" />
                            <Text className="text-gray-400 mt-2 text-sm">Searching...</Text>
                        </View>
                    ) : products.length > 0 ? (
                        <FlatList
                            data={products}
                            keyExtractor={(item) => item._id}
                            renderItem={({ item }) => (
                                <Pressable
                                    onPress={() => handleSelectProduct(item._id)}
                                    className="flex-row items-center p-3.5 active:bg-gray-50"
                                    style={{ borderBottomWidth: 1, borderBottomColor: '#f9fafb' }}
                                >
                                    <View style={{ width: 44, height: 44, borderRadius: 12, overflow: 'hidden', backgroundColor: '#f9fafb' }}>
                                        <Image source={{ uri: item.image }} className="w-full h-full" resizeMode="contain" />
                                    </View>
                                    <View className="flex-1 ml-3">
                                        <Text className="text-sm font-semibold text-gray-800" numberOfLines={1}>{item.name}</Text>
                                        <PriceFormatter amount={item.price} className="text-xs text-babyshopSky font-bold mt-1" />
                                    </View>
                                </Pressable>
                            )}
                            ListFooterComponent={
                                <Pressable
                                    onPress={() => {
                                        setShowResults(false);
                                        router.push({ pathname: '/shop' as any, params: { search: debouncedSearch } });
                                    }}
                                    className="p-3.5 items-center bg-gray-50"
                                    style={{ borderBottomLeftRadius: 18, borderBottomRightRadius: 18 }}
                                >
                                    <Text className="text-babyshopSky font-bold text-xs uppercase tracking-wider">View All Results</Text>
                                </Pressable>
                            }
                        />
                    ) : (
                        <View className="p-8 items-center">
                            <Text className="text-gray-400 text-sm">No products found for "{search}"</Text>
                        </View>
                    )}
                </View>
            )}
        </View>
    );
}
