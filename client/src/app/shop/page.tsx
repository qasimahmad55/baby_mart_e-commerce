import ShopPageClient from '@/components/common/pages/shop/ShopPageClient';
import ShopSkeleton from '@/components/skeleton/ShopSkeleton';
import { fetchData } from '@/lib/api'
import { Brand, Category } from '@/types/types'
import { Suspense } from 'react'

// Force dynamic rendering to avoid build-time API calls
export const dynamic = 'force-dynamic';

interface CategoriesResponse {
    categories: Category[];
}

async function getShopData() {
    let brands: Brand[] = [];
    let categories: Category[] = [];

    try {
        brands = await fetchData<Brand[]>("/brands");
    } catch (error) {
        console.error("Failed to fetch brands:", error);
    }

    try {
        const data = await fetchData<CategoriesResponse>("/categories");
        categories = data.categories;
    } catch (error) {
        console.error("Failed to fetch categories:", error);
    }

    return { brands, categories };
}

const ShopPage = async () => {
    const { brands, categories } = await getShopData();

    return (
        <Suspense fallback={<ShopSkeleton />}>
            <ShopPageClient categories={categories} brands={brands} />
        </Suspense>
    )
}

export default ShopPage