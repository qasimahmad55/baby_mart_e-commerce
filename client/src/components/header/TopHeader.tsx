import React from 'react'
import Container from '../common/Container'
import { topHelpCenter } from '@/constants/data'
import Link from 'next/link'
import SelectCurrency from './SelectCurrency'
import TopSocialLinks from './TopSocialLinks'

function TopHeader() {
    return (
        <div className='w-full bg-babyshopPurple text-babyShopLightWhite py-1 text-sm font-medium'>
            <Container className='grid grid-cols-1 md:grid-cols-3'>
                <div className='hidden md:flex items-center gap-5'>
                    {
                        topHelpCenter.map((item) => (
                            <Link
                                className='hover:text-babyshopWhite hoverEffect'
                                key={item?.title}
                                href={item?.href}>
                                {item?.title}
                            </Link>
                        ))
                    }
                </div>
                {/* Mobile: Currency and Social Links in center */}
                <div className='md:hidden flex items-center justify-center gap-3'>
                    <SelectCurrency />
                    <TopSocialLinks />
                </div>
                {/* Desktop: Security message in center */}
                <p className='text-center hidden md:inline-flex items-center justify-center'>100% Secure delivery without contracting the courier</p>
                {/* Desktop: Currency and Social Links on right */}
                <div className='hidden md:inline-flex items-center justify-end'>
                    <SelectCurrency />
                    <TopSocialLinks />
                </div>
            </Container>
        </div>
    )
}

export default TopHeader