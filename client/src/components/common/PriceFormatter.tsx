"use client"
import { cn } from '@/lib/utils';
import React, { useState, useEffect } from 'react'
import { useCurrencyStore } from '@/lib/store';

interface Props {
    amount: number,
    className?: string
}

const PriceFormatter = ({ amount, className }: Props) => {
    const { getCurrentCurrency, convertPrice } = useCurrencyStore()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!amount) return null;

    // Use default USD until mounted to prevent hydration mismatch
    if (!mounted) {
        const formattedPrice = new Number(amount).toLocaleString("en-US", {
            currency: "USD",
            style: "currency",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

        return (
            <span className={cn("text-sm font-semibold text-babyshopRed", className)}>
                {formattedPrice}
            </span>
        )
    }

    const currency = getCurrentCurrency()
    const convertedAmount = convertPrice(amount)
    
    const formattedPrice = new Number(convertedAmount).toLocaleString("en-US", {
        style: "currency",
        currency: currency.code,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    return (
        <span className={cn("text-sm font-semibold text-babyshopRed", className)}>
            {formattedPrice}
        </span>
    )
}

export default PriceFormatter