import { cn } from '@/lib/utils'
import React from 'react'

interface props {
    children: React.ReactNode,
    className?: string
}

function Container({ children, className }: props) {
    return (
        <div className={cn("max-w-screen-2xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8", className)}>{children}</div>
    )
}

export default Container