import { Brand } from '@/types/types'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import SectionView from '../SectionView'

interface Props {
    brands: Brand[]
}
const HomeBrand = ({ brands }: Props) => {
    if (brands.length === 0) {
        return null
    }

    return (
        <div className='mt-3 sm:mt-5 border bg-babyshopWhite p-3 sm:p-4 md:p-5 rounded-md'>
            <SectionView title='Brand we love' href='/shop' hrefTitle='View all Brands' />
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-5 mt-3 sm:mt-5">
                {brands?.map((brand) => (
                    <Link key={brand?._id} href={{
                        pathname: "/shop", query: { brand: brand?._id }
                    }} className='flex flex-col items-center justify-center'>
                        <Image src={brand?.image as string} alt='brandImage' width={250} height={250} className='w-16 sm:w-24 md:w-32' />
                        <p className='text-xs sm:text-sm font-medium text-center line-clamp-1 mt-1'>{brand?.name}</p>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default HomeBrand