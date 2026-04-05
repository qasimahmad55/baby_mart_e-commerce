"use client"
import CheckoutSkeleton from '@/components/skeleton/CheckoutSkeleton';
import { createOrderFromCart, getOrderById, Order } from '@/lib/orderApi';
import { useCartStore, useUserStore } from '@/lib/store';
import { Address } from '@/types/types';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';
import Container from '../Container';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, CreditCard, Lock } from 'lucide-react';
import PriceFormatter from '../PriceFormatter';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import PageBreadcrumb from './PageBreadCrumb';
import AddressSelection from './AddressSelection';
import { StripeCheckoutItem } from '@/lib/stripe';

const CheckoutPageClient = () => {

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [isCreatingOrder, setIsCreatingOrder] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter();
    const { auth_token, authUser, isAuthenticated, verifyAuth, hasHydrated } = useUserStore();
    const { cartItemsWithQuantities, clearCart } = useCartStore();

    const orderId = searchParams.get("orderId")

    // verify authentication on mounting the component
    useEffect(() => {
        const checkAuth = async () => {
            setAuthLoading(true)
            if (!hasHydrated) {
                return
            }
            if (auth_token && !authUser) {
                await verifyAuth()
            }

            setAuthLoading(false)

        }

        checkAuth()
    }, [hasHydrated, authUser, auth_token, verifyAuth])

    useEffect(() => {
        // wait for auth to be check
        if (authLoading || !hasHydrated) {
            return
        }
        // check if user is authenticated

        if (!isAuthenticated || !authUser || !auth_token) {
            router.push("/auth/signin")
            return
        }

        // laod user addresses
        if (authUser.addresses && authUser.addresses.length > 0) {
            setAddresses(authUser.addresses)
            // auto select address logic
            if (authUser.addresses.length === 1) {
                setSelectedAddress(authUser.addresses[0])
            } else {
                //if multiples addresses there select the default one
                const defaultAddresses = authUser.addresses.find((addr) => addr.isDefault)
                setSelectedAddress(defaultAddresses || authUser.addresses[0])
            }
        }

        const initializeCheckout = async () => {
            setLoading(true)
            try {
                // if there is an orderId then load the existing orders
                if (orderId) {
                    // console.log("Checkout: Fetching order", orderId);
                    const orderData = await getOrderById(orderId, auth_token)
                    if (orderData) {
                        // console.log("Checkout: Order fetched successfully");
                        setOrder(orderData);
                    } else {
                        toast.error("Order not found");
                        router.push("/user/cart");
                    }
                } else {
                    // if no orderId,check if we have items in the cart
                    if (cartItemsWithQuantities.length === 0) {
                        toast.error("Your cart is empty");
                        router.push("/user/cart");
                        return;
                    }
                    // create a temporary order object for display
                    const tempOrder: Order = {
                        _id: "temp",
                        userId: authUser._id,
                        items: cartItemsWithQuantities.map((item) => ({
                            productId: item.product._id,
                            name: item.product.name,
                            price: item.product.price,
                            quantity: item.quantity,
                            image: item.product.image,
                        })),
                        total: cartItemsWithQuantities.reduce(
                            (total, item) => total + item.product.price * item.quantity,
                            0
                        ),
                        status: "pending",
                        shippingAddress: {
                            street: "",
                            city: "",
                            country: "",
                            postalCode: "",
                        },
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                    };
                    setOrder(tempOrder)
                }

            } catch (error) {
                console.error("Error initializing checkout:", error);
                toast.error("Failed to load checkout details");
                router.push("/user/cart");
            } finally {
                setLoading(false)
            }
        }
        initializeCheckout()

    }, [orderId,
        auth_token,
        router,
        isAuthenticated,
        authUser,
        authLoading,
        hasHydrated,
        cartItemsWithQuantities])

    const handleAddressesUpdate = async (updatedAddresses: Address[]) => {
        setAddresses(updatedAddresses)
        // auto-select
        if (updatedAddresses.length === 1) {
            setSelectedAddress(updatedAddresses[0])
        } else if (updatedAddresses.length > 1) {
            const defaultAddress = updatedAddresses.find((addr) => addr.isDefault)

            if (defaultAddress) {
                setSelectedAddress(defaultAddress)
            }
            else if (!selectedAddress || !updatedAddresses.find((addr) => addr._id === selectedAddress._id)) {
                setSelectedAddress(updatedAddresses[0])
            }
        } else {
            setSelectedAddress(null)
        }
    }

    const calculateSubtotal = () => {
        if (!order) return 0;

        return order.items.reduce((total, item) => total + item.price * item.quantity, 0)
    }

    const calculateShipping = () => {
        const subTotal = calculateSubtotal();
        return subTotal > 100 ? 0 : 15
    }

    const calculateTax = () => {
        const subTotal = calculateSubtotal()
        return subTotal * 0.08
    }

    const calculateTotal = () => {
        return calculateSubtotal() + calculateShipping() + calculateTax()
    }

    const handleStripeCheckout = async () => {
        if (!order) return;
        if (!selectedAddress) {
            toast.error("Please select a shipping address");
            return;
        }
        setProcessing(true)

        try {
            let finalOrder = order
            // if this is temporary order from cart ,create it first

            if (order._id === "temp") {
                setIsCreatingOrder(true)
                const orderItems = cartItemsWithQuantities.map((item) => ({
                    _id: item.product._id,
                    name: item.product.name,
                    price: item.product.price,
                    quantity: item.quantity,
                    image: item.product.image,
                }))

                const response = await createOrderFromCart(auth_token!, orderItems, selectedAddress)

                if (!response?.success || !response.order) {
                    throw new Error(response.message || "Failed to create order");
                }
                finalOrder = response.order;
                setOrder(finalOrder);

                // Don't clear cart here - it will be cleared on success page after payment
                // This prevents the empty cart flash before Stripe redirect
                setIsCreatingOrder(false);
            }

            // stripe payment
            //convert order items to stripe format

            const stripeItems: StripeCheckoutItem[] = finalOrder?.items?.map((item) => ({
                name: item.name,
                description: `Quantity: ${item.quantity}`,
                amount: Math.round(item.price * 100),
                currency: "usd",
                quantity: item.quantity,
                images: item.image ? [item.image] : undefined,
            }))

            //create checkout session

            const response = await fetch("/api/create-checkout-session", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    items: stripeItems,
                    customerEmail: authUser?.email || "",
                    successUrl: `${window.location.origin}/success?orderId=${finalOrder._id}&session_id={CHECKOUT_SESSION_ID}`,
                    cancelUrl: `${window.location.origin}/user/checkout?orderId=${finalOrder._id}`,
                    metadata: {
                        orderId: finalOrder._id,
                        shippingAddress: JSON.stringify(selectedAddress)
                    }
                })
            })

            const { url } = await response.json()
            if (url) {
                //redirect to stripe checkout using session url
                window.location.href = url
            }


        } catch (error) {
            console.log("Stripe payment error", error);
        } finally {
            setProcessing(false)
        }
    }


    if (loading || authLoading) {
        return <CheckoutSkeleton />;
    }

    if (!order) {
        return (
            <Container className="py-16">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">
                            Order Not Found
                        </h1>
                        <p className="text-gray-600 mb-6">
                            The order you&apos;re looking for doesn&apos;t exist or has been
                            removed.
                        </p>
                        <Button onClick={() => router.push("/cart")}>Return to Cart</Button>
                    </div>
                </div>
            </Container>
        );
    }

    return (
        <Container className="py-8">
            <PageBreadcrumb
                items={[{ label: "Cart", href: "/cart" }]}
                currentPage="Checkout"
            />
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Checkout</h1>
                <p className="text-gray-600">Complete your order</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Order details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Addresss */}

                    <AddressSelection
                        selectedAddress={selectedAddress}
                        onAddressSelect={setSelectedAddress}
                        addresses={addresses}
                        onAddressesUpdate={handleAddressesUpdate}
                    />
                    {/* Order items */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">
                            Order Details
                        </h2>
                        <div>
                            {order?.items.map((item, index) => (
                                <div key={index.toString()}>
                                    <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                                        {item.image ? (
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                <CreditCard className="w-6 h-6 text-gray-400" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium text-gray-900 mb-1">
                                            {item.name}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Quantity: {item.quantity} ×{" "}
                                            <PriceFormatter amount={item.price} />
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <PriceFormatter
                                            amount={item.price * item.quantity}
                                            className="text-base font-semibold text-gray-900"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Payment Information */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">
                            Payment Information
                        </h2>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-4 border-2 border-blue-200 bg-blue-50 rounded-lg">
                                <CreditCard className="w-5 h-5 text-blue-600" />
                                <div className="flex-1">
                                    <h3 className="font-medium text-gray-900">Stripe Checkout</h3>
                                    <p className="text-sm text-gray-600">
                                        Secure payment with Stripe
                                    </p>
                                </div>
                                <CheckCircle className="w-5 h-5 text-blue-600" />
                            </div>

                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Lock className="w-4 h-4" />
                                <span>Your payment information is secure and encrypted</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Order summary */}
                <div className="lg:col-span-1 flex justify-center">
                    <div className="bg-babyshopWhite rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-4 w-full max-h-[calc(100vh-7rem)] overflow-y-auto">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">
                            Order Summary
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between py-2">
                                <span className="text-gray-600">Subtotal</span>
                                <PriceFormatter
                                    amount={calculateSubtotal()}
                                    className="text-base font-medium text-gray-900"
                                />
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-gray-600">Shipping</span>
                                <span className="text-base font-medium">
                                    {calculateShipping() === 0 ? (
                                        <span className="text-green-600">Free shipping</span>
                                    ) : (
                                        <PriceFormatter
                                            amount={calculateShipping()}
                                            className="text-base font-medium text-gray-900"
                                        />
                                    )}
                                </span>
                            </div>

                            <div className="flex justify-between items-center py-2">
                                <span className="text-gray-600">Tax</span>
                                <PriceFormatter
                                    amount={calculateTax()}
                                    className="text-base font-medium text-gray-900"
                                />
                            </div>
                            {calculateShipping() === 0 && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                    <p className="text-green-700 text-sm font-medium">
                                        🎉 You are qualify for free shipping!
                                    </p>
                                </div>
                            )}

                            <Separator className="my-4" />
                            <div className="flex justify-between items-center py-2">
                                <span className="text-lg font-bold text-gray-900">Total</span>
                                <PriceFormatter
                                    amount={calculateTotal()}
                                    className="text-xl font-bold text-gray-900"
                                />
                            </div>
                        </div>
                        <Button
                            size={"lg"}
                            className="w-full mt-6 font-semibold hover:text-babyshopWhite hoverEffect disabled:opacity-50"
                            disabled={processing || isCreatingOrder || !selectedAddress}
                            onClick={handleStripeCheckout}
                        >
                            {processing ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                    Processing...
                                </>
                            ) : isCreatingOrder ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                    Creating Order...
                                </>
                            ) : !selectedAddress ? (
                                <>
                                    <AlertCircle className="w-4 h-4 mr-2" />
                                    Select Address to Continue
                                </>
                            ) : (
                                <>
                                    <Lock className="w-4 h-4 mr-2" />
                                    Pay with Stripe
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </Container>
    )
}

export default CheckoutPageClient