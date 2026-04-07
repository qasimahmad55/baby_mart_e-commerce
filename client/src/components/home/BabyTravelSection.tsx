"use client"
import { fetchData } from '@/lib/api'
import { Product } from '@/types/types'
import React, { useEffect, useState } from 'react'
import { Skeleton } from '../ui/skeleton'
import { ArrowRight, MapPin, Plane } from 'lucide-react'
import { Badge } from '../ui/badge'
import Link from 'next/link'
import { Button } from '../ui/button'
import ProductCard from '../common/pages/ProductCard'
import { Card, CardContent } from '../ui/card'
interface ProductResponse {
  products: Product[],
  total: number
}
const BabyTravelSection = () => {

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    const loadProducts = async () => {
      try {
        const response: ProductResponse = await fetchData<ProductResponse>("/products")

        setProducts(response?.products?.slice(0, 8) || [])

      } catch (error) {
        console.error("Failed to fetch baby travel products", error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
    // console.log(products);
  }, [])


  if (loading) {
    return (
      <div className="py-6 sm:py-8 md:py-12 px-3 sm:px-4 md:px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 md:mb-8 gap-3">
          <div className="space-y-2">
            <Skeleton className="h-6 sm:h-8 w-48 sm:w-64" />
            <Skeleton className="h-3 sm:h-4 w-64 sm:w-80" />
          </div>
          <Skeleton className="h-8 sm:h-10 w-24 sm:w-32" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="space-y-2 sm:space-y-4">
              <Skeleton className="h-32 sm:h-40 md:h-48 w-full rounded-lg" />
              <Skeleton className="h-3 sm:h-4 w-3/4" />
              <Skeleton className="h-3 sm:h-4 w-1/2" />
              <Skeleton className="h-6 sm:h-8 w-1/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="py-6 sm:py-8 md:py-12 bg-babyshopWhite p-3 sm:p-4 md:p-5 mt-3 sm:mt-5 rounded-md border">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 md:mb-8 gap-3">
        <div className="space-y-1 sm:space-y-2">
          <div className="flex items-center gap-2">
            <Plane className="w-4 h-4 sm:w-5 sm:h-5 text-babyshopSky" />
            <Badge
              variant={"outline"}
              className="text-babyshopSky border-babyshopSky text-xs"
            >
              Travel Ready
            </Badge>
          </div>
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
            Baby Travel Essentials
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Everything you need for safe and comfortable travels with your
            little one
          </p>
        </div>
        <Link href={"/shop?category=travel"}>
          <Button
            variant="outline"
            className="hidden sm:flex items-center gap-2 hover:bg-babyshopSky hover:text-white hover:border-babyshopSky transition-colors text-sm"
          >
            Shop All Items
          </Button>
        </Link>
      </div>

      {/* Proudcts */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
        {products?.length > 0 ? (
          products?.map((product) => (
            <ProductCard key={product?._id} product={product} />
          ))
        ) : (
          <>
            <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
              <CardContent className="p-6">
                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                  <Plane className="w-8 h-8 text-blue-600 mx-auto" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Travel Strollers</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Lightweight and compact strollers perfect for travel
                </p>
                <Link href="/shop?search=stroller">
                  <Button className="w-full bg-babyshopSky hover:bg-babyshopSky/90">
                    Shop Now
                  </Button>
                </Link>
              </CardContent>
            </Card>
            <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
              <CardContent className="p-6">
                <div className="bg-green-50 rounded-lg p-4 mb-4">
                  <MapPin className="w-8 h-8 text-green-600 mx-auto" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Car Seats</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Safe and secure car seats for every journey
                </p>
                <Link href="/shop?search=car seat">
                  <Button className="w-full bg-babyshopSky hover:bg-babyshopSky/90">
                    Shop Now
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
              <CardContent className="p-6">
                <div className="bg-purple-50 rounded-lg p-4 mb-4">
                  <Plane className="w-8 h-8 text-purple-600 mx-auto" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Travel Bags</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Organized storage for all your baby&apos;s travel needs
                </p>
                <Link href="/shop?search=diaper bag">
                  <Button className="w-full bg-babyshopSky hover:bg-babyshopSky/90">
                    Shop Now
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
              <CardContent className="p-6">
                <div className="bg-orange-50 rounded-lg p-4 mb-4">
                  <MapPin className="w-8 h-8 text-orange-600 mx-auto" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Baby Carriers</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Comfortable carriers for hands-free travel
                </p>
                <Link href="/shop?search=carrier">
                  <Button className="w-full bg-babyshopSky hover:bg-babyshopSky/90">
                    Shop Now
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Promotional Banner */}
      <div className="bg-gradient-to-r from-babyshopSky to-blue-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 text-white">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2">Travel Smart</h3>
            <p className="text-blue-100 text-sm sm:text-base">
              Discover our curated collection of travel essentials for
              stress-free adventures
            </p>
          </div>
          <Link href="/shop?category=travel">
            <Button
              size="lg"
              variant="outline"
              className="bg-white text-babyshopSky border-white hover:bg-gray-100 text-sm sm:text-base"
            >
              Explore Collection
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
      <div className="mt-4 sm:mt-6 md:mt-8 text-center sm:hidden">
        <Link href="/shop?category=travel">
          <Button className="w-full bg-babyshopSky hover:bg-babyshopSky/90">
            Shop All Travel Items
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default BabyTravelSection