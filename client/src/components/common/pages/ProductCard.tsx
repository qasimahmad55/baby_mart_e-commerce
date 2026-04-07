"use client"
import DiscountBadge from "@/components/DiscountBadge";
import WishListButton from "@/components/WishListButton";
import { Product } from "@/types/types";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import PriceContainer from "../PriceContainer";
import AddToCartButton from "@/components/AddToCartButton";

const ProductCard = ({ product }: { product: Product }) => {
    return (
        <div className="border rounded-md group overflow-hidden w-full relative bg-white">
            <Link
                href={`/product/${product?._id}`}
                className="p-1.5 sm:p-2 overflow-hidden relative block"
            >
                <Image
                    src={product?.image}
                    alt="productImage"
                    width={500}
                    height={500}
                    className="w-full h-24 sm:h-28 md:h-32 object-cover group-hover:scale-110 hoverEffect"
                />
                <DiscountBadge
                    discountPercentage={product?.discountPercentage}
                    className="absolute top-2 sm:top-4 left-1.5 sm:left-2"
                />
            </Link>
            <WishListButton product={product} />
            <hr />
            <div className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 space-y-0.5 sm:space-y-1">
                <p className="uppercase text-[10px] sm:text-xs font-medium text-babyshopTextLight">
                    {product?.category?.name}
                </p>
                <p className="line-clamp-2 text-xs sm:text-sm h-8 sm:h-10">{product?.name}</p>
                <PriceContainer
                    price={product?.price}
                    discountPercentage={product?.discountPercentage}
                />
                <AddToCartButton product={product} />
            </div>
        </div>
    );
};
export default ProductCard