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
            <Container className="py-10">
                <PageBreadcrumb
                    items={[{ label: "User", href: "/user/profile" }]}
                    currentPage="Wishlist"
                />
                <div className="flex items-center justify-center min-h-[400px]">
                    <Loader2 className="w-8 h-8 animate-spin text-babyshopSky" />
                </div>
            </Container>
        )
    }

    if (!auth_token) {
        return (
            <Container className="py-10">
                <PageBreadcrumb
                    items={[{ label: "User", href: "/user/profile" }]}
                    currentPage="Wishlist"
                />
                <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                    <Heart className="w-16 h-16 text-gray-300" />
                    <h2 className="text-xl font-semibold text-gray-600">Please sign in to view your wishlist</h2>
                    <Link href="/auth/signin">
                        <Button className="bg-babyshopSky hover:bg-babyshopSky/90">
                            Sign In
                        </Button>
                    </Link>
                </div>
            </Container>
        )
    }

    if (isLoading) {
        return (
            <Container className="py-10">
                <PageBreadcrumb
                    items={[{ label: "User", href: "/user/profile" }]}
                    currentPage="Wishlist"
                />
                <div className="flex items-center justify-center min-h-[400px]">
                    <Loader2 className="w-8 h-8 animate-spin text-babyshopSky" />
                </div>
            </Container>
        )
    }

    if (wishlistItems.length === 0) {
        return (
            <Container className="py-10">
                <PageBreadcrumb
                    items={[{ label: "User", href: "/user/profile" }]}
                    currentPage="Wishlist"
                />
                <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                    <Heart className="w-16 h-16 text-gray-300" />
                    <h2 className="text-xl font-semibold text-gray-600">Your wishlist is empty</h2>
                    <p className="text-gray-500">Add some products to your wishlist to see them here.</p>
                    <Link href="/shop">
                        <Button className="bg-babyshopSky hover:bg-babyshopSky/90">
                            Continue Shopping
                        </Button>
                    </Link>
                </div>
            </Container>
        )
    }

    return (
        <Container className="py-10">
            <PageBreadcrumb
                items={[{ label: "User", href: "/user/profile" }]}
                currentPage="Wishlist"
            />
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">My Wishlist</h1>
                        <p className="text-babyshopSky">
                            <span className="font-semibold">{wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''}</span>
                            {' '}in your wishlist
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* View Mode Toggle */}
                        <div className="flex items-center border rounded-md overflow-hidden">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-babyshopSky text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                                aria-label="Grid view"
                            >
                                <LayoutGrid className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-babyshopSky text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                                aria-label="List view"
                            >
                                <List className="w-5 h-5" />
                            </button>
                        </div>
                        {/* Clear All Button */}
                        <Button
                            variant="outline"
                            onClick={handleClearAll}
                            disabled={clearingAll}
                            className="border-babyshopRed text-babyshopRed hover:bg-babyshopRed hover:text-white"
                        >
                            {clearingAll ? (
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            ) : (
                                <Trash2 className="w-4 h-4 mr-2" />
                            )}
                            Clear All
                        </Button>
                    </div>
                </div>

                {/* Product Grid/List */}
                {viewMode === 'grid' ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
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
                    <div className="space-y-4">
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
                className="p-2 overflow-hidden relative block"
            >
                <Image
                    src={product?.image}
                    alt={product?.name || "Product"}
                    width={500}
                    height={500}
                    className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {product?.discountPercentage > 0 && (
                    <DiscountBadge
                        discountPercentage={product?.discountPercentage}
                        className="absolute top-4 left-2"
                    />
                )}
            </Link>
            <hr />
            <div className="px-4 py-2 space-y-1">
                <p className="uppercase text-xs font-medium text-babyshopTextLight">
                    {product?.category?.name}
                </p>
                <p className="line-clamp-2 text-sm h-10">{product?.name}</p>
                <PriceContainer
                    price={product?.price}
                    discountPercentage={product?.discountPercentage}
                />
                <div className="flex items-center gap-2 pt-1">
                    <button
                        onClick={() => onRemove(product._id, product.name)}
                        disabled={isLoading}
                        className="p-2 border rounded-md text-babyshopRed hover:bg-babyshopRed hover:text-white transition-colors disabled:opacity-50"
                        aria-label="Remove from wishlist"
                    >
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Trash2 className="w-4 h-4" />
                        )}
                    </button>
                    <AddToCartButton product={product} className="flex-1 text-sm" />
                </div>
            </div>
        </div>
    )
}

// List Item Component
const WishlistListItem = ({ product, onRemove, isLoading }: WishlistCardProps) => {
    return (
        <div className="flex flex-col sm:flex-row border rounded-md overflow-hidden bg-white">
            <Link href={`/product/${product?._id}`} className="relative sm:w-48 h-48 sm:h-auto flex-shrink-0">
                <Image
                    src={product?.image}
                    alt={product?.name || "Product"}
                    fill
                    className="object-cover"
                />
                {product?.discountPercentage > 0 && (
                    <DiscountBadge
                        discountPercentage={product?.discountPercentage}
                        className="absolute top-4 left-2"
                    />
                )}
            </Link>
            <div className="flex-1 p-4 flex flex-col justify-between">
                <div>
                    <p className="uppercase text-xs font-medium text-babyshopTextLight">
                        {product?.category?.name}
                    </p>
                    <Link href={`/product/${product?._id}`}>
                        <h3 className="text-lg font-medium hover:text-babyshopSky transition-colors">
                            {product?.name}
                        </h3>
                    </Link>
                    <PriceContainer
                        price={product?.price}
                        discountPercentage={product?.discountPercentage}
                    />
                </div>
                <div className="flex items-center gap-3 mt-4">
                    <button
                        onClick={() => onRemove(product._id, product.name)}
                        disabled={isLoading}
                        className="p-2 border rounded-md text-babyshopRed hover:bg-babyshopRed hover:text-white transition-colors disabled:opacity-50"
                        aria-label="Remove from wishlist"
                    >
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Trash2 className="w-4 h-4" />
                        )}
                    </button>
                    <AddToCartButton product={product} />
                </div>
            </div>
        </div>
    )
}

export default WishlistPageClient