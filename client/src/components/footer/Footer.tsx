import React from "react";

import Container from "../common/Container";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { payment } from "@/assets/image";
import { Title } from "../Text";
import TopFooter from "./TopFooter";
import HrLine from "./HrLine";

const informationTab = [
    { title: "About Us", href: "/about" },
    { title: "Top Searches", href: "/search" },
    { title: "Privacy Policy", href: "/privacy" },
    { title: "Terms and Conditions", href: "/terms" },
    { title: "Testimonials", href: "/testimonials" },
];
const CustomerTab = [
    { title: "My Account", href: "/account" },
    { title: "Track Order", href: "/track-order" },
    { title: "Shop", href: "/shop" },
    { title: "Wishlist", href: "/wishlist" },
    { title: "Returns/Exchange", href: "/returns" },
];
const OthersTab = [
    { title: "Partnership Programs", href: "/programs" },
    { title: "Associate Program", href: "/programs" },
    { title: "Wholesale Socks", href: "/programs" },
    { title: "Wholesale Funny Socks", href: "/programs" },
    { title: "Others", href: "/others" },
];

const Footer = () => {
    return (
        <footer className="w-full bg-babyshopWhite">
            <TopFooter />
            <HrLine />
            {/* Mobile Footer */}
            <Container className="py-6 md:hidden">
                <div className="space-y-6">
                    {/* Newsletter - Mobile First */}
                    <div>
                        <Title className="text-base mb-3">Newsletter</Title>
                        <div className="flex flex-col gap-2 relative">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="border rounded-full pl-3 pr-14 h-12 placeholder:text-babyshopBlack/50 font-medium text-sm w-full"
                            />
                            <button className="bg-babyshopSky text-babyshopWhite w-12 h-12 rounded-full flex items-center justify-center absolute top-0 right-0">
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                    
                    {/* Links - Collapsible Style */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Title className="text-sm mb-3">Information</Title>
                            <div className="flex flex-col gap-1.5">
                                {informationTab?.slice(0, 3).map((item) => (
                                    <Link
                                        key={item?.href}
                                        href={item?.href}
                                        className="text-babyshopBlack hover:text-babyshopSky hoverEffect text-sm"
                                    >
                                        {item?.title}
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <div>
                            <Title className="text-sm mb-3">Customer Care</Title>
                            <div className="flex flex-col gap-1.5">
                                {CustomerTab?.slice(0, 3).map((item) => (
                                    <Link
                                        href={item?.href}
                                        key={item?.title}
                                        className="text-babyshopBlack hover:text-babyshopSky hoverEffect text-sm"
                                    >
                                        {item?.title}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
            
            {/* Desktop Footer */}
            <Container className="py-10 hidden md:grid grid-cols-2 lg:grid-cols-4 gap-5">
                <div>
                    <Title className="text-lg mb-4">Information</Title>
                    <div className="flex flex-col gap-2">
                        {informationTab?.map((item) => (
                            <Link
                                key={item?.href}
                                href={item?.href}
                                className="text-babyshopBlack hover:text-babyshopSky hoverEffect"
                            >
                                {item?.title}
                            </Link>
                        ))}
                    </div>
                </div>
                <div>
                    <Title className="text-lg mb-4">Customer Care</Title>
                    <div className="flex flex-col gap-2">
                        {CustomerTab?.map((item) => (
                            <Link
                                href={item?.href}
                                key={item?.title}
                                className="text-babyshopBlack hover:text-babyshopSky hoverEffect"
                            >
                                {item?.title}
                            </Link>
                        ))}
                    </div>
                </div>{" "}
                <div>
                    <Title className="text-lg mb-4">Other Business</Title>
                    <div className="flex flex-col gap-2">
                        {OthersTab?.map((item) => (
                            <Link
                                href={item?.href}
                                key={item?.title}
                                className="text-babyshopBlack hover:text-babyshopSky hoverEffect"
                            >
                                {item?.title}
                            </Link>
                        ))}
                    </div>
                </div>
                <div>
                    <Title className="text-lg mb-4">Newsletter</Title>
                    <div className="flex flex-col gap-2 relative">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="border rounded-full pl-3 pr-16 h-14 placeholder:text-babyshopBlack/50 font-medium"
                        />
                        <button className="bg-babyshopSky text-babyshopWhite w-14 h-14 rounded-full flex items-center justify-center absolute top-0 right-0">
                            <ArrowRight />
                        </button>
                    </div>
                </div>
            </Container>
            <HrLine />
            <Container className="py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-5 text-center sm:text-left">
                <p className="text-xs sm:text-sm md:text-base">© 2025 Babymart Theme. All rights reserved.</p>
                <div className="flex items-center justify-center sm:justify-end gap-2">
                    <p className="text-xs sm:text-sm md:text-base">We using safe payment for</p>
                    <Image src={payment} alt="paymentImage" className="h-5 sm:h-6 md:h-auto w-auto" />
                </div>
            </Container>
        </footer>
    );
};

export default Footer;