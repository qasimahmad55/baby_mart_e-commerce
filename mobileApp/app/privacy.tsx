import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Footer from '../components/common/Footer';
import { Shield } from 'lucide-react-native';

export default function PrivacyPolicy() {
    return (
        <SafeAreaView className="flex-1 bg-white" edges={['bottom']}>
            <View className="px-5 py-4 border-b border-gray-100 bg-white mt-6">
                <Text className="text-2xl font-extrabold text-gray-900">Privacy Policy</Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View className="p-5">
                    <View className="mb-6 flex-row items-center gap-3">
                        <View className="w-12 h-12 bg-blue-50 rounded-full items-center justify-center">
                            <Shield size={24} color="#3b82f6" />
                        </View>
                        <Text className="text-gray-500 font-medium text-sm flex-1">Last updated: April 2026. Your privacy is critically important to us.</Text>
                    </View>

                    <View className="mb-6">
                        <Text className="text-lg font-bold text-gray-900 mb-2">1. Data Collection</Text>
                        <Text className="text-gray-600 font-medium leading-relaxed mb-4">
                            We collect basic information required to securely process and deliver your orders, such as your email, phone, and delivery address. We never collect sensitive data unnecessary for these processes.
                        </Text>

                        <Text className="text-lg font-bold text-gray-900 mb-2">2. Usage of Information</Text>
                        <Text className="text-gray-600 font-medium leading-relaxed mb-4">
                            The information we collect is strictly used to fulfill your requests, improve the app experience, and communicate essential updates related to your purchases or safety recalls.
                        </Text>

                        <Text className="text-lg font-bold text-gray-900 mb-2">3. Data Security</Text>
                        <Text className="text-gray-600 font-medium leading-relaxed mb-4">
                            We implement a variety of top-tier security measures to maintain the safety of your personal information when you place an order or access your account.
                        </Text>
                        
                        <Text className="text-lg font-bold text-gray-900 mb-2">4. Third Parties</Text>
                        <Text className="text-gray-600 font-medium leading-relaxed">
                            We do not sell, trade, or otherwise transfer to outside parties your personally identifiable information. This does not include trusted partners who assist us in operating our application or conducting our business.
                        </Text>
                    </View>
                </View>
                <Footer />
            </ScrollView>
        </SafeAreaView>
    );
}
