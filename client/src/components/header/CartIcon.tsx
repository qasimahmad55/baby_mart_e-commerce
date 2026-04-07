"use client"
import { useCartStore } from '@/lib/store'
import { ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

function CartIcon() {
    const { cartItemsWithQuantities } = useCartStore()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <Link
                href={"/user/cart"}
                className="relative hover:text-babyshopSky hoverEffect"
            >
                <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="absolute -right-1.5 sm:-right-2 -top-1.5 sm:-top-2 bg-babyshopSky text-babyshopWhite text-[9px] sm:text-[11px] font-medium w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center">
                    0
                </span>
            </Link>
        );
    }
    const totalItems = cartItemsWithQuantities.length;
    return (
        <Link
            href={"/user/cart"}
            className="relative hover:text-babyshopSky hoverEffect"
        >
            <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="absolute -right-1.5 sm:-right-2 -top-1.5 sm:-top-2 bg-babyshopSky text-babyshopWhite text-[9px] sm:text-[11px] font-medium w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center">
                {totalItems > 99 ? "99+" : totalItems}
            </span>
        </Link>
    );
}

export default CartIcon