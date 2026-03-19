import { cn } from "@/lib/utils";
import React from "react";

const HrLine = ({ className }: { className?: string }) => {
    return (
        <div className={cn("w-full h-px bg-babyshopBlack/20", className)} />
    );
};

export default HrLine;