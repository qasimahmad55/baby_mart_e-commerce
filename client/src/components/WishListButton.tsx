"use client"
import React, { useState, useEffect } from 'react'
import { Heart, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Product } from '@/types/types'
import { toast } from 'sonner'
import { useWishlistStore, useUserStore } from '@/lib/store'
import { useRouter } from 'next/navigation'
import { addToWishlist, removeFromWishlist } from '@/lib/wishlistApi'

interface Props {
    product: Product;
    className?: string;
}

const WishListButton = ({ product, className }: Props) => {
    const { addToWishlist: addToWishlistStore, removeFromWishlist: removeFromWishlistStore, isInWishlist } = useWishlistStore()
    const { isAuthenticated, auth_token } = useUserStore()
    const [localLoading, setLocalLoading] = useState(false)
    const [mounted, setMounted] = useState(false)
    const router = useRouter()

    useEffect(() => {
        setMounted(true)
    }, [])

    const isWishlisted = mounted ? isInWishlist(product._id) : false

    const handleWishlistToggle = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (!isAuthenticated || !auth_token) {
            toast.error("Please sign in to add items to your wishlist");
            router.push("/auth/signin");
            return;
        }

        setLocalLoading(true)

        try {
            if (isWishlisted) {
                await removeFromWishlist(product._id, auth_token)
                removeFromWishlistStore(product._id)
                toast.success("Removed from wishlist", {
                    description: product?.name,
                });
            } else {
                await addToWishlist(product._id, auth_token)
                addToWishlistStore(product)
                toast.success("Added to wishlist", {
                    description: product?.name,
                });
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error"
            console.error("Wishlist error:", errorMessage);
            
            // Handle "already in wishlist" error by syncing local state
            if (errorMessage.toLowerCase().includes("already in wishlist")) {
                addToWishlistStore(product)
                toast.info("Product is already in your wishlist", {
                    description: product?.name,
                });
            } 
            // Handle "not in wishlist" error by syncing local state
            else if (errorMessage.toLowerCase().includes("not in wishlist") || errorMessage.toLowerCase().includes("not found")) {
                removeFromWishlistStore(product._id)
                toast.info("Product was not in your wishlist", {
                    description: product?.name,
                });
            } else {
                toast.error("Failed to update wishlist. Please try again.");
            }
        } finally {
            setLocalLoading(false)
        }
    }

    return (
        <button
            onClick={handleWishlistToggle}
            disabled={localLoading}
            className={cn(
                "absolute top-4 right-4 z-10 p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-200",
                "hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed",
                className
            )}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
            {localLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-babyshopSky" />
            ) : (
                <Heart
                    className={cn(
                        "w-5 h-5 transition-colors duration-200",
                        isWishlisted
                            ? "fill-babyshopRed text-babyshopRed"
                            : "text-gray-400 hover:text-babyshopRed"
                    )}
                />
            )}
        </button>
    )
}

export default WishListButton
