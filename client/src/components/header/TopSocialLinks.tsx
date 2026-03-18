import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import Link from 'next/link';
import React from 'react'

function TopSocialLinks() {
    const socialLinks = [
        { title: "Facebook", icon: <Facebook size={16} />, href: "/" },
        { title: "Instagram", icon: <Instagram size={16} />, href: "/" },
        { title: "Linkedin", icon: <Linkedin size={16} />, href: "/" },
        { title: "Twitter", icon: <Twitter size={16} />, href: "/" },
    ];
    return (
        <div className='flex items-center gap-3'>
            {socialLinks.map((item) => (
                <Link
                    className='hover:text-babyshopWhite hoverEffect'
                    key={item?.title}
                    href={item?.href}>
                    {item?.icon}
                </Link>
            ))}
        </div>
    )
}

export default TopSocialLinks