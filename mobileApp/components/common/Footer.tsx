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
    { title: "My Account", href: "/profile" }, // placeholder for account
    { title: "Track Order", href: "/orders" },
    { title: "Shop", href: "/shop" },
    { title: "Wishlist", href: "/wishlist" },
    { title: "Returns/Exchange", href: "/returns" },
];

export default function Footer() {
    const [infoExpanded, setInfoExpanded] = useState(false);
    const [customerExpanded, setCustomerExpanded] = useState(false);

    return (
        <View className="bg-white px-4 py-6 border-t border-gray-200">
            {/* Newsletter */}
            <View className="mb-6">
                <Text className="text-lg font-bold text-babyshopBlack mb-3">Newsletter</Text>
                <View className="flex-row items-center bg-gray-50 border border-gray-300 rounded-full overflow-hidden">
                    <TextInput
                        className="flex-1 h-12 pl-4 font-medium text-babyshopBlack"
                        placeholder="Enter your email"
                        placeholderTextColor="#9ca3af"
                    />
                    <Pressable className="bg-babyshopSky w-12 h-12 items-center justify-center">
                        <ArrowRight size={20} color="#ffffff" />
                    </Pressable>
                </View>
            </View>

            {/* Accordion Links */}
            <View className="mb-6">
                {/* Information */}
                <View className="border-b border-gray-100 py-3">
                    <Pressable 
                        className="flex-row items-center justify-between"
                        onPress={() => setInfoExpanded(!infoExpanded)}
                    >
                        <Text className="text-base font-bold text-babyshopBlack">Information</Text>
                        {infoExpanded ? <ChevronUp size={18} color="#333" /> : <ChevronDown size={18} color="#333" />}
                    </Pressable>
                    {infoExpanded && (
                        <View className="pt-2 pb-1">
                            {informationTab.map((item) => (
                                <Link key={item.title} href={item.href as any} asChild>
                                    <Pressable className="py-2">
                                        <Text className="text-gray-600 text-sm font-medium">{item.title}</Text>
                                    </Pressable>
                                </Link>
                            ))}
                        </View>
                    )}
                </View>

                {/* Customer Care */}
                <View className="border-b border-gray-100 py-3">
                    <Pressable 
                        className="flex-row items-center justify-between"
                        onPress={() => setCustomerExpanded(!customerExpanded)}
                    >
                        <Text className="text-base font-bold text-babyshopBlack">Customer Care</Text>
                        {customerExpanded ? <ChevronUp size={18} color="#333" /> : <ChevronDown size={18} color="#333" />}
                    </Pressable>
                    {customerExpanded && (
                        <View className="pt-2 pb-1">
                            {CustomerTab.map((item) => (
                                <Link key={item.title} href={item.href as any} asChild>
                                    <Pressable className="py-2">
                                        <Text className="text-gray-600 text-sm font-medium">{item.title}</Text>
                                    </Pressable>
                                </Link>
                            ))}
                        </View>
                    )}
                </View>
            </View>

            {/* Bottom Section */}
            <View className="items-center">
                <Text className="text-gray-500 text-[10px] mb-1 text-center font-medium">
                    © 2026 BabyMart Express. All rights reserved.
                </Text>
                <Text className="text-gray-400 text-[9px] font-bold text-center uppercase tracking-widest">
                    Safe Payments Guaranteed
                </Text>
            </View>
        </View>
    );
}
