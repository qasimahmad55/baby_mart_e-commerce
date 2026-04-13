import React from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Footer from '../../components/common/Footer';
import { Star } from 'lucide-react-native';

const reviews = [
    {
        name: "Sarah Jenkins",
        date: "2 days ago",
        text: "BabyMart has completely changed how I shop for my newborn! The delivery was faster than expected, and the quality of the organic cotton sets is unmatched.",
        rating: 5,
        initial: "S"
    },
    {
        name: "David M.",
        date: "1 week ago",
        text: "Great selection of strollers. Reaching the customer support team when I needed to update my address was also incredibly easy.",
        rating: 4,
        initial: "D"
    },
    {
        name: "Emily R.",
        date: "3 weeks ago",
        text: "The diapers in bulk option saved me so much money. Highly recommend to all new parents who need reliable deliveries.",
        rating: 4,
        initial: "E"
    }
];

export default function Testimonials() {
    return (
        <SafeAreaView className="flex-1 bg-gray-50" edges={['bottom']}>
            <View className="px-5 py-4 border-b border-gray-100 bg-white shadow-sm mt-6">
                <Text className="text-2xl font-extrabold text-gray-900">What Parents Say</Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View className="p-5">
                    <Text className="text-gray-500 font-medium mb-6 text-center px-4">Don't just take our word for it—read the thoughts of families who rely on BabyMart everyday.</Text>
                    
                    <View className="space-y-4 mb-4">
                        {reviews.map((review, index) => (
                            <View key={index} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm mb-4">
                                <View className="flex-row justify-between mb-3">
                                    <View className="flex-row items-center gap-3">
                                        <View className="w-10 h-10 bg-babyshopSky/20 rounded-full items-center justify-center">
                                            <Text className="text-babyshopSky font-bold text-lg">{review.initial}</Text>
                                        </View>
                                        <View>
                                            <Text className="font-bold text-gray-900 text-base">{review.name}</Text>
                                            <Text className="text-xs text-gray-400 font-medium">{review.date}</Text>
                                        </View>
                                    </View>
                                    <View className="flex-row">
                                        {[...Array(review.rating)].map((_, i) => (
                                            <Star key={i} size={14} color="#facc15" fill="#facc15" />
                                        ))}
                                    </View>
                                </View>
                                <Text className="text-gray-700 leading-relaxed font-medium">"{review.text}"</Text>
                            </View>
                        ))}
                    </View>
                </View>
                <Footer />
            </ScrollView>
        </SafeAreaView>
    );
}
