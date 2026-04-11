import React from 'react'
import { View, Text, Pressable, Image as RNImage } from 'react-native'
import { Link } from 'expo-router'
import { Product } from '../../../types/types'
import DiscountBadge from '../../DiscountBadge'
import WishListButton from '../../WishListButton'
import AddToCartButton from '../../AddToCartButton'
import PriceContainer from '../../common/PriceContainer'

interface Props {
    product: Product;
}

const ProductCard = ({ product }: Props) => {
    return (
        <View className="border border-gray-200 bg-white rounded-md flex-1 m-1 overflow-hidden relative">
            <Link href={`/(tabs)/shop`} asChild>
                <Pressable className="p-2 overflow-hidden relative block">
                    <RNImage
                        source={{ uri: product?.image }}
                        className="w-full h-32 rounded"
                        resizeMode="cover"
                    />
                    <View className="absolute top-2 left-2">
                        <DiscountBadge discountPercentage={product?.discountPercentage ?? 0} />
                    </View>
                </Pressable>
            </Link>
            
            <WishListButton product={product} />
            
            <View className="bg-gray-200 h-[1px] w-full" />
            
            <View className="px-3 py-2 space-y-1">
                <Text className="uppercase text-[10px] font-medium text-babyshopTextLight mb-1">
                    {typeof product?.category === 'object' ? product?.category?.name : ''}
                </Text>
                
                <Text className="text-xs sm:text-sm h-10 font-medium mb-1 text-black" numberOfLines={2}>
                    {product?.name}
                </Text>
                
                <PriceContainer
                    price={product?.price}
                    discountPercentage={product?.discountPercentage ?? 0}
                />
                
                <AddToCartButton product={product} />
            </View>
        </View>
    );
};

export default ProductCard;
