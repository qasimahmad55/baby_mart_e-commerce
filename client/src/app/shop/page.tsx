import ShopPageClient from '@/components/common/pages/shop/ShopPageClient';
import ShopSkeleton from '@/components/skeleton/ShopSkeleton';
import { fetchData } from '@/lib/api'
import { Brand, Category } from '@/types/types'
import { Suspense } from 'react'

interface CategoriesResponse {
    categories: Category[];
}

const ShopPage = async () => {
    const brands = await fetchData<Brand[]>("/brands")
    let categories: Category[] = []
    let error: string | null = null

    try {
        const data = await fetchData<CategoriesResponse>("/categories")
        categories = data.categories
    } catch (err) {
        error = err instanceof Error ? err.message : "An unknown error occurred";
        console.log("error", error);
    }
    return (
        <Suspense fallback={<ShopSkeleton />}>
            <ShopPageClient categories={categories} brands={brands} />
        </Suspense>
    )
}

export default ShopPage