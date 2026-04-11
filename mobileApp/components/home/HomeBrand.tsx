import React from 'react'
import { View, Text, Pressable, Image as RNImage } from 'react-native'
import { Brand } from '../../types/types'
import { Link } from 'expo-router'
import SectionView from '../SectionView'

interface Props {
    brands: Brand[]
}

const HomeBrand = ({ brands }: Props) => {
    if (!brands || brands.length === 0) {
        return null
    }

    return (
        <View className="mt-3 border border-gray-200 bg-babyshopWhite p-4 rounded-md">
            <SectionView title='Brand we love' href='/(tabs)/shop' hrefTitle='View all Brands' />
            <View className="flex-row flex-wrap mt-4 justify-between">
                {brands?.map((brand) => (
                    <Link key={brand?._id} href={{
                        pathname: "/(tabs)/shop", params: { brand: brand?._id }
                    }} asChild>
                        <Pressable className="w-[30%] flex-col items-center justify-center mb-3">
                            <RNImage 
                                source={{ uri: brand?.image as string }} 
                                className="w-16 h-16 sm:w-20 sm:h-20" 
                                resizeMode="contain" 
                            />
                            <Text className="text-xs font-medium text-center mt-1 text-black" numberOfLines={1}>
                                {brand?.name}
                            </Text>
                        </Pressable>
                    </Link>
                ))}
            </View>
        </View>
    )
}

export default HomeBrand;
