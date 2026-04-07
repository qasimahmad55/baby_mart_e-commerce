import { logo } from '@/assets/image'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function Logo({ className }: { className?: string }) {
    return (
        <Link href={"/"}>
            <Image src={logo} alt="logo" className={cn("w-24 sm:w-28 md:w-32 lg:w-44", className)} />
        </Link>
    )
}

export default Logo