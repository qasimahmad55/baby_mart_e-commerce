import Container from "@/components/common/Container";
import BabyTravelSection from "@/components/home/BabyTravelSection";
import Banner from "@/components/home/Banner";
import CategoriesSection from "@/components/home/CategoriesSection";
import ComfyApparelSection from "@/components/home/ComfyApparelSection";
import FeaturedServicesSection from "@/components/home/FeaturedServicesSection";
import HomeBrand from "@/components/home/HomeBrand";
import ProductList from "@/components/home/ProductList";
import { fetchData } from "@/lib/api";
import { Brand } from "@/types/types";

// Force dynamic rendering to avoid build-time API calls
export const dynamic = 'force-dynamic';

async function getBrands(): Promise<Brand[]> {
  try {
    return await fetchData<Brand[]>("/brands");
  } catch (error) {
    console.error("Failed to fetch brands:", error);
    return [];
  }
}

export default async function Home() {
  const brands = await getBrands();

  return (
    <div>
      <Container className="min-h-screen flex flex-col md:flex-row py-4 md:py-7 gap-3 bg-gray-50">
        <CategoriesSection />
        <div className="flex-1 w-full">
          <Banner />
          <ProductList />
          <HomeBrand brands={brands} />
          <BabyTravelSection />
          <ComfyApparelSection />
          <FeaturedServicesSection />
        </div>
      </Container>
    </div>
  );
}
