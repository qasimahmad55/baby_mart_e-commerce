import { payment } from '@/assets/image'
import Container from '@/components/common/Container'
import ProductActions from '@/components/common/pages/product/ProductActions'
import ProductDescription from '@/components/common/pages/product/ProductDescription'

import PriceFormatter from '@/components/common/PriceFormatter'
import DiscountBadge from '@/components/DiscountBadge'
import { Button } from '@/components/ui/button'
import { fetchData } from '@/lib/api'
import { Product } from '@/types/types'
import { Box, Eye, FileQuestion, Share2, Star, Truck } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

const SingleProductPage = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params
    // console.log(id);

    const product: Product = await fetchData<Product>(`/products/${id}`)
    // console.log(product);
    if (!product) {
        return (<div>
            <h2>No Products found with &quot;&quot;
                <span>#id <span>{id}</span></span>
            </h2>

        </div>)
    }
    const discountedPrice = product?.price * (1 - product?.discountPercentage / 100)

    return (
        <div className="pt-3 sm:pt-5 mx-2 sm:mx-4">
            <Container>
                <div className="max-w-screen-xl bg-babyshopWhite shadow-babyshopBlack/10 shadow-sm border border-babyshopTextLight/30 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8 md:gap-10 p-3 sm:p-5 md:p-10">
                    <div>
                        <Image
                            src={product?.image}
                            alt="productImage"
                            width={500}
                            height={500}
                            className="w-full h-auto object-cover rounded-lg"
                        />
                    </div>
                    <div className="space-y-3 sm:space-y-4 md:space-y-5">
                        <DiscountBadge
                            discountPercentage={product?.discountPercentage}
                            className="w-12 sm:w-14"
                        />
                        <ProductActions product={product} />
                        {/* Priceview */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 justify-between">
                            <div className="flex items-center gap-2">
                                <PriceFormatter
                                    amount={product?.price}
                                    className="text-babyshopTextLight line-through font-medium text-base sm:text-lg"
                                />
                                <PriceFormatter amount={discountedPrice} className="text-xl sm:text-2xl" />
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="flex items-center text-babyshopTextLight">
                                    <Star size={12} className="sm:w-[15px] sm:h-[15px]" />
                                    <Star size={12} className="sm:w-[15px] sm:h-[15px]" />
                                    <Star size={12} className="sm:w-[15px] sm:h-[15px]" />
                                    <Star size={12} className="sm:w-[15px] sm:h-[15px]" />
                                    <Star size={12} className="sm:w-[15px] sm:h-[15px]" />
                                </div>
                                <p className="text-xs sm:text-sm">({0} reviews)</p>
                            </div>
                        </div>
                        {/* user view */}
                        <p className="flex items-center gap-1 text-sm sm:text-base">
                            <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="font-semibold">29</span>{" "}
                            <span className="text-babyshopBlack/70">
                                people are viewing this right now
                            </span>
                        </p>
                        <Button className="py-4 sm:py-5 text-sm sm:text-base w-full sm:w-auto">Buy now</Button>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5 justify-between border-b border-b-babyshopTextLight/50 pb-4 sm:pb-5">
                            <div className="flex items-center gap-2 text-sm sm:text-base">
                                <FileQuestion className="w-4 h-4 sm:w-5 sm:h-5" /> <p>Ask a Question</p>
                            </div>{" "}
                            <div className="flex items-center gap-2 text-sm sm:text-base">
                                <Share2 className="w-4 h-4 sm:w-5 sm:h-5" /> <p>Share</p>
                            </div>
                        </div>
                        {/* Delivery part */}
                        <div className="space-y-2 sm:space-y-2.5">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <Truck className="w-6 h-6 sm:w-7 sm:h-7 md:w-[30px] md:h-[30px] shrink-0" />{" "}
                                <div>
                                    <p className="font-medium text-sm sm:text-base">
                                        Estimated Delivery:{" "}
                                        <span className="text-xs sm:text-sm text-babyshopBlack/70">
                                            08 - 15 Jun, 2025
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 sm:gap-3">
                                <Box className="w-6 h-6 sm:w-7 sm:h-7 md:w-[30px] md:h-[30px] shrink-0" />{" "}
                                <div>
                                    <p className="font-medium text-sm sm:text-base">
                                        Free Shipping & Returns:{" "}
                                        <span className="text-xs sm:text-sm text-babyshopBlack/70">
                                            On all orders over $200.00
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-babyshopTextLight/10 flex flex-col items-center justify-center p-3 sm:p-4 md:p-5 rounded-lg">
                            <Image
                                src={payment}
                                alt="paymentImage"
                                className="w-56 sm:w-72 md:w-80 mb-2"
                            />
                            <p className="text-xs sm:text-sm text-babyshopBlack/70 text-center">
                                Guaranteed safe & secure checkout
                            </p>
                        </div>
                    </div>
                </div>
                <div className="max-w-screen-xl bg-babyshopWhite shadow-babyshopBlack/10 shadow-sm border border-babyshopTextLight/30 rounded-xl p-3 sm:p-5 md:p-10 mt-3 sm:mt-5">
                    <ProductDescription product={product} />
                </div>
            </Container>
        </div>
    )
}

export default SingleProductPage