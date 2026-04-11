import React from 'react'
import { Text, View } from 'react-native'

interface Props {
    discountPercentage: number;
    className?: string;
}
const DiscountBadge = ({ discountPercentage, className = "" }: Props) => {
    if (!discountPercentage) return null;
    return (
        <View className={`bg-babyshopRed px-2 py-1 rounded-full ${className}`}>
             <Text className="text-babyshopWhite text-xs font-semibold">
                -{discountPercentage}%
             </Text>
        </View>
    );
};

export default DiscountBadge;
