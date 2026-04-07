"use client"
import React, { useState, useEffect } from 'react'
import { useWishlistStore, useUserStore } from '@/lib/store'
import { removeFromWishlist, clearWishlist as clearWishlistApi, getWishlistProducts } from '@/lib/wishlistApi'
import { Product } from '@/types/types'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'sonner'
import { Trash2, LayoutGrid, List, Loader2, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import DiscountBadge from '@/components/DiscountBadge'
import PriceContainer from '../PriceContainer'
import AddToCartButton from '@/components/AddToCartButton'
import Container from '../Container'
import PageBreadcrumb from './PageBreadCrumb'

const WishlistPageClient = () => {
    const wishlistItems = useWishlistStore((state) => state.wishlistItems)
    const removeFromStore = useWishlistStore((state) => state.removeFromWishlist)
    const clearStore = useWishlistStore((state) => state.clearWishlist)
    const setWishlistItems = useWishlistStore((state) => state.setWishlistItems)
    
    const auth_token = useUserStore((state) => state.auth_token)
    const isAuthenticated = useUserStore((state) => state.isAuthenticated)
    const hasHydrated = useUserStore((state) => state.hasHydrated)
    
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [loadingItems, setLoadingItems] = useState<Set<string>>(new Set())
    const [clearingAll, setClearingAll] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [hasFetched, setHasFetched] = useState(false)

    // Load wishlist products on mount only if we have IDs but no product details
    useEffect(() => {
        const loadWishlistProducts = async () => {
            // Prevent multiple fetches
            if (hasFetched) {
                return
            }
            
            if (!auth_token) {
                setIsLoading(false)
                return
            }

            try {
                setHasFetched(true)
                
                // First, sync wishlist IDs from server to ensure we have the latest
                const { getUserWishlist } = await import('@/lib/wishlistApi')
                const wishlistResponse = await getUserWishlist(auth_token)
                
                if (wishlistResponse.success && wishlistResponse.wishlist) {
                    const serverWishlistIds = wishlistResponse.wishlist
                    
                    // If server has no items, clear local and return
                    if (!serverWishlistIds || serverWishlistIds.length === 0) {
                        setWishlistItems([])
                        setIsLoading(false)
                        return
                    }
                    
                    // Fetch product details for the server wishlist
                    const response = await getWishlistProducts(serverWishlistIds, auth_token)
                    if (response.success && response.products) {
                        setWishlistItems(response.products)
                    }
                }
            } catch (error) {
                console.error("Failed to load wishlist products:", error)
            } finally {
                setIsLoading(false)
            }
        }

        loadWishlistProducts()
    }, [auth_token, setWishlistItems, hasFetched])

    const handleRemoveItem = async (productId: string, productName: string) => {
        if (!auth_token) return

        setLoadingItems(prev => new Set(prev).add(productId))

        try {
            await removeFromWishlist(productId, auth_token)
            removeFromStore(productId)
            toast.success("Removed from wishlist", {
                description: productName,
            })
        } catch (error) {
            console.error("Remove error:", error)
            toast.error("Failed to remove item. Please try again.")
        } finally {
            setLoadingItems(prev => {
                const newSet = new Set(prev)
                newSet.delete(productId)
                return newSet
            })
        }
    }

    const handleClearAll = async () => {
        if (!auth_token) return

        setClearingAll(true)

        try {
            await clearWishlistApi(auth_token)
            clearStore()
            toast.success("Wishlist cleared successfully")
        } catch (error) {
            console.error("Clear error:", error)
            toast.error("Failed to clear wishlist. Please try again.")
        } finally {
            setClearingAll(false)
        }
    }

    if (isLoading) {
        return (
            <Container className="py-6 sm:py-8 md:py-10">
                <PageBreadcrumb
                    items={[{ label: "User", href: "/user/profile" }]}
                    currentPage="Wishlist"
                />
                <div className="flex items-center justify-center min-h-[300px] sm:min-h-[400px]">
                    <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-babyshopSky" />
                </div>
            </Container>
        )
    }

    if (!auth_token) {
        return (
            <Container className="py-6 sm:py-8 md:py-10">
                <PageBreadcrumb
                    items={[{ label: "User", href: "/user/profile" }]}
                    currentPage="Wishlist"
                />
                <div className="flex flex-col items-center justify-center min-h-[300px] sm:min-h-[400px] space-y-3 sm:space-y-4 px-4">
                    <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300" />
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-600 text-center">Please sign in to view your wishlist</h2>
                    <Link href="/auth/signin">
                        <Button className="bg-babyshopSky hover:bg-babyshopSky/90 text-sm sm:text-base">
                            Sign In
                        </Button>
                    </Link>
                </div>
            </Container>
        )
    }

    if (isLoading) {
        return (
            <Container className="py-6 sm:py-8 md:py-10">
                <PageBreadcrumb
                    items={[{ label: "User", href: "/user/profile" }]}
                    currentPage="Wishlist"
                />
                <div className="flex items-center justify-center min-h-[300px] sm:min-h-[400px]">
                    <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-babyshopSky" />
                </div>
            </Container>
        )
    }

    if (wishlistItems.length === 0) {
        return (
            <Container className="py-6 sm:py-8 md:py-10">
                <PageBreadcrumb
                    items={[{ label: "User", href: "/user/profile" }]}
                    currentPage="Wishlist"
                />
                <div className="flex flex-col items-center justify-center min-h-[300px] sm:min-h-[400px] space-y-3 sm:space-y-4 px-4">
                    <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300" />
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-600 text-center">Your wishlist is empty</h2>
                    <p className="text-gray-500 text-sm sm:text-base text-center">Add some products to your wishlist to see them here.</p>
                    <Link href="/shop">
                        <Button className="bg-babyshopSky hover:bg-babyshopSky/90 text-sm sm:text-base">
                            Continue Shopping
                        </Button>
                    </Link>
                </div>
            </Container>
        )
    }

    return (
        <Container className="py-6 sm:py-8 md:py-10">
            <PageBreadcrumb
                items={[{ label: "User", href: "/user/profile" }]}
                currentPage="Wishlist"
            />
            <div className="space-y-4 sm:space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold">My Wishlist</h1>
                        <p className="text-babyshopSky text-sm sm:text-base">
                            <span className="font-semibold">{wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''}</span>
                            {' '}in your wishlist
                        </p>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* View Mode Toggle */}
                        <div className="flex items-center border rounded-md overflow-hidden">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-1.5 sm:p-2 transition-colors ${viewMode === 'grid' ? 'bg-babyshopSky text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                                aria-label="Grid view"
                            >
                                <LayoutGrid className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-1.5 sm:p-2 transition-colors ${viewMode === 'list' ? 'bg-babyshopSky text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                                aria-label="List view"
                            >
                                <List className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                        </div>
                        {/* Clear All Button */}
                        <Button
                            variant="outline"
                            onClick={handleClearAll}
                            disabled={clearingAll}
                            className="border-babyshopRed text-babyshopRed hover:bg-babyshopRed hover:text-white text-xs sm:text-sm px-2 sm:px-4 py-1.5 sm:py-2"
                        >
                            {clearingAll ? (
                                <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin mr-1 sm:mr-2" />
                            ) : (
                                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                            )}
                            <span className="hidden sm:inline">Clear All</span>
                            <span className="sm:hidden">Clear</span>
                        </Button>
                    </div>
                </div>

                {/* Product Grid/List */}
                {viewMode === 'grid' ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
                        {wishlistItems.map((product: Product) => (
                            <WishlistCard
                                key={product._id}
                                product={product}
                                onRemove={handleRemoveItem}
                                isLoading={loadingItems.has(product._id)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="space-y-3 sm:space-y-4">
                        {wishlistItems.map((product: Product) => (
                            <WishlistListItem
                                key={product._id}
                                product={product}
                                onRemove={handleRemoveItem}
                                isLoading={loadingItems.has(product._id)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </Container>
    )
}

// Grid Card Component
interface WishlistCardProps {
    product: Product;
    onRemove: (productId: string, productName: string) => void;
    isLoading: boolean;
}

const WishlistCard = ({ product, onRemove, isLoading }: WishlistCardProps) => {
    return (
        <div className="border rounded-md group overflow-hidden w-full relative bg-white">
            <Link
                href={`/product/${product?._id}`}
                className="p-1.5 sm:p-2 overflow-hidden relative block"
            >
                <Image
                    src={product?.image}
                    alt={product?.name || "Product"}
                    width={500}
                    height={500}
                    className="w-full h-24 sm:h-28 md:h-32 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {product?.discountPercentage > 0 && (
                    <DiscountBadge
                        discountPercentage={product?.discountPercentage}
                        className="absolute top-3 sm:top-4 left-1.5 sm:left-2"
                    />
                )}
            </Link>
            <hr />
            <div className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 space-y-0.5 sm:space-y-1">
                <p className="uppercase text-[10px] sm:text-xs font-medium text-babyshopTextLight truncate">
                    {product?.category?.name}
                </p>
                <p className="line-clamp-2 text-xs sm:text-sm h-8 sm:h-10">{product?.name}</p>
                <PriceContainer
                    price={product?.price}
                    discountPercentage={product?.discountPercentage}
                />
                <div className="flex items-center gap-1.5 sm:gap-2 pt-0.5 sm:pt-1">
                    <button
                        onClick={() => onRemove(product._id, product.name)}
                        disabled={isLoading}
                        className="p-1.5 sm:p-2 border rounded-md text-babyshopRed hover:bg-babyshopRed hover:text-white transition-colors disabled:opacity-50"
                        aria-label="Remove from wishlist"
                    >
                        {isLoading ? (
                            <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                        ) : (
                            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        )}
                    </button>
                    <AddToCartButton product={product} className="flex-1 text-xs sm:text-sm" />
                </div>
            </div>
        </div>
    )
}

// List Item Component
const WishlistListItem = ({ product, onRemove, isLoading }: WishlistCardProps) => {
    return (
        <div className="flex flex-col sm:flex-row border rounded-md overflow-hidden bg-white">
            <Link href={`/product/${product?._id}`} className="relative w-full sm:w-40 md:w-48 h-40 sm:h-auto flex-shrink-0">
                <Image
                    src={product?.image}
                    alt={product?.name || "Product"}
                    fill
                    className="object-cover"
                />
                {product?.discountPercentage > 0 && (
                    <DiscountBadge
                        discountPercentage={product?.discountPercentage}
                        className="absolute top-3 sm:top-4 left-2"
                    />
                )}
            </Link>
            <div className="flex-1 p-3 sm:p-4 flex flex-col justify-between">
                <div>
                    <p className="uppercase text-[10px] sm:text-xs font-medium text-babyshopTextLight">
                        {product?.category?.name}
                    </p>
                    <Link href={`/product/${product?._id}`}>
                        <h3 className="text-sm sm:text-base md:text-lg font-medium hover:text-babyshopSky transition-colors line-clamp-2">
                            {product?.name}
                        </h3>
                    </Link>
                    <PriceContainer
                        price={product?.price}
                        discountPercentage={product?.discountPercentage}
                    />
                </div>
                <div className="flex items-center gap-2 sm:gap-3 mt-3 sm:mt-4">
                    <button
                        onClick={() => onRemove(product._id, product.name)}
                        disabled={isLoading}
                        className="p-1.5 sm:p-2 border rounded-md text-babyshopRed hover:bg-babyshopRed hover:text-white transition-colors disabled:opacity-50"
                        aria-label="Remove from wishlist"
                    >
                        {isLoading ? (
                            <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                        ) : (
                            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        )}
                    </button>
                    <AddToCartButton product={product} className="text-xs sm:text-sm" />
                </div>
            </div>
        </div>
    )
}

export default WishlistPageClient