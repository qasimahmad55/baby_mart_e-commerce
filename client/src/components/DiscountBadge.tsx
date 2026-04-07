import { cn } from '@/lib/utils';
import React from 'react'

interface Props {
    discountPercentage: number;
    className?: string;
}
const DiscountBadge = ({ discountPercentage, className }: Props) => {
    return (
        <span
            className={cn(
                "block bg-babyshopRed text-babyshopWhite text-[10px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-full font-semibold",
                className
            )}
        >
            -{discountPercentage}%
        </span>
    );
};

export default DiscountBadge;