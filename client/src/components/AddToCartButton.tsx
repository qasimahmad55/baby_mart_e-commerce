"use client"
import React, { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Loader2, ShoppingCart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Product } from '@/types/types'
import { toast } from 'sonner'
import { useCartStore, useUserStore } from '@/lib/store'
import { useRouter } from 'next/navigation'

interface Props {
    product: Product,
    className?: string
}

const AddToCartButton = ({ product, className }: Props) => {
    const { addToCart } = useCartStore()
    const { isAuthenticated } = useUserStore()
    const [localLoading, setLocalLoading] = useState(false)
    const [mounted, setMounted] = useState(false)
    const router = useRouter()

    useEffect(() => {
        setMounted(true)
    }, [])

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault()

        if (!isAuthenticated) {
            toast.error("Please sign in to add items to your cart");
            router.push("/auth/signin");
            return;
        }

        setLocalLoading(true)

        try {
            await addToCart(product, 1)
            toast.success("Added to cart successfully!", {
                description: `Name: ${product?.name}`,
            });
        } catch (error) {
            console.error("Add to cart error:", error);
            toast.error("Failed to add to cart. Please try again.");
        } finally {
            setLocalLoading(false)
        }

    }

    if (!mounted) {
        return (
            <Button
                variant="outline"
                disabled
                className={cn("rounded-full px-6 mt-1", className)}
            >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to cart
            </Button>
        )
    }

    return (
        <Button
            onClick={handleAddToCart}
            variant="outline"
            disabled={localLoading} 
            className={cn("rounded-full px-6 mt-1", className)}
        >
            {localLoading ? (
                <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Adding...
                </>
            ) : (
                <>
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to cart
                </>
            )}
        </Button>
    )
}

export default AddToCartButton