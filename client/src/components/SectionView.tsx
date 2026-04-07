import Link from 'next/link';
import React from 'react'
import { Title } from './Text';
import { ChevronRight } from 'lucide-react';

interface Props {
    title: string;
    href: string;
    hrefTitle: string;
}

const SectionView = ({ title, href, hrefTitle }: Props) => {

    return (
        <div className="flex items-center gap-2 sm:gap-5 justify-between">
            <Title className="text-base sm:text-lg md:text-xl">{title}</Title>
            <Link
                href={href}
                className="text-babyshopSky text-xs sm:text-sm font-medium hover:text-babyshopRed hoverEffect"
            >
                <p className="flex items-center gap-0.5 whitespace-nowrap">
                    <span className="hidden sm:inline">{hrefTitle}</span>
                    <span className="sm:hidden">View all</span>
                    <ChevronRight size={18} />
                </p>
            </Link>
        </div>
    )
}

export default SectionView