"use client"
import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import authApi from '@/lib/authApi'
import { useUserStore, useCartStore, useOrderStore, useWishlistStore } from '@/lib/store'
import {
    Loader2,
    User,
    ShoppingBag,
    Heart,
    ShoppingCart,
    LogOut,
    Edit3,
    MapPin,
    Plus,
    Trash2,
    Upload,
    Package,
    Mail,
} from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
import { toast } from 'sonner'
import Image from 'next/image'
import Link from 'next/link'
import Container from '../../Container'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose
} from '@/components/ui/dialog'
import { Address } from '@/types/types'

const ProfilePage = () => {
    const { authUser, logoutUser, updateUser, auth_token } = useUserStore()
    const cartItems = useCartStore((state) => state.cartItemsWithQuantities)
    const orders = useOrderStore((state) => state.orders)
    const wishlistItems = useWishlistStore((state) => state.wishlistItems)

    const router = useRouter()
    const pathname = usePathname()

    const [isLoading, setIsLoading] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)

    // Form states
    const [name, setName] = useState(authUser?.name || '')
    const [avatar, setAvatar] = useState(authUser?.avatar || '')
    const [avatarPreview, setAvatarPreview] = useState(authUser?.avatar || '')

    // Address states
    const [isAddingAddress, setIsAddingAddress] = useState(false)
    const [editingAddressId, setEditingAddressId] = useState<string | null>(null)
    const [addressForm, setAddressForm] = useState({
        street: '',
        city: '',
        country: '',
        postalCode: '',
        isDefault: false
    })

    const fileInputRef = useRef<HTMLInputElement>(null)
    const updateProfileRef = useRef<HTMLDivElement>(null)

    const scrollToUpdateProfile = () => {
        updateProfileRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    useEffect(() => {
        if (authUser) {
            setName(authUser.name)
            setAvatar(authUser.avatar || '')
            setAvatarPreview(authUser.avatar || '')
        }
    }, [authUser])

    const handleLogout = async () => {
        setIsLoading(true)
        try {
            const response = await authApi.post("/auth/logout", {})
            if (response?.success) {
                logoutUser();
                toast.success("Logged out successfully");
                router.push("/");
            }
        } catch (error) {
            console.error("Logout failed:", error);
            toast.error("Logout failed. Please try again.");
        } finally {
            setIsLoading(false)
        }
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error("File size must be less than 5MB")
                return
            }
            const reader = new FileReader()
            reader.onloadend = () => {
                const base64 = reader.result as string
                setAvatar(base64)
                setAvatarPreview(base64)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleUpdateProfile = async () => {
        if (!authUser?._id) return

        setIsUpdating(true)
        try {
            const response = await authApi.put(`/users/${authUser._id}`, {
                name,
                avatar: avatar !== authUser.avatar ? avatar : undefined
            })

            if (response.success && response.data) {
                updateUser(response.data as typeof authUser)
                toast.success("Profile updated successfully")
            } else {
                toast.error(response.error?.message || "Failed to update profile")
            }
        } catch (error) {
            console.error("Update failed:", error)
            toast.error("Failed to update profile")
        } finally {
            setIsUpdating(false)
        }
    }

    const handleAddAddress = async () => {
        if (!authUser?._id) return
        if (!addressForm.street || !addressForm.city || !addressForm.country || !addressForm.postalCode) {
            toast.error("All address fields are required")
            return
        }

        setIsUpdating(true)
        try {
            const response = await authApi.post(`/users/${authUser._id}/addresses`, addressForm)

            if (response.success && response.data) {
                const data = response.data as { addresses: typeof authUser.addresses }
                updateUser({ ...authUser, addresses: data.addresses })
                toast.success("Address added successfully")
                setIsAddingAddress(false)
                setAddressForm({ street: '', city: '', country: '', postalCode: '', isDefault: false })
            } else {
                toast.error(response.error?.message || "Failed to add address")
            }
        } catch (error) {
            console.error("Add address failed:", error)
            toast.error("Failed to add address")
        } finally {
            setIsUpdating(false)
        }
    }

    const handleUpdateAddress = async (addressId: string) => {
        if (!authUser?._id) return

        setIsUpdating(true)
        try {
            const response = await authApi.put(`/users/${authUser._id}/addresses/${addressId}`, addressForm)

            if (response.success && response.data) {
                const data = response.data as { addresses: typeof authUser.addresses }
                updateUser({ ...authUser, addresses: data.addresses })
                toast.success("Address updated successfully")
                setEditingAddressId(null)
                setAddressForm({ street: '', city: '', country: '', postalCode: '', isDefault: false })
            } else {
                toast.error(response.error?.message || "Failed to update address")
            }
        } catch (error) {
            console.error("Update address failed:", error)
            toast.error("Failed to update address")
        } finally {
            setIsUpdating(false)
        }
    }

    const handleDeleteAddress = async (addressId: string) => {
        if (!authUser?._id) return

        try {
            const response = await authApi.delete(`/users/${authUser._id}/addresses/${addressId}`)

            if (response.success && response.data) {
                const data = response.data as { addresses: typeof authUser.addresses }
                updateUser({ ...authUser, addresses: data.addresses })
                toast.success("Address deleted successfully")
            } else {
                toast.error(response.error?.message || "Failed to delete address")
            }
        } catch (error) {
            console.error("Delete address failed:", error)
            toast.error("Failed to delete address")
        }
    }

    const startEditAddress = (address: Address) => {
        if (!address) return
        setEditingAddressId(address._id)
        setAddressForm({
            street: address.street,
            city: address.city,
            country: address.country,
            postalCode: address.postalCode,
            isDefault: address.isDefault
        })
    }

    const navTabs = [
        { label: 'Profile', icon: User, href: '/user/profile', active: pathname === '/user/profile' },
        { label: 'My Orders', icon: ShoppingBag, href: '/user/orders', active: pathname === '/user/orders' },
        { label: 'Wishlist', icon: Heart, href: '/user/wishlist', active: pathname === '/user/wishlist' },
        { label: 'Cart', icon: ShoppingCart, href: '/user/cart', active: pathname === '/user/cart' },
    ]

    const recentOrders = orders.slice(0, 3)

    return (
        <Container className="py-10">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold">My Account</h1>
                <p className="text-babyshopTextLight mt-1">Manage your account, orders, and preferences</p>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white rounded-xl border p-2 mb-8 inline-flex gap-1">
                {navTabs.map((tab) => (
                    <Link
                        key={tab.label}
                        href={tab.href}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${tab.active
                            ? 'bg-babyshopSky text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </Link>
                ))}
            </div>

            {/* Profile Header Card */}
            <div className="bg-gradient-to-r from-cyan-400 via-teal-400 to-purple-500 rounded-2xl p-8 mb-8">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                    {/* Avatar */}
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                            <Image
                                src={authUser?.avatar || '/default-avatar.png'}
                                alt={authUser?.name || 'User'}
                                width={96}
                                height={96}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <span className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></span>
                    </div>

                    {/* User Info */}
                    <div className="flex-1 text-center sm:text-left text-white">
                        <h2 className="text-2xl font-bold">{authUser?.name}</h2>
                        <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                            <Mail className="w-4 h-4" />
                            <span className="text-white/90">{authUser?.email}</span>
                        </div>
                        <span className="inline-block mt-2 px-3 py-1 bg-white/20 rounded-full text-sm capitalize">
                            {authUser?.role}
                        </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <Button
                            onClick={scrollToUpdateProfile}
                            className="bg-white/20 hover:bg-white/30 text-white border-0"
                        >
                            <Edit3 className="w-4 h-4 mr-2" />
                            Edit Profile
                        </Button>
                        <Button
                            onClick={handleLogout}
                            disabled={isLoading}
                            className="bg-white/20 hover:bg-white/30 text-white border-0"
                        >
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            ) : (
                                <LogOut className="w-4 h-4 mr-2" />
                            )}
                            Logout
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content - Left Side */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Update Profile Section */}
                    <div ref={updateProfileRef} className="bg-white rounded-xl border-l-4 border-l-babyshopSky border p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Edit3 className="w-6 h-6 text-babyshopSky" />
                            <h3 className="text-xl font-bold">Update Profile</h3>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">Full Name</label>
                                <Input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter your name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-babyshopSky">Profile Picture</label>
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200">
                                        <Image
                                            src={avatarPreview || '/default-avatar.png'}
                                            alt="Preview"
                                            width={64}
                                            height={64}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleImageUpload}
                                            accept="image/jpeg,image/png,image/gif"
                                            className="hidden"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="text-babyshopSky border-babyshopSky hover:bg-babyshopSky/5"
                                        >
                                            <Upload className="w-4 h-4 mr-2" />
                                            Upload Photo
                                        </Button>
                                        <p className="text-xs text-babyshopTextLight mt-1">JPG, PNG or GIF. Max size 5MB.</p>
                                    </div>
                                </div>
                            </div>

                            <Button
                                onClick={handleUpdateProfile}
                                disabled={isUpdating}
                                className="w-full bg-babyshopSky hover:bg-babyshopSky/90"
                            >
                                {isUpdating ? (
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                ) : (
                                    <Edit3 className="w-4 h-4 mr-2" />
                                )}
                                Update Profile
                            </Button>
                        </div>
                    </div>

                    {/* Delivery Addresses Section */}
                    <div className="bg-white rounded-xl border-l-4 border-l-babyshopSky border p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <MapPin className="w-6 h-6 text-babyshopSky" />
                                <h3 className="text-xl font-bold">Delivery Addresses</h3>
                            </div>
                            <Dialog open={isAddingAddress} onOpenChange={setIsAddingAddress}>
                                <DialogTrigger asChild>
                                    <Button className="bg-babyshopSky hover:bg-babyshopSky/90">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add New
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Add New Address</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Street</label>
                                            <Input
                                                value={addressForm.street}
                                                onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                                                placeholder="Street address"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-2">City</label>
                                                <Input
                                                    value={addressForm.city}
                                                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                                                    placeholder="City"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-2">Country</label>
                                                <Input
                                                    value={addressForm.country}
                                                    onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                                                    placeholder="Country"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Postal Code</label>
                                            <Input
                                                value={addressForm.postalCode}
                                                onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                                                placeholder="Postal code"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                id="isDefault"
                                                checked={addressForm.isDefault}
                                                onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                                                className="rounded"
                                            />
                                            <label htmlFor="isDefault" className="text-sm">Set as default address</label>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button variant="outline">Cancel</Button>
                                        </DialogClose>
                                        <Button
                                            onClick={handleAddAddress}
                                            disabled={isUpdating}
                                            className="bg-babyshopSky hover:bg-babyshopSky/90"
                                        >
                                            {isUpdating && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                                            Add Address
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>

                        {/* Address List */}
                        <div className="space-y-4">
                            {authUser?.addresses && authUser.addresses.length > 0 ? (
                                authUser.addresses.map((address) => (
                                    <div key={address._id} className="border rounded-xl p-4">
                                        {editingAddressId === address._id ? (
                                            <div className="space-y-4">
                                                <Input
                                                    value={addressForm.street}
                                                    onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                                                    placeholder="Street"
                                                />
                                                <div className="grid grid-cols-2 gap-4">
                                                    <Input
                                                        value={addressForm.city}
                                                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                                                        placeholder="City"
                                                    />
                                                    <Input
                                                        value={addressForm.country}
                                                        onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                                                        placeholder="Country"
                                                    />
                                                </div>
                                                <Input
                                                    value={addressForm.postalCode}
                                                    onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                                                    placeholder="Postal Code"
                                                />
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={addressForm.isDefault}
                                                        onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                                                        className="rounded"
                                                    />
                                                    <label className="text-sm">Set as default</label>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        onClick={() => handleUpdateAddress(address._id)}
                                                        disabled={isUpdating}
                                                        size="sm"
                                                        className="bg-babyshopSky hover:bg-babyshopSky/90"
                                                    >
                                                        {isUpdating && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                                                        Save
                                                    </Button>
                                                    <Button
                                                        onClick={() => setEditingAddressId(null)}
                                                        size="sm"
                                                        variant="outline"
                                                    >
                                                        Cancel
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <p className="font-semibold">{address.street}</p>
                                                    <p className="text-babyshopTextLight text-sm">
                                                        {address.city}, {address.country}
                                                    </p>
                                                    <p className="text-babyshopSky text-sm">{address.postalCode}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {address.isDefault && (
                                                        <span className="px-2 py-1 bg-babyshopSky/10 text-babyshopSky text-xs rounded-full border border-babyshopSky">
                                                            Default
                                                        </span>
                                                    )}
                                                    <button
                                                        onClick={() => startEditAddress(address)}
                                                        className="p-2 text-gray-400 hover:text-babyshopSky transition-colors"
                                                    >
                                                        <Edit3 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteAddress(address._id)}
                                                        className="p-2 text-gray-400 hover:text-babyshopRed transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-babyshopTextLight">
                                    <MapPin className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                    <p>No addresses saved yet</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                    {/* Cart Summary */}
                    <div className="bg-white rounded-xl border-l-4 border-l-babyshopSky border p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <ShoppingCart className="w-5 h-5 text-babyshopSky" />
                            <h3 className="font-bold">Cart Summary</h3>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b">
                            <span className="text-babyshopTextLight">Total Items</span>
                            <span className="w-6 h-6 bg-babyshopSky text-white text-sm rounded-full flex items-center justify-center">
                                {cartItems?.length || 0}
                            </span>
                        </div>
                        <Link href="/user/cart">
                            <Button variant="outline" className="w-full mt-4 border-babyshopSky text-babyshopSky hover:bg-babyshopSky hover:text-white">
                                View Cart
                            </Button>
                        </Link>
                    </div>

                    {/* Recent Orders */}
                    <div className="bg-white rounded-xl border-l-4 border-l-babyshopSky border p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Package className="w-5 h-5 text-babyshopSky" />
                            <h3 className="font-bold">Recent Orders</h3>
                        </div>
                        {recentOrders.length > 0 ? (
                            <div className="space-y-3">
                                {recentOrders.map((order) => (
                                    <div key={order._id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                                        <div>
                                            <p className="text-sm font-medium">#{order._id.slice(-6)}</p>
                                            <p className="text-xs text-babyshopTextLight capitalize">{order.status}</p>
                                        </div>
                                        <span className={`px-2 py-1 text-xs rounded-full ${order.status === 'completed'
                                            ? 'bg-green-100 text-green-600'
                                            : order.status === 'pending'
                                                ? 'bg-yellow-100 text-yellow-600'
                                                : 'bg-blue-100 text-blue-600'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                ))}
                                <Link href="/user/orders">
                                    <Button variant="link" className="w-full text-babyshopSky p-0 mt-2">
                                        View All Orders →
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-babyshopTextLight">
                                <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <p>No orders yet</p>
                            </div>
                        )}
                    </div>

                    {/* Wishlist Summary */}
                    <div className="bg-white rounded-xl border-l-4 border-l-babyshopSky border p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Heart className="w-5 h-5 text-babyshopSky" />
                            <h3 className="font-bold">Wishlist</h3>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b">
                            <span className="text-babyshopTextLight">Saved Items</span>
                            <span className="w-6 h-6 bg-babyshopRed text-white text-sm rounded-full flex items-center justify-center">
                                {wishlistItems?.length || 0}
                            </span>
                        </div>
                        <Link href="/user/wishlist">
                            <Button variant="outline" className="w-full mt-4 border-babyshopSky text-babyshopSky hover:bg-babyshopSky hover:text-white">
                                View Wishlist
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </Container>
    )
}

export default ProfilePage