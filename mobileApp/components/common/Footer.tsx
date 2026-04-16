import React, { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { ArrowRight, ChevronDown, ChevronUp } from "lucide-react-native";
import { Link } from "expo-router";

const informationTab = [
    { title: "About Us", href: "/about" },
    { title: "Top Searches", href: "/search" },
    { title: "Privacy Policy", href: "/privacy" },
    { title: "Terms and Conditions", href: "/terms" },
    { title: "Testimonials", href: "/testimonials" },
];
const CustomerTab = [
    { title: "My Account", href: "/profile" },
    { title: "Track Order", href: "/orders" },
    { title: "Shop", href: "/shop" },
    { title: "Wishlist", href: "/wishlist" },
    { title: "Returns/Exchange", href: "/returns" },
];

export default function Footer() {
    const [infoExpanded, setInfoExpanded] = useState(false);
    const [customerExpanded, setCustomerExpanded] = useState(false);

    return (
        <View className="bg-white px-5 py-6" style={{ borderTopWidth: 1, borderTopColor: '#f1f5f9' }}>
            {/* Newsletter */}
            <View className="mb-7">
                <View className="flex-row items-center gap-2 mb-3">
                    <View className="w-1 h-4 bg-babyshopSky rounded-full" />
                    <Text className="text-base font-extrabold text-gray-900">Newsletter</Text>
                </View>
                <Text className="text-xs text-gray-400 mb-3">Get updates on new arrivals & latest offers</Text>
                <View
                    className="flex-row items-center bg-gray-50 overflow-hidden"
                    style={{ borderRadius: 14, borderWidth: 1, borderColor: '#e5e7eb' }}
                >
                    <TextInput
                        className="flex-1 h-12 pl-4 font-medium text-gray-800 text-sm"
                        placeholder="Enter your email"
                        placeholderTextColor="#9ca3af"
                    />
                    <Pressable
                        className="bg-babyshopSky w-12 h-12 items-center justify-center"
                        style={{ borderTopRightRadius: 14, borderBottomRightRadius: 14 }}
                    >
                        <ArrowRight size={18} color="#ffffff" />
                    </Pressable>
                </View>
            </View>

            {/* Accordion Links */}
            <View className="mb-6">
                {/* Information */}
                <View style={{ borderBottomWidth: 1, borderBottomColor: '#f1f5f9' }} className="py-3.5">
                    <Pressable 
                        className="flex-row items-center justify-between"
                        onPress={() => setInfoExpanded(!infoExpanded)}
                    >
                        <Text className="text-sm font-bold text-gray-800">Information</Text>
                        {infoExpanded ? <ChevronUp size={16} color="#94a3b8" /> : <ChevronDown size={16} color="#94a3b8" />}
                    </Pressable>
                    {infoExpanded && (
                        <View className="pt-2 pb-1">
                            {informationTab.map((item) => (
                                <Link key={item.title} href={item.href as any} asChild>
                                    <Pressable className="py-2.5">
                                        <Text className="text-gray-500 text-sm">{item.title}</Text>
                                    </Pressable>
                                </Link>
                            ))}
                        </View>
                    )}
                </View>

                {/* Customer Care */}
                <View style={{ borderBottomWidth: 1, borderBottomColor: '#f1f5f9' }} className="py-3.5">
                    <Pressable 
                        className="flex-row items-center justify-between"
                        onPress={() => setCustomerExpanded(!customerExpanded)}
                    >
                        <Text className="text-sm font-bold text-gray-800">Customer Care</Text>
                        {customerExpanded ? <ChevronUp size={16} color="#94a3b8" /> : <ChevronDown size={16} color="#94a3b8" />}
                    </Pressable>
                    {customerExpanded && (
                        <View className="pt-2 pb-1">
                            {CustomerTab.map((item) => (
                                <Link key={item.title} href={item.href as any} asChild>
                                    <Pressable className="py-2.5">
                                        <Text className="text-gray-500 text-sm">{item.title}</Text>
                                    </Pressable>
                                </Link>
                            ))}
                        </View>
                    )}
                </View>
            </View>

            {/* Bottom Section */}
            <View className="items-center pt-2">
                <Text className="text-gray-400 text-[10px] mb-1 text-center font-medium">
                    © 2026 BabyMart Express. All rights reserved.
                </Text>
                <View className="flex-row items-center gap-1 mt-1">
                    <View className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    <Text className="text-gray-300 text-[9px] font-bold uppercase tracking-widest">
                        Safe Payments Guaranteed
                    </Text>
                </View>
            </View>
        </View>
    );
}
