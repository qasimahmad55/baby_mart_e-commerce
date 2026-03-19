"use client"
import React from 'react'
import { Button } from './ui/button'
import { ShoppingCart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Product } from '@/types/types'
import { toast } from 'sonner'

interface Props {
    product: Product,
    className?: string
}

const AddToCartButton = ({ product, className }: Props) => {
    const handleAddToCart = () => {
        toast.success("Button clicked")
    }
    return (
        <Button
            onClick={handleAddToCart}
            variant={"outline"}
            className={cn("rounded-full px-6 mt-1", className)}
        >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to cart
        </Button>
    )
}

export default AddToCartButton 