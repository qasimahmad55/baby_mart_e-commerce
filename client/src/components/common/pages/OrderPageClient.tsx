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

  const { auth_token, authUser, verifyAuth } = useUserStore();
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
      <Container className="py-14">
        <div className="rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
          <div className="flex items-center justify-center gap-2 text-slate-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading account...</span>
          </div>
        </div>
      </Container>
    );
  }

  return (

    <Container className="py-10">
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
        <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">My Orders</h2>
            <p className="mt-1 text-slate-600">View and manage your order history</p>
          </div>

          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
            className="border-cyan-500 text-slate-800 hover:bg-cyan-50"
          >
            {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
            Refresh
          </Button>
        </div>

        <div className="rounded-xl border border-slate-200">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50">
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading && sortedOrders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-8 text-center text-slate-500">
                    <span className="inline-flex items-center gap-2">
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
                    <TableCell className="font-medium text-slate-800">{order._id.slice(0, 8)}</TableCell>
                    <TableCell>{formatDate(order.createdAt)}</TableCell>
                    <TableCell>{order.items.length} item{order.items.length > 1 ? "s" : ""}</TableCell>
                    <TableCell className="font-semibold text-slate-900">${order.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusClasses(order.status)}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1.5 text-sm text-slate-700">
                        <CreditCard className="h-4 w-4 text-amber-500" />
                        {paymentLabel}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon-sm"
                          className="border-slate-300"
                          onClick={() => setSelectedOrder(order)}
                          aria-label="View order"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>

                        {canPay && (
                          <Button
                            onClick={() => handlePayNow(order._id)}
                            className="bg-cyan-500 text-white hover:bg-cyan-600"
                          >
                            <CreditCard className="h-4 w-4 bg-black text-white" />
                            Pay Now
                          </Button>
                        )}

                        {canDelete && (
                          <Button
                            variant="destructive"
                            size="icon-sm"
                            onClick={() => setOrderToDelete(order)}
                            aria-label="Delete order"
                          >
                            <Trash2 className="h-4 w-4" />
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
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              Order #{selectedOrder?._id.slice(0, 8)} placed on {selectedOrder ? formatDate(selectedOrder.createdAt) : "-"}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4">
              <div className="rounded-lg border border-slate-200">
                {selectedOrder.items.map((item, index) => (
                  <div key={`${item.productId}-${index}`}>
                    <div className="flex items-center justify-between px-4 py-3">
                      <div>
                        <p className="font-medium text-slate-900">{item.name}</p>
                        <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-slate-900">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    {index < selectedOrder.items.length - 1 && <Separator />}
                  </div>
                ))}
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
                  <span>Status</span>
                  <Badge variant="outline" className={getStatusClasses(selectedOrder.status)}>
                    {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between font-semibold text-slate-900">
                  <span>Total</span>
                  <span>${selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!orderToDelete} onOpenChange={(open) => !open && setOrderToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this order?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove the selected order from your history.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={!!deletingOrderId}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteOrder}
              disabled={!!deletingOrderId}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {deletingOrderId ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              Delete Order
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Container>
  );
};

export default OrderPageClient;