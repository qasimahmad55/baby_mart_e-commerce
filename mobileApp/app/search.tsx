import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, ArrowUpRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Footer from '../components/common/Footer';

export default function TopSearches() {
    const router = useRouter();
    
    // Fallback static list context for what people search the most
    const topSearches = [
        "Baby strollers", "Diapers bulk", "Organic baby food", 
        "Crib mattresses", "Newborn clothing sets", "Baby formula",
        "Teething toys", "Baby monitors"
    ];

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['bottom']}>
            <View className="px-5 py-3 border-b border-gray-100 bg-white mt-6">
                <Text className="text-2xl font-extrabold text-gray-900">Trending</Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View className="p-5">
                    
                    <Text className="text-lg font-bold text-gray-900 mb-4">Top Searches This Week</Text>
                    <View className="flex-row flex-wrap gap-2 mb-8">
                        {topSearches.map((item, idx) => (
                            <Pressable 
                                key={idx}
                                onPress={() => router.push('/shop')}
                                className="flex-row items-center px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full mb-2 mr-2"
                            >
                                <Text className="text-gray-700 font-bold mr-2">{item}</Text>
                                <ArrowUpRight size={14} color="#0ad4c7" />
                            </Pressable>
                        ))}
                    </View>
                </View>
                <Footer />
            </ScrollView>
        </SafeAreaView>
    );
}
