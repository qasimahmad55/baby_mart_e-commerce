import React from 'react'
import { View, ViewProps } from 'react-native'

interface Props extends ViewProps {
    children: React.ReactNode,
    className?: string
}

export default function Container({ children, className = "", ...props }: Props) {
    return (
        <View className={`px-3 sm:px-4 md:px-6 w-full ${className}`} {...props}>
            {children}
        </View>
    )
}
