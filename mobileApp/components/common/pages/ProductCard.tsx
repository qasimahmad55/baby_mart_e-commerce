import React from 'react'
import { View, Text, Pressable, Image as RNImage } from 'react-native'
import { useRouter } from 'expo-router'
import { Product } from '../../../types/types'
import DiscountBadge from '../../DiscountBadge'
import WishListButton from '../../WishListButton'
import AddToCartButton from '../../AddToCartButton'
import PriceContainer from '../../common/PriceContainer'

interface Props {
    product: Product;
}

const ProductCard = ({ product }: Props) => {
    const router = useRouter();

    return (
        <View
            className="bg-white overflow-hidden relative"
            style={{
                borderRadius: 18,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.08,
                shadowRadius: 10,
                elevation: 4,
            }}
        >
            <Pressable
                onPress={() => router.push(`/product/${product._id}` as any)}
                className="overflow-hidden relative"
            >
                <RNImage
                    source={{ uri: product?.image }}
                    className="w-full"
                    style={{ height: 160, borderTopLeftRadius: 18, borderTopRightRadius: 18 }}
                    resizeMode="cover"
                />
                <View className="absolute top-3 left-3">
                    <DiscountBadge discountPercentage={product?.discountPercentage ?? 0} />
                </View>
            </Pressable>

            <WishListButton product={product} />

            <View className="px-3.5 pt-3 pb-3">
                <Text className="uppercase text-[10px] font-semibold text-babyshopSky mb-1 tracking-wider">
                    {typeof product?.category === 'object' ? product?.category?.name : ''}
                </Text>

                <Text className="text-[13px] font-semibold text-gray-800 mb-2 leading-[18px]" numberOfLines={2}>
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
