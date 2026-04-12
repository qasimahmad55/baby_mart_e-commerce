import React, { useState, useEffect, useCallback } from "react";
import { View, Text, ScrollView, ActivityIndicator, Pressable, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchData } from "../../lib/api";
import { Product, Category, Brand } from "../../types/types";
import ProductCard from "../../components/common/pages/ProductCard";
import Footer from "../../components/common/Footer";
import FilterModal from "../../components/shop/FilterModal";
import { SlidersHorizontal, Search, X } from "lucide-react-native";

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
            <View className="px-4 py-3 bg-white border-b border-gray-200 flex-row items-center justify-between">
                <View>
                    <Text className="text-xl font-bold text-gray-900">Shop Products</Text>
                    <Text className="text-sm text-gray-500 mt-1">
                        {loading && !refreshing ? "Loading..." : `Showing ${products.length} of ${total} products`}
                    </Text>
                </View>
                <Pressable 
                    onPress={() => setFilterModalVisible(true)}
                    className="flex-row items-center px-4 py-2 bg-gray-100 rounded-full border border-gray-200"
                >
                    <SlidersHorizontal size={16} color="#333" className="mr-2" />
                    <Text className="font-bold text-gray-800">Filters</Text>
                    {activeFilterCount > 0 && (
                        <View className="ml-2 w-5 h-5 bg-babyshopSky rounded-full items-center justify-center">
                            <Text className="text-white text-xs font-bold">{activeFilterCount}</Text>
                        </View>
                    )}
                </Pressable>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#29beb3"]} />}
            >
                {loading && !refreshing && products.length === 0 ? (
                    <View className="h-64 items-center justify-center">
                        <ActivityIndicator size="large" color="#29beb3" />
                    </View>
                ) : products.length > 0 ? (
                    <View className="px-4 py-4">
                        <View className="flex-row flex-wrap justify-between">
                            {products.map((product, index) => (
                                <View key={`${product._id}-${index}`} className="w-[48%] mb-4">
                                    <ProductCard product={product} />
                                </View>
                            ))}
                        </View>
                        
                        {hasMoreProducts && (
                            <Pressable 
                                onPress={() => setCurrentPage(prev => prev + 1)}
                                disabled={loadingMore}
                                className="w-full py-4 mt-2 border border-gray-300 items-center justify-center rounded-lg"
                            >
                                {loadingMore ? (
                                    <ActivityIndicator size="small" color="#29beb3" />
                                ) : (
                                    <Text className="font-bold text-gray-700">Load More Products</Text>
                                )}
                            </Pressable>
                        )}
                        {!hasMoreProducts && products.length > 0 && total > 0 && (
                            <View className="items-center py-6">
                                <Text className="text-gray-500 text-center mb-1">🎉 You've seen it all!</Text>
                                <Text className="text-gray-400 text-xs">Showing all {products.length} products</Text>
                            </View>
                        )}
                    </View>
                ) : (
                    <View className="flex-1 items-center justify-center py-16 px-4">
                        <Search size={48} color="#ccc" />
                        <Text className="text-lg font-bold text-gray-700 mt-4 text-center">No products found</Text>
                        <Text className="text-gray-500 text-center mt-2 mb-6">Try adjusting your filters to find what you're looking for.</Text>
                        {activeFilterCount > 0 && (
                            <Pressable 
                                onPress={handleResetFilters}
                                className="px-6 py-3 bg-babyshopSky rounded-full"
                            >
                                <Text className="font-bold text-white">Clear All Filters</Text>
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
