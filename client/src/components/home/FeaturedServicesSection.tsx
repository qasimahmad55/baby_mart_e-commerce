"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Shield,
    DollarSign,
    Truck,
    HeartHandshake,
    Award,
    Users,
    Clock,
    Star,
} from "lucide-react";
import Link from "next/link";

const FeaturedServicesSection = () => {
    const services = [
        {
            icon: <Shield className="w-8 h-8" />,
            title: "High Quality Selection",
            description: "Total product quality control for peace of mind",
            color: "text-green-600",
            bgColor: "bg-green-50",
        },
        {
            icon: <DollarSign className="w-8 h-8" />,
            title: "Affordable Prices",
            description: "Factory direct prices for maximum savings",
            color: "text-blue-600",
            bgColor: "bg-blue-50",
        },
        {
            icon: <Truck className="w-8 h-8" />,
            title: "Express Shipping",
            description: "Fast, reliable delivery from global warehouse",
            color: "text-purple-600",
            bgColor: "bg-purple-50",
        },
        {
            icon: <HeartHandshake className="w-8 h-8" />,
            title: "Worry Free",
            description: "Instant access to professional support",
            color: "text-pink-600",
            bgColor: "bg-pink-50",
        },
    ];

    const stats = [
        {
            icon: <Users className="w-6 h-6" />,
            number: "50K+",
            label: "Happy Customers",
        },
        {
            icon: <Award className="w-6 h-6" />,
            number: "99.9%",
            label: "Satisfaction Rate",
        },
        {
            icon: <Clock className="w-6 h-6" />,
            number: "24/7",
            label: "Customer Support",
        },
        {
            icon: <Star className="w-6 h-6" />,
            number: "4.9",
            label: "Average Rating",
        },
    ];

    return (
        <div className="py-6 sm:py-8 md:py-12 bg-babyshopWhite p-3 sm:p-4 md:p-5 mt-3 sm:mt-5 rounded-md border">
            <div className="text-center mb-4 sm:mb-6 md:mb-8">
                <Badge
                    variant="outline"
                    className="text-babyshopSky border-babyshopSky mb-2 sm:mb-4 text-xs"
                >
                    Why Choose Us
                </Badge>
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
                    What Makes Us Special
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base px-2">
                    We&apos;re committed to providing the best experience for you and your
                    baby
                </p>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8 md:mb-12">
                {services.map((service, index) => (
                    <Card
                        key={index}
                        className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-babyshopSky"
                    >
                        <CardContent className="p-3 sm:p-4 md:p-6 text-center">
                            <div
                                className={`${service.bgColor} rounded-full w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4 group-hover:scale-110 transition-transform`}
                            >
                                <div className={`${service.color} [&>svg]:w-4 [&>svg]:h-4 sm:[&>svg]:w-5 sm:[&>svg]:h-5 md:[&>svg]:w-8 md:[&>svg]:h-8`}>{service.icon}</div>
                            </div>
                            <h3 className="font-semibold text-xs sm:text-sm md:text-lg mb-1 sm:mb-2">{service.title}</h3>
                            <p className="text-gray-600 text-[10px] sm:text-xs md:text-sm line-clamp-2">{service.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Stats Section */}
            <div className="bg-gradient-to-r from-babyshopSky to-blue-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-white">
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center">
                            <div className="flex items-center justify-center mb-1 sm:mb-2">
                                <div className="bg-white/20 rounded-full w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center [&>svg]:w-4 [&>svg]:h-4 sm:[&>svg]:w-5 sm:[&>svg]:h-5 md:[&>svg]:w-6 md:[&>svg]:h-6">
                                    {stat.icon}
                                </div>
                            </div>
                            <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-0.5 sm:mb-1">
                                {stat.number}
                            </div>
                            <div className="text-blue-100 text-[10px] sm:text-xs md:text-sm">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA Section */}
            <div className="text-center">
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-2 sm:mb-4">
                    Ready to Start Shopping?
                </h3>
                <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base px-2">
                    Join thousands of happy parents who trust us with their baby&apos;s
                    needs
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                    <Link href="/shop">
                        <Button
                            size="lg"
                            className="w-full sm:w-auto bg-babyshopSky hover:bg-babyshopSky/90 text-white"
                        >
                            Start Shopping
                        </Button>
                    </Link>
                    <Link href="/about">
                        <Button
                            size="lg"
                            variant="outline"
                            className="w-full sm:w-auto hover:bg-babyshopSky hover:text-white hover:border-babyshopSky transition-colors"
                        >
                            Learn More
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default FeaturedServicesSection;