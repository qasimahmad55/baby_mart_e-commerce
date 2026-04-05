import { Skeleton } from "../../components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../components/ui/table";

const ProductSkeleton = ({ isAdmin }: { isAdmin?: boolean }) => {
    return (
        <div className="p-5 space-y-6">
            {/* Header Skeleton */}
            <div className="flex justify-between items-center">
                <div className="flex items-end gap-3">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-5 w-32" />
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-2 shadow-sm">
                    <Skeleton className="h-9 w-28" />
                    <Skeleton className="h-9 w-40" />
                    {isAdmin && <Skeleton className="h-9 w-32" />}
                </div>
            </div>

            {/* Table Skeleton */}
            <div className="rounded-lg border border-border/50 shadow-sm bg-card overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-b border-border/50 bg-muted/30">
                                <TableHead className="w-[80px] font-semibold">
                                    <Skeleton className="h-4 w-12" />
                                </TableHead>
                                <TableHead className="font-semibold min-w-[200px]">
                                    <Skeleton className="h-4 w-24" />
                                </TableHead>
                                <TableHead className="font-semibold">
                                    <Skeleton className="h-4 w-16" />
                                </TableHead>
                                <TableHead className="font-semibold">
                                    <Skeleton className="h-4 w-20" />
                                </TableHead>
                                <TableHead className="font-semibold">
                                    <Skeleton className="h-4 w-16" />
                                </TableHead>
                                <TableHead className="font-semibold">
                                    <Skeleton className="h-4 w-16" />
                                </TableHead>
                                <TableHead className="font-semibold">
                                    <Skeleton className="h-4 w-20" />
                                </TableHead>
                                <TableHead className="font-semibold">
                                    <Skeleton className="h-4 w-16" />
                                </TableHead>
                                {isAdmin && (
                                    <TableHead className="text-right font-semibold min-w-[100px]">
                                        <Skeleton className="h-4 w-16 ml-auto" />
                                    </TableHead>
                                )}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {[...Array(5)].map((_, index) => (
                                <TableRow
                                    key={index}
                                    className={`border-b border-border/30 ${index % 2 === 0 ? "bg-background" : "bg-muted/20"
                                        }`}
                                >
                                    <TableCell className="py-3">
                                        <Skeleton className="h-12 w-12 rounded-md" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-32" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-20" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-6 w-12 rounded-full" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-6 w-12 rounded-full" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-12" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-6 w-20 rounded-full" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-6 w-20 rounded-full" />
                                    </TableCell>
                                    {isAdmin && (
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1">
                                                <Skeleton className="h-8 w-8 rounded" />
                                                <Skeleton className="h-8 w-8 rounded" />
                                            </div>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
};

export default ProductSkeleton;
