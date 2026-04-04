import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Eye,
  Search,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Download,
  FileText
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Order {
  _id: string;
  orderId: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  items: Array<{
    product: {
      _id: string;
      name: string;
      price: number;
      image: string;
    };
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: "pending" | "paid" | "completed" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function InvoicesPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  const axiosPrivate = useAxiosPrivate();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axiosPrivate.get("/orders/admin", {
        params: {
          page,
          perPage,
          sortOrder: "desc",
        },
      });
      setOrders(response.data.orders || []);
      setTotal(response.data.total || 0);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch invoices:", error);
      toast("Failed to load Invoices");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const response = await axiosPrivate.get("/orders/admin", {
        params: {
          page,
          perPage,
          sortOrder: "desc",
        },
      });
      setOrders(response.data.orders || []);
      setTotal(response.data.total || 0);
      setTotalPages(response.data.totalPages || 1);
      toast("Invoices refreshed successfully");
    } catch (error) {
      console.error("Failed to refresh invoices:", error);
      toast("Failed to refresh invoices");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page]);

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const formatDate = (value?: string) => {
    if (!value) return "N/A";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "N/A";
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    }).format(date);
  };

  const openViewDialog = (order: Order) => {
    setSelectedInvoice(order);
    setIsViewOpen(true);
  };

  // Mock download functionality, assumes standard browser print or future PDF API
  const handleDownloadInvoice = () => {
    toast.success("Downloading Invoice PDF...");
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const filteredOrders = orders.filter((order) => {
    if (searchTerm === "") return true;
    return (
      order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
        <p className="text-muted-foreground">
          View and manage customer billing and invoices.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4 items-center mb-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search by Invoice ID or Customer..."
            className="pl-9 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={refreshing || loading}
            title="Refresh Invoices"
          >
            <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
          </Button>
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice / Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date Issued</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Payment Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto rounded-md" /></TableCell>
                </TableRow>
              ))
            ) : filteredOrders.length > 0 ? (
              filteredOrders.map((order, i) => (
                <motion.tr
                  key={order._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                >
                  <TableCell className="font-medium">
                    <span className="flex items-center gap-2">
                       <FileText size={16} className="text-muted-foreground" />
                       #{order.orderId || order._id.slice(-6).toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{order.user?.name || "Guest"}</span>
                      <span className="text-xs text-muted-foreground">{order.user?.email || "No Email"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {formatDate(order.createdAt)}
                  </TableCell>
                  <TableCell className="font-semibold text-primary">
                    ${order.totalAmount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        order.paymentStatus === "paid" 
                          ? "default" 
                          : order.paymentStatus === "refunded" 
                          ? "outline" 
                          : "destructive"
                      }
                      className={order.paymentStatus === "paid" ? "bg-green-500 hover:bg-green-600" : ""}
                    >
                      {order.paymentStatus.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openViewDialog(order)}
                        title="View Invoice Details"
                      >
                        <Eye size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleDownloadInvoice}
                        title="Download PDF"
                        className="text-primary hover:text-primary/80"
                      >
                        <Download size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </motion.tr>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No invoices found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination controls */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            Showing Page {page} of {totalPages} ({total} total invoices)
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={page === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* View Invoice Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto print:max-h-none print:w-full print:shadow-none print:border-none print:m-0 print:p-0">
          {selectedInvoice && (
            <>
              <DialogHeader className="print:hidden">
                <DialogTitle>Invoice Details</DialogTitle>
                <DialogDescription>
                  Detailed breakdown of the invoice and its items.
                </DialogDescription>
              </DialogHeader>
              
              <div className="mt-4 p-6 border rounded-md bg-white text-slate-900 print:border-none print:p-0">
                {/* Invoice Header */}
                <div className="flex justify-between items-start pb-6 border-b print:border-slate-200">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight text-primary">INVOICE</h2>
                    <p className="text-sm text-slate-500 mt-1">
                      #{selectedInvoice.orderId || selectedInvoice._id.slice(-6).toUpperCase()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">BabyMart Inc.</p>
                    <p className="text-sm text-slate-500">123 eCommerce Ave.</p>
                    <p className="text-sm text-slate-500">Suite 100, Tech City</p>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="flex justify-between mt-6 mb-8">
                  <div>
                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Billed To:</p>
                    <p className="font-medium text-base">{selectedInvoice.user?.name}</p>
                    <p className="text-sm text-slate-600">{selectedInvoice.user?.email}</p>
                    <div className="text-sm text-slate-600 mt-1 max-w-[200px]">
                      {selectedInvoice.shippingAddress?.street && (
                        <>
                           <p>{selectedInvoice.shippingAddress.street}</p>
                           <p>{selectedInvoice.shippingAddress.city}, {selectedInvoice.shippingAddress.state} {selectedInvoice.shippingAddress.zipCode}</p>
                           <p>{selectedInvoice.shippingAddress.country}</p>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                      <span className="text-slate-500">Date Issued:</span>
                      <span className="font-medium">
                        {formatDate(selectedInvoice.createdAt)}
                      </span>
                      <span className="text-slate-500">Status:</span>
                      <span className="font-medium capitalize text-green-600">
                        {selectedInvoice.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Items Table */}
                <div className="mt-6 border rounded-sm overflow-hidden print:border-slate-200">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-700 uppercase border-b print:bg-slate-100">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Item</th>
                        <th className="px-4 py-3 font-semibold text-center">Qty</th>
                        <th className="px-4 py-3 font-semibold text-right">Price</th>
                        <th className="px-4 py-3 font-semibold text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedInvoice.items?.map((item, index) => (
                        <tr key={index} className="border-b last:border-0 hover:bg-slate-50 print:hover:bg-transparent">
                          <td className="px-4 py-3 font-medium text-slate-900">
                            {item.product?.name || "Unknown Product"}
                          </td>
                          <td className="px-4 py-3 text-center text-slate-600">{item.quantity}</td>
                          <td className="px-4 py-3 text-right text-slate-600">${item.price.toFixed(2)}</td>
                          <td className="px-4 py-3 text-right font-medium text-slate-900">
                            ${(item.quantity * item.price).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals Summary */}
                <div className="flex justify-end mt-6">
                  <div className="w-64 space-y-3">
                    <div className="flex justify-between text-sm text-slate-600">
                      <span>Subtotal</span>
                      <span>${selectedInvoice.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-slate-600 border-b pb-3 print:border-slate-200">
                      <span>Tax (0%)</span>
                      <span>$0.00</span>
                    </div>
                    <div className="flex justify-between text-base font-bold text-slate-900 pt-1">
                      <span>Total</span>
                      <span>${selectedInvoice.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                {/* Footer notes */}
                <div className="mt-12 pt-6 border-t text-sm text-slate-500 text-center print:border-slate-200 print:mt-16">
                  Thank you for your business. If you have any questions about this invoice, please contact support.
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6 print:hidden">
                <Button variant="outline" onClick={() => setIsViewOpen(false)}>
                  Close
                </Button>
                <Button onClick={handleDownloadInvoice}>
                  <Download className="mr-2 h-4 w-4" />
                  Print / Save PDF
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
