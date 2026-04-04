"use client"
import React, { useState, useEffect } from 'react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select'
import { useCurrencyStore } from '@/lib/store'

function SelectCurrency() {
    const { selectedCurrency, currencies, setCurrency } = useCurrencyStore()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <Select disabled>
                <SelectTrigger className="border-none bg-transparent focus:ring-0 focus:outline-none shadow-none flex items-center justify-between px-2 py-1 data-[size=default]:h-6 dark:bg-transparent dark:hover:transparent text-white data-[placeholder]:text-white">
                    <SelectValue placeholder="USD"></SelectValue>
                </SelectTrigger>
            </Select>
        )
    }

    return (
        <Select value={selectedCurrency} onValueChange={setCurrency}>
            <SelectTrigger className="border-none bg-transparent focus:ring-0 focus:outline-none shadow-none flex items-center justify-between px-2 py-1 data-[size=default]:h-6 dark:bg-transparent dark:hover:transparent text-white data-[placeholder]:text-white">
                <SelectValue placeholder="USD"></SelectValue>
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Currencies</SelectLabel>
                    {currencies.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                            {currency.code} - {currency.name}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}

export default SelectCurrency