import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Footer from '../components/common/Footer';
import { FileText } from 'lucide-react-native';

export default function TermsConditions() {
    return (
        <SafeAreaView className="flex-1 bg-white" edges={['bottom']}>
            <View className="px-5 py-4 border-b border-gray-100 bg-white mt-6">
                <Text className="text-2xl font-extrabold text-gray-900">Terms & Conditions</Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View className="p-5">
                    <View className="mb-6 flex-row items-center gap-3">
                        <View className="w-12 h-12 bg-purple-50 rounded-full items-center justify-center">
                            <FileText size={24} color="#a96bde" />
                        </View>
                        <Text className="text-gray-500 font-medium text-sm flex-1">Please read these terms carefully before using the BabyMart mobile application.</Text>
                    </View>

                    <View className="mb-6 space-y-5">
                        <View>
                            <Text className="text-lg font-bold text-gray-900 mb-1">Acknowledgement</Text>
                            <Text className="text-gray-600 font-medium leading-relaxed">
                                These are the Terms and Conditions governing the use of this Service and the agreement that operates between You and the Company. Your access to and use of the Service is conditioned on Your acceptance of and compliance with these Terms.
                            </Text>
                        </View>
                        <View>
                            <Text className="text-lg font-bold text-gray-900 mb-1">User Accounts</Text>
                            <Text className="text-gray-600 font-medium leading-relaxed">
                                When You create an account with Us, You must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of Your account on Our Service.
                            </Text>
                        </View>
                        <View>
                            <Text className="text-lg font-bold text-gray-900 mb-1">Order Placement</Text>
                            <Text className="text-gray-600 font-medium leading-relaxed">
                                By placing an Order for Products through the Service, You warrant that You are legally capable of entering into binding contracts.
                            </Text>
                        </View>
                    </View>
                </View>
                <Footer />
            </ScrollView>
        </SafeAreaView>
    );
}
