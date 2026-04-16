import React, { useState } from 'react'
import { Pressable, Alert, ActivityIndicator } from 'react-native'
import { Heart } from 'lucide-react-native'
import { Product } from '../types/types'
import { useWishlistStore, useUserStore } from '../lib/store'
import { addToWishlist, removeFromWishlist } from '../lib/wishlistApi'
import { useRouter } from 'expo-router'

interface Props {
    product: Product;
    className?: string;
}

const WishListButton = ({ product, className = "" }: Props) => {
    const { addToWishlist: addToWishlistStore, removeFromWishlist: removeFromWishlistStore, isInWishlist } = useWishlistStore()
    const { isAuthenticated, auth_token } = useUserStore()
    const [localLoading, setLocalLoading] = useState(false)
    const router = useRouter()

    const isWishlisted = isInWishlist(product._id)

    const handleWishlistToggle = async () => {
        if (!isAuthenticated || !auth_token) {
            Alert.alert("Authentication", "Please sign in to add items to your wishlist");
            router.push("/auth/signin");
            return;
        }

        setLocalLoading(true)

        try {
            if (isWishlisted) {
                await removeFromWishlist(product._id, auth_token)
                removeFromWishlistStore(product._id)
                Alert.alert("Success", "Removed from wishlist");
            } else {
                await addToWishlist(product._id, auth_token)
                addToWishlistStore(product)
                Alert.alert("Success", "Added to wishlist");
            }
        } catch (error: any) {
            console.error("Wishlist error:", error);
            Alert.alert("Error", "Failed to update wishlist.");
        } finally {
            setLocalLoading(false)
        }
    }

    return (
        <Pressable
            onPress={handleWishlistToggle}
            disabled={localLoading}
            className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full items-center justify-center ${className}`}
            style={{
                backgroundColor: 'rgba(255,255,255,0.92)',
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 4,
                elevation: 5,
            }}
        >
            {localLoading ? (
                <ActivityIndicator size="small" color="#29beb3" />
            ) : (
                <Heart
                    size={18}
                    color={isWishlisted ? "#ec2b04" : "#94a3b8"}
                    fill={isWishlisted ? "#ec2b04" : "transparent"}
                />
            )}
        </Pressable>
    )
}

export default WishListButton;
