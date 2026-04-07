import React from "react";
import Container from "../common/Container";
import { footerTopData } from "@/constants/data";
import Image from "next/image";

const TopFooter = () => {
    return (
        <Container className="py-4 sm:py-5 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {footerTopData?.map((item) => (
                <div
                    key={item?.title}
                    className="flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-5 lg:border-r last:border-r-0 text-center sm:text-left"
                >
                    <Image src={item?.image} alt="FooterTopImage" className="w-8 h-8 sm:w-auto sm:h-auto" />
                    <div>
                        <h3 className="text-sm sm:text-base md:text-lg font-semibold capitalize mb-0.5 sm:mb-1.5">
                            {item?.title}
                        </h3>
                        <p className="font-medium text-babyshopBlack/60 leading-4 sm:leading-5 text-xs sm:text-sm md:text-base">
                            {item?.subTitle}
                        </p>
                    </div>
                </div>
            ))}
        </Container>
    );
};

export default TopFooter;