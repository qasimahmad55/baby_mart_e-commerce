import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Image } from "react-native";
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
    { title: "My Account", href: "/auth/signin" }, // placeholder for account
    { title: "Track Order", href: "/orders" },
    { title: "Shop", href: "/shop" },
    { title: "Wishlist", href: "/wishlist" },
    { title: "Returns/Exchange", href: "/returns" },
];

export default function Footer() {
    const [infoExpanded, setInfoExpanded] = useState(false);
    const [customerExpanded, setCustomerExpanded] = useState(false);

    return (
        <View className="w-full bg-white px-4 py-8 border-t border-gray-200">
            {/* Newsletter */}
            <View className="mb-8">
                <Text className="text-lg font-bold text-babyshopBlack mb-3">Newsletter</Text>
                <View className="flex-row relative">
                    <TextInput
                        className="flex-1 border border-gray-300 rounded-full h-12 pl-4 pr-16 font-medium text-babyshopBlack bg-gray-50"
                        placeholder="Enter your email"
                        placeholderTextColor="#9ca3af"
                    />
                    <Pressable className="bg-babyshopSky w-12 h-12 rounded-full absolute right-0 items-center justify-center">
                        <ArrowRight size={20} color="#ffffff" />
                    </Pressable>
                </View>
            </View>

            {/* Accordion Links */}
            <View className="space-y-2 mb-8">
                {/* Information */}
                <View className="border-b border-gray-200 py-3">
                    <Pressable 
                        className="flex-row items-center justify-between"
                        onPress={() => setInfoExpanded(!infoExpanded)}
                    >
                        <Text className="text-base font-bold text-babyshopBlack">Information</Text>
                        {infoExpanded ? <ChevronUp size={20} color="#333" /> : <ChevronDown size={20} color="#333" />}
                    </Pressable>
                    {infoExpanded && (
                        <View className="pt-3 pb-1 space-y-3">
                            {informationTab.slice(0,3).map((item) => (
                                <Link key={item.title} href={item.href as any} asChild>
                                    <Pressable>
                                        <Text className="text-gray-600 text-sm font-medium">{item.title}</Text>
                                    </Pressable>
                                </Link>
                            ))}
                        </View>
                    )}
                </View>

                {/* Customer Care */}
                <View className="border-b border-gray-200 py-3">
                    <Pressable 
                        className="flex-row items-center justify-between"
                        onPress={() => setCustomerExpanded(!customerExpanded)}
                    >
                        <Text className="text-base font-bold text-babyshopBlack">Customer Care</Text>
                        {customerExpanded ? <ChevronUp size={20} color="#333" /> : <ChevronDown size={20} color="#333" />}
                    </Pressable>
                    {customerExpanded && (
                        <View className="pt-3 pb-1 space-y-3">
                            {CustomerTab.slice(0,3).map((item) => (
                                <Link key={item.title} href={item.href as any} asChild>
                                    <Pressable>
                                        <Text className="text-gray-600 text-sm font-medium">{item.title}</Text>
                                    </Pressable>
                                </Link>
                            ))}
                        </View>
                    )}
                </View>
            </View>

            {/* Bottom Section */}
            <View className="items-center mt-2">
                <Text className="text-gray-500 text-xs mb-3 text-center">
                    © 2025 Babymart Theme. All rights reserved.
                </Text>
                {/* Since we don't have the exact payment image locally right now, we omit it or mock it */}
                <Text className="text-gray-400 text-[10px] font-medium text-center uppercase tracking-widest">
                    Safe Payments Guaranteed
                </Text>
            </View>
        </View>
    );
}
