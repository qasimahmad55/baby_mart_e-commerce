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
                {/* Header */}
                <View
                    className="flex-row justify-between items-center px-5 py-4 bg-white"
                    style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.04,
                        shadowRadius: 6,
                        elevation: 3,
                    }}
                >
                    <Text className="text-xl font-extrabold text-gray-900">Filters</Text>
                    <Pressable onPress={onClose} className="w-9 h-9 bg-gray-100 rounded-xl items-center justify-center">
                        <X size={18} color="#475569" />
                    </Pressable>
                </View>

                <ScrollView className="flex-1 px-5 pt-5">
                    {/* Sort Order */}
                    <View className="mb-7">
                        <Text className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">Sort By</Text>
                        <View className="flex-row flex-wrap gap-2">
                            {[
                                { label: "Newest First", value: "asc" as const },
                                { label: "Oldest First", value: "desc" as const },
                            ].map((item) => {
                                const isSelected = filters.sortOrder === item.value;
                                return (
                                    <Pressable
                                        key={item.value}
                                        onPress={() => setFilters({ ...filters, sortOrder: item.value })}
                                        className="flex-row items-center px-4 py-2.5 rounded-xl"
                                        style={{
                                            backgroundColor: isSelected ? '#29beb3' : '#fff',
                                            borderWidth: 1,
                                            borderColor: isSelected ? '#29beb3' : '#e5e7eb',
                                        }}
                                    >
                                        {isSelected && <Check size={14} color="#fff" style={{ marginRight: 4 }} />}
                                        <Text className={isSelected ? "text-white font-bold text-sm" : "text-gray-600 text-sm"}>
                                            {item.label}
                                        </Text>
                                    </Pressable>
                                );
                            })}
                        </View>
                    </View>

                    {/* Divider */}
                    <View className="h-[1px] bg-gray-100 mb-7" />

                    {/* Category */}
                    <View className="mb-7">
                        <Text className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">Category</Text>
                        <View className="flex-row flex-wrap gap-2">
                            <Pressable
                                onPress={() => setFilters({ ...filters, category: "" })}
                                className="flex-row items-center px-4 py-2.5 rounded-xl"
                                style={{
                                    backgroundColor: filters.category === "" ? '#29beb3' : '#fff',
                                    borderWidth: 1,
                                    borderColor: filters.category === "" ? '#29beb3' : '#e5e7eb',
                                }}
                            >
                                {filters.category === "" && <Check size={14} color="#fff" style={{ marginRight: 4 }} />}
                                <Text className={filters.category === "" ? "text-white font-bold text-sm" : "text-gray-600 text-sm"}>
                                    All
                                </Text>
                            </Pressable>
                            {categories.map((cat) => {
                                const isSelected = filters.category === cat._id;
                                return (
                                    <Pressable
                                        key={cat._id}
                                        onPress={() => setFilters({ ...filters, category: cat._id })}
                                        className="flex-row items-center px-4 py-2.5 rounded-xl"
                                        style={{
                                            backgroundColor: isSelected ? '#29beb3' : '#fff',
                                            borderWidth: 1,
                                            borderColor: isSelected ? '#29beb3' : '#e5e7eb',
                                        }}
                                    >
                                        {isSelected && <Check size={14} color="#fff" style={{ marginRight: 4 }} />}
                                        <Text className={isSelected ? "text-white font-bold text-sm" : "text-gray-600 text-sm"}>
                                            {cat.name}
                                        </Text>
                                    </Pressable>
                                );
                            })}
                        </View>
                    </View>

                    {/* Divider */}
                    <View className="h-[1px] bg-gray-100 mb-7" />

                    {/* Brand */}
                    <View className="mb-7">
                        <Text className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">Brand</Text>
                        <View className="flex-row flex-wrap gap-2">
                            <Pressable
                                onPress={() => setFilters({ ...filters, brand: "" })}
                                className="flex-row items-center px-4 py-2.5 rounded-xl"
                                style={{
                                    backgroundColor: filters.brand === "" ? '#29beb3' : '#fff',
                                    borderWidth: 1,
                                    borderColor: filters.brand === "" ? '#29beb3' : '#e5e7eb',
                                }}
                            >
                                {filters.brand === "" && <Check size={14} color="#fff" style={{ marginRight: 4 }} />}
                                <Text className={filters.brand === "" ? "text-white font-bold text-sm" : "text-gray-600 text-sm"}>
                                    All
                                </Text>
                            </Pressable>
                            {brands.map((brd) => {
                                const isSelected = filters.brand === brd._id;
                                return (
                                    <Pressable
                                        key={brd._id}
                                        onPress={() => setFilters({ ...filters, brand: brd._id })}
                                        className="flex-row items-center px-4 py-2.5 rounded-xl"
                                        style={{
                                            backgroundColor: isSelected ? '#29beb3' : '#fff',
                                            borderWidth: 1,
                                            borderColor: isSelected ? '#29beb3' : '#e5e7eb',
                                        }}
                                    >
                                        {isSelected && <Check size={14} color="#fff" style={{ marginRight: 4 }} />}
                                        <Text className={isSelected ? "text-white font-bold text-sm" : "text-gray-600 text-sm"}>
                                            {brd.name}
                                        </Text>
                                    </Pressable>
                                );
                            })}
                        </View>
                    </View>

                    {/* Divider */}
                    <View className="h-[1px] bg-gray-100 mb-7" />

                    {/* Price Range */}
                    <View className="mb-6">
                        <Text className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">Price Range</Text>
                        <View className="gap-1">
                            <Pressable
                                onPress={() => setFilters({ ...filters, priceRange: null })}
                                className="flex-row items-center py-3"
                            >
                                <View
                                    className="w-5 h-5 rounded-full items-center justify-center mr-3"
                                    style={{
                                        backgroundColor: filters.priceRange === null ? '#29beb3' : '#fff',
                                        borderWidth: 1.5,
                                        borderColor: filters.priceRange === null ? '#29beb3' : '#d1d5db',
                                    }}
                                >
                                    {filters.priceRange === null && <View className="w-2 h-2 bg-white rounded-full" />}
                                </View>
                                <Text className="text-gray-700 text-sm font-medium">All Prices</Text>
                            </Pressable>
                            {priceRanges.map((range) => {
                                const isSelected = filters.priceRange?.[0] === range.value[0] && filters.priceRange?.[1] === range.value[1];
                                return (
                                    <Pressable
                                        key={range.label}
                                        onPress={() => setFilters({ ...filters, priceRange: range.value })}
                                        className="flex-row items-center py-3"
                                    >
                                        <View
                                            className="w-5 h-5 rounded-full items-center justify-center mr-3"
                                            style={{
                                                backgroundColor: isSelected ? '#29beb3' : '#fff',
                                                borderWidth: 1.5,
                                                borderColor: isSelected ? '#29beb3' : '#d1d5db',
                                            }}
                                        >
                                            {isSelected && <View className="w-2 h-2 bg-white rounded-full" />}
                                        </View>
                                        <Text className="text-gray-700 text-sm font-medium">{range.label}</Text>
                                    </Pressable>
                                );
                            })}
                        </View>
                    </View>

                    <View className="h-10" />
                </ScrollView>

                {/* Bottom Actions */}
                <View
                    className="px-5 py-4 bg-white flex-row gap-3"
                    style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: -4 },
                        shadowOpacity: 0.06,
                        shadowRadius: 10,
                        elevation: 8,
                    }}
                >
                    <Pressable
                        onPress={onReset}
                        className="flex-1 py-3.5 rounded-xl items-center justify-center"
                        style={{ borderWidth: 1.5, borderColor: '#e5e7eb' }}
                    >
                        <Text className="font-bold text-gray-600 text-sm">Reset</Text>
                    </Pressable>
                    <Pressable
                        onPress={onApply}
                        className="flex-1 py-3.5 rounded-xl bg-babyshopSky items-center justify-center"
                        style={{
                            shadowColor: '#29beb3',
                            shadowOffset: { width: 0, height: 3 },
                            shadowOpacity: 0.25,
                            shadowRadius: 6,
                            elevation: 4,
                        }}
                    >
                        <Text className="font-bold text-white text-sm">Apply Filters</Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        </Modal>
    );
}
