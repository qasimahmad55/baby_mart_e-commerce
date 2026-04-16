import React from 'react'
import { Text, View } from 'react-native'

interface Props {
    discountPercentage: number;
    className?: string;
}
const DiscountBadge = ({ discountPercentage, className = "" }: Props) => {
    if (!discountPercentage) return null;
    return (
        <View
            className={`px-2.5 py-1 rounded-lg ${className}`}
            style={{ backgroundColor: '#ec2b04' }}
        >
             <Text className="text-white text-[10px] font-extrabold tracking-wide">
                -{discountPercentage}%
             </Text>
        </View>
    );
};

export default DiscountBadge;
