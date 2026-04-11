import React from "react";
import { Text } from "react-native";
import { useCurrencyStore } from "../../lib/store";

interface Props {
    amount: number;
    className?: string;
}

const PriceFormatter = ({ amount, className = "" }: Props) => {
    const currentCurrency = useCurrencyStore((state) => state.getCurrentCurrency());
    const rate = currentCurrency?.rate || 1;
    const symbol = currentCurrency?.symbol || "$";
    
    const formattedPrice = (amount * rate).toFixed(2);

    return (
        <Text className={`font-semibold ${className}`}>
           {symbol}{formattedPrice}
        </Text>
    );
};
export default PriceFormatter;
