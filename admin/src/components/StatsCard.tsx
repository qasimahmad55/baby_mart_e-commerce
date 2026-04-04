import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router";

interface StatsCardProps {
    title: string;
    value: string | number;
    description?: string;
    icon?: React.ReactNode;
    className?: string;
    href?: string;
}

export function StatsCard({
    title,
    value,
    description,
    icon,
    className,
    href,
}: StatsCardProps) {
    return (
        <Card className={cn("overflow-hidden relative h-full min-h-[140px]", className)}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon && <div className="w-4 h-4 text-muted-foreground">{icon}</div>}
            </CardHeader>
            <CardContent className="flex flex-col justify-between">
                <div className="text-2xl font-bold break-words">{value}</div>
                {description && (
                    <p className="text-xs text-muted-foreground mt-1">{description}</p>
                )}
            </CardContent>
            {href && (
                <Link
                    to={href}
                    className="absolute inset-0"
                    aria-label={`View ${title} details`}
                />
            )}
        </Card>
    );
}