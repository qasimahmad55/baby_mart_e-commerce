"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Product } from "@/types/types";

import { useState } from "react";

interface Props {
    product: Product;
}
const ProductDescription = ({ product }: Props) => {
    const [activeTab, setActiveTab] = useState("description");

    const triggerClassName =
        "h-10 sm:h-11 px-3 text-xs sm:text-sm font-semibold text-babyshopBlack transition-colors data-[state=active]:bg-babyshopSky data-[state=active]:text-babyshopWhite hover:text-babyshopSky rounded-lg flex items-center justify-center whitespace-nowrap min-w-fit";

    return (
        <div className="w-full">
            <Tabs
                className="w-full"
                value={activeTab}
                onValueChange={setActiveTab}
                defaultValue="description"
            >
                <div className="w-full rounded-xl border border-babyshopTextLight/30 bg-babyshopWhite p-1.5 mx-2 sm:mx-0">
                    <TabsList className="h-auto w-full flex flex-nowrap overflow-x-auto gap-1 sm:overflow-hidden sm:[&::-webkit-scrollbar]:hidden sm:[-ms-overflow-style:none] sm:[scrollbar-width:none]">
                        <TabsTrigger value="description" className={triggerClassName}>
                            Description
                        </TabsTrigger>
                        <TabsTrigger value="brand" className={triggerClassName}>
                            Brand
                        </TabsTrigger>
                        <TabsTrigger value="reviews" className={triggerClassName}>
                            Reviews (0)
                        </TabsTrigger>
                        <TabsTrigger value="questions" className={triggerClassName}>
                            Questions
                        </TabsTrigger>
                    </TabsList>
                </div>

                <div className="mt-4 rounded-xl border border-babyshopTextLight/30 bg-babyshopWhite p-4 sm:p-6">
                    <TabsContent value="description" className="mt-0">
                        <h3 className="mb-2 text-base font-semibold text-babyshopBlack sm:text-lg">
                            Product Description
                        </h3>
                        <p className="text-sm leading-relaxed text-babyshopBlack/70 sm:text-base">
                            {product?.description ||
                                "No description available for this product"}
                        </p>
                    </TabsContent>
                    <TabsContent value="brand" className="mt-0">
                        <h3 className="mb-2 text-base font-semibold text-babyshopBlack sm:text-lg">
                            Brand
                        </h3>
                        <p className="text-sm leading-relaxed text-babyshopBlack/70 sm:text-base">
                            {product?.brand
                                ? `Learn more about ${product?.brand?.name}, a trusted name in quality products.`
                                : "No brand information available."}
                        </p>
                    </TabsContent>
                    <TabsContent value="reviews" className="mt-0">
                        <h3 className="mb-2 text-base font-semibold text-babyshopBlack sm:text-lg">
                            Customer Reviews
                        </h3>
                        <p className="text-sm leading-relaxed text-babyshopBlack/70 sm:text-base">
                            No reviews yet. Be the first to share your experience!
                        </p>
                    </TabsContent>
                    <TabsContent value="questions" className="mt-0">
                        <h3 className="mb-2 text-base font-semibold text-babyshopBlack sm:text-lg">
                            Questions
                        </h3>
                        <p className="text-sm leading-relaxed text-babyshopBlack/70 sm:text-base">
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
