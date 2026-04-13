import React from 'react';
import { View, Text, ScrollView, Pressable, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Footer from '../../components/common/Footer';
import { RefreshCcw, Mail, Box } from 'lucide-react-native';

export default function ReturnsExchange() {
    return (
        <SafeAreaView className="flex-1 bg-white" edges={['bottom']}>
            <View className="px-5 py-4 border-b border-gray-100 bg-white mt-4">
                <Text className="text-2xl font-extrabold text-gray-900">Returns & Exchanges</Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View className="p-5">
                    {/* Hero Graphic */}
                    <View className="items-center justify-center">
                        <View className="w-20 h-20 bg-orange-50 rounded-full items-center justify-center mb-4">
                            <RefreshCcw size={40} color="#f97316" />
                        </View>
                        <Text className="text-xl font-bold text-gray-900 mb-2">Hassle-Free Returns</Text>
                        <Text className="text-center text-gray-500 font-medium px-4">
                            Not satisfied with your purchase? Don't worry. We offer a 30-day return policy for all unused products in original packaging.
                        </Text>
                    </View>

                    {/* How to return */}
                    <Text className="text-lg font-bold text-gray-900 mt-4 mb-4">How to return an item:</Text>
                    <View className="space-y-4 mb-8">
                        <View className="flex-row items-center border border-gray-200 rounded-xl p-4 bg-gray-50">
                            <View className="w-8 h-8 bg-white rounded-full items-center justify-center mr-3 shadow-sm border border-gray-100">
                                <Text className="font-bold text-babyshopSky">1</Text>
                            </View>
                            <Text className="flex-1 text-gray-700 font-medium">Repack the item in its original packaging safely.</Text>
                        </View>
                        
                        <View className="flex-row items-center border border-gray-200 rounded-xl p-4 bg-gray-50">
                            <View className="w-8 h-8 bg-white rounded-full items-center justify-center mr-3 shadow-sm border border-gray-100">
                                <Text className="font-bold text-babyshopSky">2</Text>
                            </View>
                            <Text className="flex-1 text-gray-700 font-medium">Include any accessories, tags, and the receipt.</Text>
                        </View>

                        <View className="flex-row items-center border border-gray-200 rounded-xl p-4 bg-gray-50">
                            <View className="w-8 h-8 bg-white rounded-full items-center justify-center mr-3 shadow-sm border border-gray-100">
                                <Text className="font-bold text-babyshopSky">3</Text>
                            </View>
                            <Text className="flex-1 text-gray-700 font-medium">Contact support to schedule a pickup or get a label.</Text>
                        </View>
                    </View>

                    {/* Action buttons */}
                    <Pressable 
                        className="bg-babyshopBlack w-full py-4 rounded-xl flex-row items-center justify-center mb-3 gap-2"
                        onPress={() => Linking.openURL('mailto:support@babymart.example.com')}
                    >
                        <Mail size={18} color="#fff" className="mr-2" />
                        <Text className="text-white font-bold text-lg">Email Support</Text>
                    </Pressable>
                </View>
                <Footer />
            </ScrollView>
        </SafeAreaView>
    );
}
