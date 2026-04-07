"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  Bell,
  CreditCard,
  Eye,
  Loader2,
  Package,
  RefreshCcw,
  Settings,
  Trash2,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";

import Container from "../Container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { deleteOrder, Order } from "@/lib/orderApi";
import { useOrderStore, useUserStore } from "@/lib/store";

const accountTabs = [
  { label: "Profile", href: "/user/profile", icon: UserRound },
  { label: "Orders", href: "/user/orders", icon: Package, active: true },
  { label: "Analytics", href: "#", icon: BarChart3 },
  { label: "Notifications", href: "#", icon: Bell },
  { label: "Settings", href: "#", icon: Settings },
];

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

const getStatusClasses = (status: Order["status"]) => {
  if (status === "completed") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (status === "paid") return "bg-blue-50 text-blue-700 border-blue-200";
  if (status === "cancelled") return "bg-rose-50 text-rose-700 border-rose-200";
  return "bg-amber-50 text-amber-700 border-amber-200";
};

const OrderPageClient = () => {
  const router = useRouter();

  const { auth_token, authUser, verifyAuth, hasHydrated } = useUserStore();
  const { orders, isLoading, loadOrders } = useOrderStore();

  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      setIsAuthenticating(true);

      if (!auth_token) {
        router.push("/auth/signin");
        setIsAuthenticating(false);
        return;
      }

      if (!authUser) {
        await verifyAuth();
      }

      setIsAuthenticating(false);
    };

    checkAuth();
  }, [auth_token, authUser, router, verifyAuth]);

  useEffect(() => {
    if (!auth_token || isAuthenticating) return;

    loadOrders(auth_token);
  }, [auth_token, isAuthenticating, loadOrders]);

  const sortedOrders = useMemo(
    () => [...orders].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)),
    [orders]
  );

  const handleRefresh = async () => {
    if (!auth_token) return;

    setIsRefreshing(true);
    try {
      await loadOrders(auth_token);
      toast.success("Orders refreshed");
    } catch (error) {
      console.error("Failed to refresh orders:", error);
      toast.error("Failed to refresh orders");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handlePayNow = (orderId: string) => {
    router.push(`/user/checkout?orderId=${orderId}`);
  };

  const handleDeleteOrder = async () => {
    if (!orderToDelete || !auth_token) return;

    setDeletingOrderId(orderToDelete._id);
    try {
      const response = await deleteOrder(orderToDelete._id, auth_token);
      if (!response.success) {
        toast.error(response.message || "Unable to delete this order");
        return;
      }

      toast.success("Order deleted successfully");
      await loadOrders(auth_token);
      setOrderToDelete(null);
    } catch (error) {
      console.error("Delete order failed:", error);
      toast.error("Failed to delete order");
    } finally {
      setDeletingOrderId(null);
    }
  };

  if (isAuthenticating) {
    return (
      <Container className="py-8 sm:py-10 md:py-14">
        <div className="rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 md:p-10 shadow-sm">
          <div className="flex items-center justify-center gap-2 text-slate-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm sm:text-base">Loading account...</span>
          </div>
        </div>
      </Container>
    );
  }

  return (

    <Container className="py-6 sm:py-8 md:py-10">
      <section className="rounded-lg sm:rounded-xl border border-slate-200 bg-white p-4 sm:p-5 md:p-7 shadow-sm">
        <div className="mb-4 sm:mb-5 flex flex-col justify-between gap-3 sm:gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-slate-900">My Orders</h2>
            <p className="mt-0.5 sm:mt-1 text-sm sm:text-base text-slate-600">View and manage your order history</p>
          </div>

          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
            className="border-cyan-500 text-slate-800 hover:bg-cyan-50 text-xs sm:text-sm w-full sm:w-auto"
          >
            {isRefreshing ? <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" /> : <RefreshCcw className="h-3 w-3 sm:h-4 sm:w-4" />}
            Refresh
          </Button>
        </div>

        {/* Mobile Card View */}
        <div className="block md:hidden space-y-3">
          {isLoading && sortedOrders.length === 0 && (
            <div className="py-8 text-center text-slate-500">
              <span className="inline-flex items-center gap-2 text-sm">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading orders...
              </span>
            </div>
          )}

          {!isLoading && sortedOrders.length === 0 && (
            <div className="py-10 text-center">
              <p className="font-semibold text-slate-900">No orders found</p>
              <p className="mt-1 text-sm text-slate-500">Your placed orders will appear here.</p>
            </div>
          )}

          {sortedOrders.map((order) => {
            const canPay = order.status === "pending";
            const canDelete = order.status === "pending" || order.status === "cancelled";
            const paymentLabel = order.paidAt || order.status === "paid" || order.status === "completed" ? "Paid" : "Pending";

            return (
              <div key={order._id} className="border rounded-lg p-3 sm:p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-slate-500">Order ID</p>
                    <p className="font-medium text-sm text-slate-800">{order._id.slice(0, 8)}</p>
                  </div>
                  <Badge variant="outline" className={`${getStatusClasses(order.status)} text-xs`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <p className="text-slate-500">Date</p>
                    <p className="font-medium">{formatDate(order.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Items</p>
                    <p className="font-medium">{order.items.length}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Total</p>
                    <p className="font-semibold text-slate-900">${order.total.toFixed(2)}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="inline-flex items-center gap-1.5 text-xs text-slate-700">
                    <CreditCard className="h-3 w-3 text-amber-500" />
                    {paymentLabel}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-slate-300 h-8 px-2"
                      onClick={() => setSelectedOrder(order)}
                      aria-label="View order"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      <span className="text-xs">View</span>
                    </Button>

                    {canPay && (
                      <Button
                        size="sm"
                        onClick={() => handlePayNow(order._id)}
                        className="bg-babyshopSky text-white hover:bg-babyshopSky/90 h-8 px-2"
                      >
                        <CreditCard className="h-3 w-3 mr-1" />
                        <span className="text-xs">Pay</span>
                      </Button>
                    )}

                    {canDelete && (
                      <Button
                        variant="destructive"
                        size="sm"
                        className="h-8 px-2"
                        onClick={() => setOrderToDelete(order)}
                        aria-label="Delete order"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block rounded-xl border border-slate-200 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50">
                <TableHead className="text-xs lg:text-sm">Order ID</TableHead>
                <TableHead className="text-xs lg:text-sm">Date</TableHead>
                <TableHead className="text-xs lg:text-sm">Items</TableHead>
                <TableHead className="text-xs lg:text-sm">Total</TableHead>
                <TableHead className="text-xs lg:text-sm">Status</TableHead>
                <TableHead className="text-xs lg:text-sm">Payment</TableHead>
                <TableHead className="text-right text-xs lg:text-sm">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading && sortedOrders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-8 text-center text-slate-500">
                    <span className="inline-flex items-center gap-2 text-sm">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading orders...
                    </span>
                  </TableCell>
                </TableRow>
              )}

              {!isLoading && sortedOrders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center">
                    <p className="font-semibold text-slate-900">No orders found</p>
                    <p className="mt-1 text-sm text-slate-500">Your placed orders will appear here.</p>
                  </TableCell>
                </TableRow>
              )}

              {sortedOrders.map((order) => {
                const canPay = order.status === "pending";
                const canDelete = order.status === "pending" || order.status === "cancelled";
                const paymentLabel = order.paidAt || order.status === "paid" || order.status === "completed" ? "Paid" : "Pending";

                return (
                  <TableRow key={order._id}>
                    <TableCell className="font-medium text-slate-800 text-xs lg:text-sm">{order._id.slice(0, 8)}</TableCell>
                    <TableCell className="text-xs lg:text-sm">{formatDate(order.createdAt)}</TableCell>
                    <TableCell className="text-xs lg:text-sm">{order.items.length} item{order.items.length > 1 ? "s" : ""}</TableCell>
                    <TableCell className="font-semibold text-slate-900 text-xs lg:text-sm">${order.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`${getStatusClasses(order.status)} text-xs`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1.5 text-xs lg:text-sm text-slate-700">
                        <CreditCard className="h-3 w-3 lg:h-4 lg:w-4 text-amber-500" />
                        {paymentLabel}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1 lg:gap-2">
                        <Button
                          variant="outline"
                          size="icon-sm"
                          className="border-slate-300 h-7 w-7 lg:h-8 lg:w-8"
                          onClick={() => setSelectedOrder(order)}
                          aria-label="View order"
                        >
                          <Eye className="h-3 w-3 lg:h-4 lg:w-4" />
                        </Button>

                        {canPay && (
                          <Button
                            onClick={() => handlePayNow(order._id)}
                            className="bg-babyshopSky text-white hover:bg-babyshopSky/90 text-xs lg:text-sm h-7 lg:h-8 px-2 lg:px-3"
                          >
                            <CreditCard className="h-3 w-3 lg:h-4 lg:w-4" />
                            <span className="hidden lg:inline ml-1">Pay Now</span>
                            <span className="lg:hidden ml-1">Pay</span>
                          </Button>
                        )}

                        {canDelete && (
                          <Button
                            variant="destructive"
                            size="icon-sm"
                            className="h-7 w-7 lg:h-8 lg:w-8"
                            onClick={() => setOrderToDelete(order)}
                            aria-label="Delete order"
                          >
                            <Trash2 className="h-3 w-3 lg:h-4 lg:w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </section>

      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="max-w-[95vw] sm:max-w-lg md:max-w-2xl mx-2 sm:mx-auto">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Order Details</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Order #{selectedOrder?._id.slice(0, 8)} placed on {selectedOrder ? formatDate(selectedOrder.createdAt) : "-"}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-3 sm:space-y-4">
              <div className="rounded-lg border border-slate-200 max-h-[40vh] overflow-y-auto">
                {selectedOrder.items.map((item, index) => (
                  <div key={`${item.productId}-${index}`}>
                    <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 text-sm sm:text-base truncate">{item.name}</p>
                        <p className="text-xs sm:text-sm text-slate-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-slate-900 text-sm sm:text-base ml-2">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    {index < selectedOrder.items.length - 1 && <Separator />}
                  </div>
                ))}
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 sm:p-4">
                <div className="mb-2 flex items-center justify-between text-xs sm:text-sm text-slate-600">
                  <span>Status</span>
                  <Badge variant="outline" className={`${getStatusClasses(selectedOrder.status)} text-xs`}>
                    {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between font-semibold text-slate-900 text-sm sm:text-base">
                  <span>Total</span>
                  <span>${selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!orderToDelete} onOpenChange={(open) => !open && setOrderToDelete(null)}>
        <AlertDialogContent className="max-w-[95vw] sm:max-w-md mx-2 sm:mx-auto">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg sm:text-xl">Delete this order?</AlertDialogTitle>
            <AlertDialogDescription className="text-xs sm:text-sm">
              This action cannot be undone. This will permanently remove the selected order from your history.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            <AlertDialogCancel disabled={!!deletingOrderId} className="text-sm">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteOrder}
              disabled={!!deletingOrderId}
              className="bg-destructive text-white hover:bg-destructive/90 text-sm"
            >
              {deletingOrderId ? <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" /> : <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />}
              Delete Order
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Container>
  );
};

export default OrderPageClient;