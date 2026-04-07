"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Package,
  ArrowRight,
  Home,
  ShoppingBag,
  Calendar,
  CreditCard,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { getOrderById, type Order } from "@/lib/orderApi";
import { useUserStore, useCartStore } from "@/lib/store";

import PriceFormatter from "@/components/common/PriceFormatter";
import Cookies from "js-cookie";
import Container from "@/components/common/Container";
import PageBreadcrumb from "./PageBreadCrumb";
import { handlePaymentSuccess, needsPaymentUpdate, pollOrderStatus } from "@/lib/paymentUtils";

const SuccessPageClient = () => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [statusUpdated, setStatusUpdated] = useState(false);
  const [cartCleared, setCartCleared] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { auth_token, authUser, verifyAuth } = useUserStore();
  const { clearCart } = useCartStore();

  const orderId = searchParams.get("orderId");
  const sessionId = searchParams.get("session_id"); // Stripe adds this parameter

  // Verify authentication on component mount
  useEffect(() => {
    const checkAuth = async () => {
      setAuthLoading(true);
      if (auth_token && !authUser) {
        await verifyAuth();
      }

      setAuthLoading(false);
    };

    checkAuth();
  }, [auth_token, authUser, verifyAuth]);

  useEffect(() => {
    if (authLoading) {
      return; // Wait for auth check
    }

    if (!orderId) {
      router.push("/user/orders");
      return;
    }

    const fetchOrder = async () => {
      // Check token in cookies first, then fallback to store
      const token = Cookies.get("auth_token") || auth_token;

      console.log(
        "Success: Token check - cookies:",
        !!Cookies.get("auth_token"),
        "store:",
        !!auth_token,
        "final:",
        !!token
      );

      if (!token) {
        console.log("Success: No token found, redirecting to signin");
        toast.error("Authentication required");
        router.push("/auth/signin");
        return;
      }

      try {
        setLoading(true);
        const orderData = await getOrderById(orderId, token);
        if (orderData) {
          setOrder(orderData);
          console.log("Success: Order fetched:", orderData);

          // Handle payment status update
          if (
            sessionId &&
            needsPaymentUpdate(orderData, sessionId) &&
            !statusUpdated
          ) {
            console.log("Success: Order needs payment update", {
              orderStatus: orderData.status,
              sessionId,
              statusUpdated,
            });
            try {
              const paymentResult = await handlePaymentSuccess(
                orderId,
                sessionId,
                token
              );

              if (paymentResult.success && paymentResult.order) {
                setOrder(paymentResult.order);
                setStatusUpdated(true);
                console.log("Success: Order status updated to paid");
              } else {
                console.log(
                  "Success: Direct update failed, will rely on polling"
                );
              }
            } catch (error) {
              console.error("Success: Error in payment status update:", error);
            }
          } else if (orderData.status === "paid" && sessionId) {
            // Order is already paid, probably updated by webhook
            console.log("Success: Order already marked as paid");
            toast.success("Payment confirmed!");
            setStatusUpdated(true);
          } else {
            console.log("Success: No payment update needed", {
              orderStatus: orderData.status,
              hasSessionId: !!sessionId,
              statusUpdated,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching order:", error);
        toast.error("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, auth_token, router, authLoading, sessionId, statusUpdated]);

  useEffect(() => {
    // Show success toast and clear cart when component mounts
    if (!authLoading && !loading && order && !cartCleared) {
      toast.success("Payment completed successfully!");
      
      // Clear the cart after successful payment
      clearCart()
        .then(() => {
          setCartCleared(true);
          console.log("Cart cleared successfully after payment");
        })
        .catch((error) => {
          console.error("Error clearing cart:", error);
          // Silently fail - cart clearing is not critical for success page
        });
    }
  }, [authLoading, loading, order, cartCleared, clearCart]);

  // Periodically check if order status needs updating (fallback mechanism)
  useEffect(() => {
    if (!order || !sessionId || statusUpdated || order.status !== "pending") {
      return;
    }

    const token = Cookies.get("auth_token") || auth_token;
    if (!token || !orderId) return;

    console.log("Success: Starting polling for order status update");

    const startPolling = async () => {
      try {
        const pollResult = await pollOrderStatus(
          orderId,
          token,
          "paid",
          6,
          5000
        );

        if (pollResult.success && pollResult.order) {
          setOrder(pollResult.order);
          setStatusUpdated(true);
          toast.success("Payment status updated!");
        } else {
          console.log("Success: Polling completed without status update");
        }
      } catch (error) {
        console.error("Success: Error in polling:", error);
      }
    };

    startPolling();
  }, [order, sessionId, statusUpdated, orderId, auth_token]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading || authLoading) {
    return (
      <Container className="py-4 sm:py-6 md:py-8">
        <PageBreadcrumb
          items={[{ label: "Checkout", href: "/checkout" }]}
          currentPage="Success"
          showSocialShare={false}
        />

        <div className="max-w-3xl mx-auto px-2 sm:px-0">
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-lg p-4 sm:p-6 md:p-8 text-center">
            <div className="animate-pulse">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-full mx-auto mb-4 sm:mb-6"></div>
              <div className="h-6 sm:h-8 bg-gray-200 rounded w-3/4 mx-auto mb-3 sm:mb-4"></div>
              <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2 mx-auto mb-4 sm:mb-6"></div>
              <div className="h-10 sm:h-12 bg-gray-200 rounded w-1/3 mx-auto"></div>
            </div>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4 sm:py-6 md:py-8">
      <PageBreadcrumb
        items={[{ label: "Checkout", href: "/checkout" }]}
        currentPage="Success"
        showSocialShare={false}
      />

      <div className="max-w-4xl mx-auto px-1 sm:px-0">
        {/* Success Animation */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-lg p-4 sm:p-6 md:p-8 lg:p-12 text-center mb-4 sm:mb-6 md:mb-8">
          <div className="relative">
            {/* Animated Success Icon */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 md:mb-8 animate-bounce">
              <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-white animate-pulse" />
            </div>

            {/* Celebration Animation */}
            <div className="absolute inset-0 pointer-events-none hidden sm:block">
              <div className="absolute top-0 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-ping delay-100"></div>
              <div className="absolute top-10 right-1/4 w-1 h-1 bg-blue-400 rounded-full animate-ping delay-300"></div>
              <div className="absolute top-5 left-1/3 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping delay-500"></div>
              <div className="absolute top-12 right-1/3 w-1 h-1 bg-pink-400 rounded-full animate-ping delay-700"></div>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4 animate-fade-in">
            Payment Successful! 🎉
          </h1>

          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 mb-4 sm:mb-6 md:mb-8 animate-fade-in delay-100 px-2">
            Thank you for your purchase. Your order has been confirmed and is
            being processed.
          </p>

          {order && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8 animate-fade-in delay-200">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-center">
                <div className="space-y-1 sm:space-y-2">
                  <div className="flex items-center justify-center gap-1 sm:gap-2 text-green-700">
                    <Package className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="font-medium text-xs sm:text-sm">Order ID</span>
                  </div>
                  <p className="font-mono text-xs sm:text-sm md:text-base lg:text-lg font-bold text-gray-900 truncate">
                    #{order._id.slice(-8).toUpperCase()}
                  </p>
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <div className="flex items-center justify-center gap-1 sm:gap-2 text-green-700">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="font-medium text-xs sm:text-sm">Date</span>
                  </div>
                  <p className="text-gray-900 font-semibold text-xs sm:text-sm md:text-base truncate">
                    {formatDate(order.createdAt)}
                  </p>
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <div className="flex items-center justify-center gap-1 sm:gap-2 text-green-700">
                    <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="font-medium text-xs sm:text-sm">Status</span>
                  </div>
                  <div className="flex items-center justify-center gap-1 sm:gap-2">
                    {order.status === "paid" ? (
                      <>
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                        <span className="font-semibold text-green-600 text-xs sm:text-sm md:text-base">
                          Paid
                        </span>
                      </>
                    ) : (
                      <>
                        <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                        <span className="font-semibold text-yellow-600 text-xs sm:text-sm md:text-base">
                          Processing
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <div className="flex items-center justify-center gap-1 sm:gap-2 text-green-700">
                    <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="font-medium text-xs sm:text-sm">Total</span>
                  </div>
                  <PriceFormatter
                    amount={order.total}
                    className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-green-600"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 justify-center animate-fade-in delay-300">
            <Link href="/user/orders" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-full shadow-lg transition-all transform hover:scale-105 text-xs sm:text-sm md:text-base"
              >
                <Package className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                View Orders
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
              </Button>
            </Link>

            <Link href="/shop" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-2 border-gray-300 hover:border-gray-400 px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-full transition-all transform hover:scale-105 text-xs sm:text-sm md:text-base"
              >
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                Continue Shopping
              </Button>
            </Link>

            <Link href="/" className="w-full sm:w-auto">
              <Button
                variant="ghost"
                size="lg"
                className="w-full sm:w-auto hover:bg-gray-100 px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-full transition-all text-xs sm:text-sm md:text-base"
              >
                <Home className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                Go Home
              </Button>
            </Link>
          </div>
        </div>

        {/* Order Summary */}
        {order && (
          <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 md:p-8 animate-fade-in delay-400">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
              Order Summary
            </h2>

            <div className="space-y-2 sm:space-y-3 md:space-y-4">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 sm:gap-3 md:gap-4 p-2 sm:p-3 md:p-4 border border-gray-100 rounded-lg hover:shadow-sm transition-shadow"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <Package className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-gray-400" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 text-xs sm:text-sm md:text-base truncate sm:whitespace-normal">
                      {item.name}
                    </h3>
                    <p className="text-[10px] sm:text-xs md:text-sm text-gray-600">
                      Qty: {item.quantity} ×{" "}
                      <PriceFormatter amount={item.price} />
                    </p>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <PriceFormatter
                      amount={item.price * item.quantity}
                      className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 sm:pt-5 md:pt-6 mt-4 sm:mt-5 md:mt-6">
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                <div className="flex justify-between items-center">
                  <span className="text-base sm:text-lg md:text-xl font-bold text-gray-900">
                    Total Paid:
                  </span>
                  <PriceFormatter
                    amount={order.total}
                    className="text-lg sm:text-xl md:text-2xl font-bold text-green-600"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* What&apos;s Next Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl border border-blue-100 p-4 sm:p-6 md:p-8 mt-4 sm:mt-6 md:mt-8 animate-fade-in delay-500">
          <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
            What happens next?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <span className="text-blue-600 font-bold text-sm sm:text-base">1</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">
                Order Confirmation
              </h4>
              <p className="text-xs sm:text-sm text-gray-600">
                You&apos;ll receive an email confirmation with your order
                details
              </p>
            </div>

            <div className="text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <span className="text-blue-600 font-bold text-sm sm:text-base">2</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Processing</h4>
              <p className="text-xs sm:text-sm text-gray-600">
                Our team will carefully prepare your order for shipping
              </p>
            </div>

            <div className="text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <span className="text-blue-600 font-bold text-sm sm:text-base">3</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Shipping</h4>
              <p className="text-xs sm:text-sm text-gray-600">
                Track your package as it makes its way to your door
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }

        .delay-100 {
          animation-delay: 0.1s;
        }

        .delay-200 {
          animation-delay: 0.2s;
        }

        .delay-300 {
          animation-delay: 0.3s;
        }

        .delay-400 {
          animation-delay: 0.4s;
        }

        .delay-500 {
          animation-delay: 0.5s;
        }
      `}</style>
    </Container>
  );
};

const SuccessPage = () => {
  return (
    <Suspense
      fallback={
        <Container className="py-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-lg p-8 text-center">
              <div className="animate-pulse">
                <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-6"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-6"></div>
                <div className="h-12 bg-gray-200 rounded w-1/3 mx-auto"></div>
              </div>
            </div>
          </div>
        </Container>
      }
    >
      <SuccessPageClient />
    </Suspense>
  );
};

export default SuccessPage;