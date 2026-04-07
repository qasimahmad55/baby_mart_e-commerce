"use client";
import { useState, useEffect } from "react";
import { fetchData } from "@/lib/api";

import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shirt, Star, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { Product } from "@/types/types";
import ProductCard from "../common/pages/ProductCard";


interface ProductsResponse {
    products: Product[];
    total: number;
}

const ComfyApparelSection = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const response: ProductsResponse = await fetchData<ProductsResponse>(
                    "/products"
                );

                const lastProducts = response.products.slice(-8).reverse();
                setProducts(lastProducts);
            } catch (error) {
                console.error("Error loading products:", error);
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, []);

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
                        <Shirt className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500" />
                        <Badge variant="outline" className="text-pink-500 border-pink-500 text-xs">
                            Trendy & Comfortable
                        </Badge>
                    </div>
                    <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
                        Comfy & Cute Apparel
                    </h2>
                    <p className="text-gray-600 text-sm sm:text-base">
                        Adorable outfits that keep your little one comfortable all day
                    </p>
                </div>
                <Link href="/shop?category=apparel">
                    <Button
                        variant="outline"
                        className="hidden sm:flex items-center gap-2 hover:bg-pink-500 hover:text-white hover:border-pink-500 transition-colors text-sm"
                    >
                        Shop All Items
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
                {products.length > 0 ? (
                    products.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))
                ) : (
                    <>

                        <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                            <CardContent className="p-6">
                                <div className="bg-pink-50 rounded-lg p-4 mb-4">
                                    <Shirt className="w-8 h-8 text-pink-600 mx-auto" />
                                </div>
                                <h3 className="font-semibold text-lg mb-2">Baby Onesies</h3>
                                <p className="text-gray-600 text-sm mb-4">
                                    Soft and comfortable onesies for everyday wear
                                </p>
                                <Link href="/shop?search=onesie">
                                    <Button className="w-full bg-pink-500 hover:bg-pink-600">
                                        Shop Now
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>

                        <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                            <CardContent className="p-6">
                                <div className="bg-purple-50 rounded-lg p-4 mb-4">
                                    <Star className="w-8 h-8 text-purple-600 mx-auto" />
                                </div>
                                <h3 className="font-semibold text-lg mb-2">Cute Dresses</h3>
                                <p className="text-gray-600 text-sm mb-4">
                                    Adorable dresses for special occasions
                                </p>
                                <Link href="/shop?search=dress">
                                    <Button className="w-full bg-pink-500 hover:bg-pink-600">
                                        Shop Now
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>

                        <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                            <CardContent className="p-6">
                                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                                    <Sparkles className="w-8 h-8 text-blue-600 mx-auto" />
                                </div>
                                <h3 className="font-semibold text-lg mb-2">Baby Rompers</h3>
                                <p className="text-gray-600 text-sm mb-4">
                                    Stylish rompers for active little ones
                                </p>
                                <Link href="/shop?search=romper">
                                    <Button className="w-full bg-pink-500 hover:bg-pink-600">
                                        Shop Now
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>

                        <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                            <CardContent className="p-6">
                                <div className="bg-green-50 rounded-lg p-4 mb-4">
                                    <Shirt className="w-8 h-8 text-green-600 mx-auto" />
                                </div>
                                <h3 className="font-semibold text-lg mb-2">Baby Pants</h3>
                                <p className="text-gray-600 text-sm mb-4">
                                    Comfortable pants for crawling and playing
                                </p>
                                <Link href="/shop?search=pants">
                                    <Button className="w-full bg-pink-500 hover:bg-pink-600">
                                        Shop Now
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>

            {/* Promotional Banners */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6 md:mb-8">
                <div className="bg-gradient-to-r from-pink-400 to-rose-400 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">Baby Sleep Essentials</h3>
                        <p className="text-pink-100 mb-3 sm:mb-4 text-sm sm:text-base">
                            Cozy pajamas and sleepwear for peaceful nights
                        </p>
                        <Link href="/shop?search=sleepwear">
                            <Button
                                variant="outline"
                                className="bg-white text-pink-500 border-white hover:bg-pink-50 text-sm"
                            >
                                Shop Sleepwear
                            </Button>
                        </Link>
                    </div>
                    <div className="absolute -right-4 -top-4 w-16 sm:w-24 h-16 sm:h-24 bg-white/10 rounded-full"></div>
                    <div className="absolute -right-8 -bottom-8 w-20 sm:w-32 h-20 sm:h-32 bg-white/10 rounded-full"></div>
                </div>

                <div className="bg-gradient-to-r from-orange-400 to-yellow-400 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">Summer Collection</h3>
                        <p className="text-orange-100 mb-3 sm:mb-4 text-sm sm:text-base">
                            Light and breathable outfits for warm weather
                        </p>
                        <Link href="/shop?search=summer">
                            <Button
                                variant="outline"
                                className="bg-white text-orange-500 border-white hover:bg-orange-50 text-sm"
                            >
                                Shop Summer
                            </Button>
                        </Link>
                    </div>
                    <div className="absolute -right-4 -top-4 w-16 sm:w-24 h-16 sm:h-24 bg-white/10 rounded-full"></div>
                    <div className="absolute -right-8 -bottom-8 w-20 sm:w-32 h-20 sm:h-32 bg-white/10 rounded-full"></div>
                </div>
            </div>

            <div className="mt-4 sm:mt-6 md:mt-8 text-center sm:hidden">
                <Link href="/shop?category=apparel">
                    <Button className="w-full bg-pink-500 hover:bg-pink-600">
                        Shop All Apparel
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default ComfyApparelSection;