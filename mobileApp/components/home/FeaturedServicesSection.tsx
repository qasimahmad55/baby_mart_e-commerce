import React from 'react';
import { View, Text } from 'react-native';
import { Truck, ShieldCheck, HeartPulse, RefreshCw } from 'lucide-react-native';

const services = [
    {
        icon: <Truck size={22} color="#29beb3" />,
        title: "Fast Delivery",
        desc: "Across the nation",
        accent: '#29beb3',
        bgColor: '#E8F8F5',
    },
    {
        icon: <ShieldCheck size={22} color="#a96bde" />,
        title: "Safe Payment",
        desc: "100% secure checkouts",
        accent: '#a96bde',
        bgColor: '#F3E8FF',
    },
    {
        icon: <HeartPulse size={22} color="#ef4444" />,
        title: "Quality Care",
        desc: "Handpicked products",
        accent: '#ef4444',
        bgColor: '#FFF1F2',
    },
    {
        icon: <RefreshCw size={22} color="#3b82f6" />,
        title: "Easy Returns",
        desc: "7-day return policy",
        accent: '#3b82f6',
        bgColor: '#EFF6FF',
    }
];

export default function FeaturedServicesSection() {
    return (
        <View className="mb-6 px-5">
            <View className="flex-row items-center gap-2 mb-4">
                <View className="w-1 h-5 bg-babyshopSky rounded-full" />
                <Text className="text-lg font-extrabold text-gray-900">Why Choose Us</Text>
            </View>
            <View className="flex-row flex-wrap justify-between">
                {services.map((service, index) => (
                    <View
                        key={index}
                        className="w-[48%] mb-3 overflow-hidden"
                        style={{
                            backgroundColor: '#fff',
                            borderRadius: 18,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.05,
                            shadowRadius: 8,
                            elevation: 2,
                        }}
                    >
                        {/* Top accent strip */}
                        <View style={{ height: 3, backgroundColor: service.accent }} />
                        <View className="p-4">
                            <View
                                className="self-start p-2.5 rounded-xl mb-3"
                                style={{ backgroundColor: service.bgColor }}
                            >
                                {service.icon}
                            </View>
                            <Text className="text-sm font-bold text-gray-900">{service.title}</Text>
                            <Text className="text-[11px] text-gray-500 mt-0.5">{service.desc}</Text>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
}
