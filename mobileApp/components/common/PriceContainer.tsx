import React from "react";
import { View } from "react-native";
import PriceFormatter from "./PriceFormatter";

interface Props {
    price: number;
    discountPercentage: number;
}

const PriceContainer = ({ price, discountPercentage }: Props) => {
    const discountedPrice = price * (1 - (discountPercentage || 0) / 100);
    return (
        <View className="flex-row items-center gap-2">
            {(discountPercentage ?? 0) > 0 && (
                <PriceFormatter
                    amount={price}
                    className="text-babyshopTextLight line-through font-medium text-xs"
                />
            )}
            <PriceFormatter amount={discountedPrice} className="text-babyshopBlack text-sm" />
        </View>
    );
};

export default PriceContainer;
