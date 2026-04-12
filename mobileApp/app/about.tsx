import React from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Footer from '../components/common/Footer';
import { ShieldCheck, Heart, Truck } from 'lucide-react-native';

export default function AboutUs() {
    return (
        <SafeAreaView className="flex-1 bg-white" edges={['bottom']}>
            <View className="px-5 py-4 border-b border-gray-100 bg-white mt-4">
                <Text className="text-2xl font-extrabold text-gray-900">About Us</Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View className="p-5">
                    {/* Hero Section */}
                    <View className="w-full h-48 bg-babyshopSky rounded-2xl mb-6 items-center justify-center overflow-hidden relative">
                        <View className="absolute inset-0 bg-black/10" />
                        <Text className="text-3xl font-extrabold text-white text-center tracking-tight">BabyMart</Text>
                        <Text className="text-white/90 text-center font-medium mt-2 px-8">Everything your baby needs, delivered with love and care.</Text>
                    </View>

                    {/* Mission */}
                    <View className="mb-8">
                        <Text className="text-xl font-bold text-gray-900 mb-3">Our Mission</Text>
                        <Text className="text-gray-600 leading-relaxed font-medium">
                            We believe that parenting is the most beautiful journey in life. Our mission at BabyMart is to make this journey as joyous and stress-free as possible by providing top-quality, safe, and adorable products for your little ones.
                        </Text>
                    </View>

                    {/* Features */}
                    <Text className="text-xl font-bold text-gray-900 mb-4">Why Choose Us?</Text>
                    <View className="space-y-4 mb-8">
                        <View className="flex-row items-center p-4 bg-gray-50 border border-gray-100 rounded-xl">
                            <View className="w-12 h-12 bg-white rounded-full items-center justify-center shadow-sm mr-4">
                                <ShieldCheck size={24} color="#0ad4c7" />
                            </View>
                            <View className="flex-1">
                                <Text className="font-bold text-gray-900 mb-1">100% Safe Products</Text>
                                <Text className="text-gray-500 text-xs font-medium">Certified materials strictly tested for your baby's comfort.</Text>
                            </View>
                        </View>
                        
                        <View className="flex-row items-center p-4 bg-gray-50 border border-gray-100 rounded-xl">
                            <View className="w-12 h-12 bg-white rounded-full items-center justify-center shadow-sm mr-4">
                                <Truck size={24} color="#a96bde" />
                            </View>
                            <View className="flex-1">
                                <Text className="font-bold text-gray-900 mb-1">Fast Delivery</Text>
                                <Text className="text-gray-500 text-xs font-medium">We ensure your essentials reach you exactly when you need them.</Text>
                            </View>
                        </View>

                        <View className="flex-row items-center p-4 bg-gray-50 border border-gray-100 rounded-xl">
                            <View className="w-12 h-12 bg-white rounded-full items-center justify-center shadow-sm mr-4">
                                <Heart size={24} color="#ef4444" />
                            </View>
                            <View className="flex-1">
                                <Text className="font-bold text-gray-900 mb-1">Made with Love</Text>
                                <Text className="text-gray-500 text-xs font-medium">Curated collections from parents, for parents.</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <Footer />
            </ScrollView>
        </SafeAreaView>
    );
}
