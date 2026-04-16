import React, { useState, useEffect, useCallback } from "react";
import { View, Text, ScrollView, ActivityIndicator, Pressable, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchData } from "../../lib/api";
import { Product, Category, Brand } from "../../types/types";
import ProductCard from "../../components/common/pages/ProductCard";
import Footer from "../../components/common/Footer";
import FilterModal from "../../components/shop/FilterModal";
import { SlidersHorizontal, Search, ShoppingBag } from "lucide-react-native";

interface ProductsResponse {
    products: Product[];
    total: number;
}

interface Filters {
    category: string;
    brand: string;
    priceRange: [number, number] | null;
    sortOrder: "asc" | "desc";
}

export default function ShopScreen() {
    const [products, setProducts] = useState<Product[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 10;

    // Filter contexts
    const [categories, setCategories] = useState<Category[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [isFilterModalVisible, setFilterModalVisible] = useState(false);

    const [filters, setFilters] = useState<Filters>({
        category: "",
        brand: "",
        priceRange: null,
        sortOrder: "asc"
    });

    const [appliedFilters, setAppliedFilters] = useState<Filters>({
        category: "",
        brand: "",
        priceRange: null,
        sortOrder: "asc"
    });

    const fetchDropdownData = async () => {
        try {
            const [catRes, brandRes] = await Promise.all([
                fetchData<{categories: Category[]}>("/categories"),
                fetchData<Brand[]>("/brands")
            ]);
            setCategories(catRes.categories || []);
            setBrands(brandRes || []);
        } catch (error) {
            console.error("Failed to fetch dropdown data:", error);
        }
    };

    const loadProducts = useCallback(async (page: number, currentFilters: Filters, isLoadMore = false) => {
        if (isLoadMore) {
            setLoadingMore(true);
        } else {
            setLoading(true);
        }

        try {
            const params = new URLSearchParams();
            if (currentFilters.category) params.append("category", currentFilters.category);
            if (currentFilters.brand) params.append("brand", currentFilters.brand);
            if (currentFilters.priceRange) {
                params.append("priceMin", currentFilters.priceRange[0].toString());
                params.append("priceMax", currentFilters.priceRange[1].toString());
            }
            params.append("page", page.toString());
            params.append("limit", productsPerPage.toString());
            params.append("sortOrder", currentFilters.sortOrder);

            const data = await fetchData<ProductsResponse>(`/products?${params.toString()}`);
            if (data && data.products) {
                setTotal(data.total);
                if (isLoadMore) {
                    setProducts(prev => [...prev, ...data.products]);
                } else {
                    setProducts(data.products);
                }
            }
        } catch (error) {
            console.error("Shop products fetch error:", error);
            if (!isLoadMore) setProducts([]);
            setTotal(0);
        } finally {
            setLoading(false);
            setLoadingMore(false);
            setRefreshing(false);
        }
    }, [productsPerPage]);

    useEffect(() => {
        fetchDropdownData();
    }, []);

    useEffect(() => {
        loadProducts(1, appliedFilters, false);
    }, [appliedFilters, loadProducts]);

    useEffect(() => {
        if (currentPage > 1) {
            loadProducts(currentPage, appliedFilters, true);
        }
    }, [currentPage, appliedFilters, loadProducts]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setCurrentPage(1);
        loadProducts(1, appliedFilters, false);
    }, [appliedFilters, loadProducts]);

    const handleApplyFilters = () => {
        setAppliedFilters(filters);
        setCurrentPage(1);
        setFilterModalVisible(false);
    };

    const handleResetFilters = () => {
        const defaultFilters: Filters = { category: "", brand: "", priceRange: null, sortOrder: "asc" };
        setFilters(defaultFilters);
        setAppliedFilters(defaultFilters);
        setCurrentPage(1);
        setFilterModalVisible(false);
    };

    const activeFilterCount = 
        (appliedFilters.category ? 1 : 0) + 
        (appliedFilters.brand ? 1 : 0) + 
        (appliedFilters.priceRange ? 1 : 0) + 
        (appliedFilters.sortOrder !== "asc" ? 1 : 0);

    const totalPages = Math.ceil(total / productsPerPage);
    const hasMoreProducts = products.length < total && currentPage < totalPages;

    return (
        <SafeAreaView className="flex-1 bg-gray-50" edges={['bottom']}>
            {/* Shop Header */}
            <View
                className="px-5 py-4 bg-white flex-row items-center justify-between"
                style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.04,
                    shadowRadius: 6,
                    elevation: 3,
                }}
            >
                <View>
                    <Text className="text-xl font-extrabold text-gray-900">Shop</Text>
                    <Text className="text-xs text-gray-400 mt-0.5 font-medium">
                        {loading && !refreshing ? "Loading..." : `${products.length} of ${total} products`}
                    </Text>
                </View>
                <Pressable 
                    onPress={() => setFilterModalVisible(true)}
                    className="flex-row items-center px-4 py-2.5 bg-gray-50 rounded-xl"
                    style={{
                        borderWidth: 1,
                        borderColor: activeFilterCount > 0 ? '#29beb3' : '#e5e7eb',
                    }}
                >
                    <SlidersHorizontal size={16} color={activeFilterCount > 0 ? '#29beb3' : '#475569'} />
                    <Text className={`font-bold text-sm ml-2 ${activeFilterCount > 0 ? 'text-babyshopSky' : 'text-gray-700'}`}>Filters</Text>
                    {activeFilterCount > 0 && (
                        <View className="ml-2 w-5 h-5 bg-babyshopSky rounded-full items-center justify-center">
                            <Text className="text-white text-[10px] font-bold">{activeFilterCount}</Text>
                        </View>
                    )}
                </Pressable>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#29beb3"]} tintColor="#29beb3" />}
            >
                {loading && !refreshing && products.length === 0 ? (
                    <View className="h-64 items-center justify-center">
                        <View className="w-14 h-14 rounded-full bg-babyshopSky/10 items-center justify-center mb-3">
                            <ActivityIndicator size="large" color="#29beb3" />
                        </View>
                        <Text className="text-gray-400 text-sm font-medium">Loading products...</Text>
                    </View>
                ) : products.length > 0 ? (
                    <View className="px-5 py-5">
                        <View className="flex-row flex-wrap justify-between">
                            {products.map((product, index) => (
                                <View key={`${product._id}-${index}`} className="w-[48%] mb-5">
                                    <ProductCard product={product} />
                                </View>
                            ))}
                        </View>
                        
                        {hasMoreProducts && (
                            <Pressable 
                                onPress={() => setCurrentPage(prev => prev + 1)}
                                disabled={loadingMore}
                                className="w-full py-4 mt-2 bg-gray-900 items-center justify-center rounded-xl"
                                style={{
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 6,
                                    elevation: 3,
                                    opacity: loadingMore ? 0.7 : 1,
                                }}
                            >
                                {loadingMore ? (
                                    <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                    <Text className="font-bold text-white text-sm uppercase tracking-wider">Load More</Text>
                                )}
                            </Pressable>
                        )}
                        {!hasMoreProducts && products.length > 0 && total > 0 && (
                            <View className="items-center py-6">
                                <Text className="text-gray-400 text-center text-sm font-medium">🎉 You've seen it all!</Text>
                                <Text className="text-gray-300 text-xs mt-1">All {products.length} products shown</Text>
                            </View>
                        )}
                    </View>
                ) : (
                    <View className="flex-1 items-center justify-center py-20 px-6">
                        <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-5">
                            <ShoppingBag size={36} color="#d1d5db" />
                        </View>
                        <Text className="text-lg font-bold text-gray-700 mt-2 text-center">No products found</Text>
                        <Text className="text-gray-400 text-center mt-2 mb-6 text-sm">Try adjusting your filters to find what you're looking for.</Text>
                        {activeFilterCount > 0 && (
                            <Pressable 
                                onPress={handleResetFilters}
                                className="px-7 py-3.5 bg-babyshopSky rounded-xl"
                                style={{
                                    shadowColor: '#29beb3',
                                    shadowOffset: { width: 0, height: 3 },
                                    shadowOpacity: 0.25,
                                    shadowRadius: 6,
                                    elevation: 4,
                                }}
                            >
                                <Text className="font-bold text-white text-sm">Clear All Filters</Text>
                            </Pressable>
                        )}
                    </View>
                )}

                <Footer />
            </ScrollView>

            <FilterModal 
                visible={isFilterModalVisible}
                onClose={() => setFilterModalVisible(false)}
                filters={filters}
                setFilters={setFilters}
                categories={categories}
                brands={brands}
                onApply={handleApplyFilters}
                onReset={handleResetFilters}
            />
        </SafeAreaView>
    );
}
