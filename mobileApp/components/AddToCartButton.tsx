import React, { useState } from 'react'
import { Pressable, Text, ActivityIndicator, Alert } from 'react-native'
import { ShoppingCart } from 'lucide-react-native'
import { Product } from '../types/types'
import { useCartStore, useUserStore } from '../lib/store'
import { useRouter } from 'expo-router'

interface Props {
    product: Product;
    className?: string;
}

const AddToCartButton = ({ product, className = "" }: Props) => {
    const { addToCart } = useCartStore()
    const { isAuthenticated } = useUserStore()
    const [localLoading, setLocalLoading] = useState(false)
    const router = useRouter()

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            Alert.alert("Authentication", "Please sign in to add items to your cart");
            router.push("/auth/signin");
            return;
        }

        setLocalLoading(true)

        try {
            await addToCart(product, 1)
            Alert.alert("Success", "Added to cart successfully!");
        } catch (error) {
            console.error("Add to cart error:", error);
            Alert.alert("Error", "Failed to add to cart. Please try again.");
        } finally {
            setLocalLoading(false)
        }
    }

    return (
        <Pressable
            onPress={handleAddToCart}
            disabled={localLoading} 
            className={`flex-row items-center justify-center border border-gray-300 bg-white rounded-full px-4 py-2 mt-2 ${className}`}
        >
            {localLoading ? (
                <ActivityIndicator size="small" color="#000" style={{ marginRight: 8 }} />
            ) : (
                <ShoppingCart size={16} color="#000" style={{ marginRight: 8 }} />
            )}
            <Text className="text-sm font-semibold">{localLoading ? "Adding..." : "Add to cart"}</Text>
        </Pressable>
    )
}

export default AddToCartButton;
