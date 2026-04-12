import React from "react";
import { View, Text, Modal, Pressable, ScrollView } from "react-native";
import { X, Check } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Category, Brand } from "../../types/types";

interface Filters {
    category: string;
    brand: string;
    priceRange: [number, number] | null;
    sortOrder: "asc" | "desc";
}

interface FilterModalProps {
    visible: boolean;
    onClose: () => void;
    filters: Filters;
    setFilters: (f: Filters) => void;
    categories: Category[];
    brands: Brand[];
    onApply: () => void;
    onReset: () => void;
}

const priceRanges: { label: string; value: [number, number] }[] = [
    { label: "$0 - $20", value: [0, 20] },
    { label: "$20 - $50", value: [20, 50] },
    { label: "$50 - $100", value: [50, 100] },
    { label: "$100 - Above", value: [100, Infinity] },
];

export default function FilterModal({
    visible,
    onClose,
    filters,
    setFilters,
    categories,
    brands,
    onApply,
    onReset,
}: FilterModalProps) {
    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <SafeAreaView className="flex-1 bg-gray-50 flex-col">
                <View className="flex-row justify-between items-center px-4 py-4 bg-white border-b border-gray-200 shadow-sm">
                    <Text className="text-xl font-bold text-gray-900">Filters</Text>
                    <Pressable onPress={onClose} className="p-2 -mr-2">
                        <X size={24} color="#333" />
                    </Pressable>
                </View>

                <ScrollView className="flex-1 p-4">
                    {/* Sort Order */}
                    <View className="mb-6">
                        <Text className="text-base font-bold text-gray-800 mb-3">Sort By</Text>
                        <View className="flex-row flex-wrap gap-2">
                            <Pressable
                                onPress={() => setFilters({ ...filters, sortOrder: "asc" })}
                                className={`px-4 py-2 rounded-full border ${
                                    filters.sortOrder === "asc"
                                        ? "bg-babyshopSky border-babyshopSky"
                                        : "bg-white border-gray-300"
                                }`}
                            >
                                <Text className={`${filters.sortOrder === "asc" ? "text-white font-bold" : "text-gray-600"}`}>
                                    Newest First
                                </Text>
                            </Pressable>
                            <Pressable
                                onPress={() => setFilters({ ...filters, sortOrder: "desc" })}
                                className={`px-4 py-2 rounded-full border ${
                                    filters.sortOrder === "desc"
                                        ? "bg-babyshopSky border-babyshopSky"
                                        : "bg-white border-gray-300"
                                }`}
                            >
                                <Text className={`${filters.sortOrder === "desc" ? "text-white font-bold" : "text-gray-600"}`}>
                                    Oldest First
                                </Text>
                            </Pressable>
                        </View>
                    </View>

                    {/* Category */}
                    <View className="mb-6">
                        <Text className="text-base font-bold text-gray-800 mb-3">Category</Text>
                        <View className="flex-row flex-wrap gap-2">
                            <Pressable
                                onPress={() => setFilters({ ...filters, category: "" })}
                                className={`px-4 py-2 rounded-full border ${
                                    filters.category === ""
                                        ? "bg-babyshopSky border-babyshopSky"
                                        : "bg-white border-gray-300"
                                }`}
                            >
                                <Text className={`${filters.category === "" ? "text-white font-bold" : "text-gray-600"}`}>
                                    All Categories
                                </Text>
                            </Pressable>
                            {categories.map((cat) => (
                                <Pressable
                                    key={cat._id}
                                    onPress={() => setFilters({ ...filters, category: cat._id })}
                                    className={`px-4 py-2 rounded-full border ${
                                        filters.category === cat._id
                                            ? "bg-babyshopSky border-babyshopSky"
                                            : "bg-white border-gray-300"
                                    }`}
                                >
                                    <Text className={`${filters.category === cat._id ? "text-white font-bold" : "text-gray-600"}`}>
                                        {cat.name}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>

                    {/* Brand */}
                    <View className="mb-6">
                        <Text className="text-base font-bold text-gray-800 mb-3">Brand</Text>
                        <View className="flex-row flex-wrap gap-2">
                            <Pressable
                                onPress={() => setFilters({ ...filters, brand: "" })}
                                className={`px-4 py-2 rounded-full border ${
                                    filters.brand === ""
                                        ? "bg-babyshopSky border-babyshopSky"
                                        : "bg-white border-gray-300"
                                }`}
                            >
                                <Text className={`${filters.brand === "" ? "text-white font-bold" : "text-gray-600"}`}>
                                    All Brands
                                </Text>
                            </Pressable>
                            {brands.map((brd) => (
                                <Pressable
                                    key={brd._id}
                                    onPress={() => setFilters({ ...filters, brand: brd._id })}
                                    className={`px-4 py-2 rounded-full border ${
                                        filters.brand === brd._id
                                            ? "bg-babyshopSky border-babyshopSky"
                                            : "bg-white border-gray-300"
                                    }`}
                                >
                                    <Text className={`${filters.brand === brd._id ? "text-white font-bold" : "text-gray-600"}`}>
                                        {brd.name}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>

                    {/* Price Range */}
                    <View className="mb-6">
                        <Text className="text-base font-bold text-gray-800 mb-3">Price Range</Text>
                        <View className="flex-col gap-2">
                            <Pressable
                                onPress={() => setFilters({ ...filters, priceRange: null })}
                                className="flex-row items-center py-2"
                            >
                                <View className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${filters.priceRange === null ? 'border-babyshopSky bg-babyshopSky' : 'border-gray-300 bg-white'}`}>
                                    {filters.priceRange === null && <View className="w-2.5 h-2.5 bg-white rounded-full" />}
                                </View>
                                <Text className="text-gray-700">All Prices</Text>
                            </Pressable>
                            {priceRanges.map((range) => {
                                const isSelected = filters.priceRange?.[0] === range.value[0] && filters.priceRange?.[1] === range.value[1];
                                return (
                                    <Pressable
                                        key={range.label}
                                        onPress={() => setFilters({ ...filters, priceRange: range.value })}
                                        className="flex-row items-center py-2"
                                    >
                                        <View className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${isSelected ? 'border-babyshopSky bg-babyshopSky' : 'border-gray-300 bg-white'}`}>
                                            {isSelected && <View className="w-2.5 h-2.5 bg-white rounded-full" />}
                                        </View>
                                        <Text className="text-gray-700">{range.label}</Text>
                                    </Pressable>
                                );
                            })}
                        </View>
                    </View>

                    <View className="h-10" />
                </ScrollView>

                <View className="p-4 bg-white border-t border-gray-200 flex-row gap-3">
                    <Pressable
                        onPress={onReset}
                        className="flex-1 py-3 rounded-full border border-gray-300 items-center justify-center"
                    >
                        <Text className="font-bold text-gray-700">Reset</Text>
                    </Pressable>
                    <Pressable
                        onPress={onApply}
                        className="flex-1 py-3 rounded-full bg-babyshopSky items-center justify-center"
                    >
                        <Text className="font-bold text-white">Apply Filters</Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        </Modal>
    );
}
