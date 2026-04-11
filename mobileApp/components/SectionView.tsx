import React from 'react'
import { View, Text, Pressable } from 'react-native'
import { Link } from 'expo-router'

interface Props {
    title: string;
    href?: string;
    hrefTitle?: string;
}

const SectionView = ({ title, href, hrefTitle }: Props) => {
    return (
        <View className="flex-row items-center justify-between w-full">
            <Text className="text-lg font-bold text-babyshopBlack">{title}</Text>
            {href && hrefTitle && (
                <Link href={href as any} asChild>
                    <Pressable>
                        <Text className="text-babyshopSky text-sm font-medium">{hrefTitle}</Text>
                    </Pressable>
                </Link>
            )}
        </View>
    )
}

export default SectionView;
