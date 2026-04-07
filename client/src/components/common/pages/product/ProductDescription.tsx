"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Product } from "@/types/types";

import { useState } from "react";

interface Props {
    product: Product;
}
const ProductDescription = ({ product }: Props) => {
    const [activeTab, setActiveTab] = useState("description");
    return (
        <div className="w-full">
            <Tabs
                className="w-full"
                value={activeTab}
                onValueChange={setActiveTab}
                defaultValue="description"
            >
                <TabsList className="w-full bg-babyshopWhite border border-babyshopTextLight/30 rounded-xl p-2 gap-2 h-auto grid sm:grid-cols-4 grid-cols-2">
                    <TabsTrigger
                        value="description"
                        className="py-2.5 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm md:text-base text-babyshopBlack hover:text-babyshopSky data-[state=active]:bg-babyshopSky data-[state=active]:text-babyshopWhite rounded-lg transition-all text-center h-full flex items-center justify-center whitespace-nowrap"
                    >
                        Description
                    </TabsTrigger>
                    <TabsTrigger
                        value="brand"
                        className="py-2.5 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm md:text-base text-babyshopBlack hover:text-babyshopSky data-[state=active]:bg-babyshopSky data-[state=active]:text-babyshopWhite rounded-lg transition-all text-center h-full flex items-center justify-center whitespace-nowrap"
                    >
                        <span className="hidden sm:inline">About the Brand</span>
                        <span className="sm:hidden">Brand</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="reviews"
                        className="py-2.5 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm md:text-base text-babyshopBlack hover:text-babyshopSky data-[state=active]:bg-babyshopSky data-[state=active]:text-babyshopWhite rounded-lg transition-all text-center h-full flex items-center justify-center whitespace-nowrap"
                    >
                        Reviews (0)
                    </TabsTrigger>
                    <TabsTrigger
                        value="questions"
                        className="py-2.5 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm md:text-base text-babyshopBlack hover:text-babyshopSky data-[state=active]:bg-babyshopSky data-[state=active]:text-babyshopWhite rounded-lg transition-all text-center h-full flex items-center justify-center whitespace-nowrap"
                    >
                        Questions
                    </TabsTrigger>
                </TabsList>

                <div className="mt-3 sm:mt-5 p-3 sm:p-5 border border-babyshopTextLight/30 rounded-xl">
                    <TabsContent value="description">
                        <h3 className="text-base sm:text-lg font-medium text-babyshopBlack mb-2 sm:mb-3">
                            Product Description
                        </h3>
                        <p className="text-babyshopBlack/70 text-sm sm:text-base">
                            {product?.description ||
                                "No description available for this product"}
                        </p>
                    </TabsContent>
                    <TabsContent value="brand">
                        <h3 className="text-base sm:text-lg font-medium text-babyshopBlack mb-2 sm:mb-3">
                            About the Brand
                        </h3>
                        <p className="text-babyshopBlack/70 text-sm sm:text-base">
                            {product?.brand
                                ? `Learn more about ${product?.brand?.name}, a trusted name in quality products.`
                                : "No brand information available."}
                        </p>
                    </TabsContent>
                    <TabsContent value="reviews">
                        <h3 className="text-base sm:text-lg font-medium text-babyshopBlack mb-2 sm:mb-3">
                            Customer Reviews
                        </h3>
                        <p className="text-babyshopBlack/70 text-sm sm:text-base">
                            No reviews yet. Be the first to share your experience!
                        </p>
                    </TabsContent>
                    <TabsContent value="questions">
                        <h3 className="text-base sm:text-lg font-medium text-babyshopBlack mb-2 sm:mb-3">
                            Questions
                        </h3>
                        <p className="text-babyshopBlack/70 text-sm sm:text-base">
                            Have questions about this product? Ask away, and we&apos;ll get
                            back to you!
                        </p>
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
};

export default ProductDescription;