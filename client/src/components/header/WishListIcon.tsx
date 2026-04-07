"use client"
import { useWishlistStore } from '@/lib/store'
import { Heart } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

function WishListIcon() {
    const { wishlistIds } = useWishlistStore()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const count = mounted ? wishlistIds.length : 0

    return (
        <Link href={"/user/wishlist"}
            className="relative hover:text-babyshopSky hoverEffect"
        >
            <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className='absolute -right-1.5 sm:-right-2 -top-1.5 sm:-top-2 bg-babyshopSky text-babyshopWhite text-[9px] sm:text-[11px] font-medium w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center'>
                {count > 99 ? '99+' : count}
            </span>
        </Link>
    )
}
export default WishListIcon