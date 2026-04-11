import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Truck, ShieldCheck, HeartPulse, RefreshCw } from 'lucide-react-native';

const services = [
    {
        icon: <Truck size={24} color="#29beb3" />,
        title: "Fast Delivery",
        desc: "Across the nation"
    },
    {
        icon: <ShieldCheck size={24} color="#a96bde" />,
        title: "Safe Payment",
        desc: "100% secure checkouts"
    },
    {
        icon: <HeartPulse size={24} color="#ef4444" />,
        title: "Quality Care",
        desc: "Handpicked products"
    },
    {
        icon: <RefreshCw size={24} color="#3b82f6" />,
        title: "Easy Returns",
        desc: "7-day return policy"
    }
];

export default function FeaturedServicesSection() {
    return (
        <View className="mb-10 px-4">
            <View className="flex-row flex-wrap justify-between">
                {services.map((service, index) => (
                    <View
                        key={index}
                        className="w-[48%] bg-white p-4 mb-3 rounded-2xl border border-gray-100 shadow-sm"
                    >
                        <View className="mb-2 bg-gray-50 self-start p-2 rounded-lg">
                            {service.icon}
                        </View>
                        <Text className="text-sm font-bold text-gray-900">{service.title}</Text>
                        <Text className="text-[10px] text-gray-500 mt-0.5">{service.desc}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
}
