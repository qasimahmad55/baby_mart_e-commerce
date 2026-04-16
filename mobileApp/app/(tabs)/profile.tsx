import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TextInput, Pressable, Image, ActivityIndicator, Alert, Modal, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserStore, useCartStore, useOrderStore, useWishlistStore } from "../../lib/store";
import authApi from "../../lib/authApi";
import { useRouter, useFocusEffect } from "expo-router";
import * as ImagePicker from 'expo-image-picker';
import Footer from "../../components/common/Footer";
import {
    LogOut, Edit3, MapPin, Plus, Trash2, Upload,
    ShoppingCart, Package, Heart, User, ChevronRight, X, Camera
} from "lucide-react-native";
import { Address } from "../../types/types";

export default function ProfileScreen() {
    const { authUser, logoutUser, updateUser, isAuthenticated } = useUserStore();
    const cartItems = useCartStore((state) => state.cartItemsWithQuantities);
    const orders = useOrderStore((state) => state.orders);
    const wishlistItems = useWishlistStore((state) => state.wishlistItems);

    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const formatAvatarUrl = (url?: string) => {
        if (!url) return "";
        if (url.startsWith('ttps://')) return url.replace('ttps://', 'https://');
        return url;
    };

    const [name, setName] = useState(authUser?.name || "");
    const [avatar, setAvatar] = useState(formatAvatarUrl(authUser?.avatar));
    const [avatarPreview, setAvatarPreview] = useState(formatAvatarUrl(authUser?.avatar));

    const [isAddressModalVisible, setAddressModalVisible] = useState(false);
    const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
    const [addressForm, setAddressForm] = useState({
        street: "",
        city: "",
        country: "",
        postalCode: "",
        isDefault: false
    });

    useFocusEffect(
        React.useCallback(() => {
            if (!isAuthenticated) {
                Alert.alert(
                    "Sign In Required",
                    "Please sign in to view and manage your profile.",
                    [
                        { 
                            text: "Cancel", 
                            style: "cancel",
                            onPress: () => router.replace("/(tabs)" as any)
                        },
                        { 
                            text: "Sign In", 
                            onPress: () => router.replace("/auth/signin" as any) 
                        }
                    ],
                    { cancelable: false }
                );
            } else {
                useUserStore.getState().verifyAuth();
                if (authUser) {
                    setName(authUser.name || "");
                    setAvatarPreview(formatAvatarUrl(authUser.avatar));
                    setAvatar(formatAvatarUrl(authUser.avatar));
                }
            }
        }, [isAuthenticated, authUser, router])
    );

    // Track authUser changes explicitly to update form if it hydrates late
    useEffect(() => {
        if (authUser) {
            setName(authUser.name || "");
            setAvatarPreview(formatAvatarUrl(authUser.avatar));
            setAvatar(formatAvatarUrl(authUser.avatar));
        }
    }, [authUser]);

    if (!isAuthenticated) {
        return (
            <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
                <ActivityIndicator size="large" color="#29beb3" />
            </SafeAreaView>
        );
    }

    const handleLogout = async () => {
        setIsLoading(true);
        try {
            logoutUser();
            router.replace("/(tabs)");
            await authApi.post("/auth/logout", {}).catch(() => { });
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageUpload = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission needed', 'Sorry, we need camera roll permissions to make this work!');
                return;
            }

            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5,
                base64: true,
            });

            if (!result.canceled && result.assets && result.assets[0].base64) {
                const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
                setAvatarPreview(result.assets[0].uri);
                setAvatar(base64Image);
            }
        } catch (error) {
            console.error("Error picking image:", error);
        }
    };

    const handleUpdateProfile = async () => {
        if (!authUser?._id) return;

        setIsUpdating(true);
        try {
            const response = await authApi.put(`/users/${authUser._id}`, {
                name,
                avatar: avatar !== authUser.avatar ? avatar : undefined
            });

            if (response.success && response.data) {
                updateUser(response.data as typeof authUser);
                Alert.alert("Success", "Profile updated successfully");
            } else {
                Alert.alert("Error", response.error?.message || "Failed to update profile");
            }
        } catch (error) {
            Alert.alert("Error", "Failed to update profile");
            console.error("Update failed:", error);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleSaveAddress = async () => {
        if (!authUser?._id) return;
        if (!addressForm.street || !addressForm.city || !addressForm.country || !addressForm.postalCode) {
            Alert.alert("Error", "All address fields are required");
            return;
        }

        setIsUpdating(true);
        try {
            let response;
            if (editingAddressId) {
                response = await authApi.put(`/users/${authUser._id}/addresses/${editingAddressId}`, addressForm);
            } else {
                response = await authApi.post(`/users/${authUser._id}/addresses`, addressForm);
            }

            if (response.success && response.data) {
                const data = response.data as { addresses: typeof authUser.addresses };
                updateUser({ ...authUser, addresses: data.addresses });
                setAddressModalVisible(false);
                setEditingAddressId(null);
                setAddressForm({ street: "", city: "", country: "", postalCode: "", isDefault: false });
                Alert.alert("Success", `Address ${editingAddressId ? 'updated' : 'added'} successfully`);
            } else {
                Alert.alert("Error", response.error?.message || "Failed to save address");
            }
        } catch (error) {
            console.error("Save address failed:", error);
            Alert.alert("Error", "Failed to save address");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDeleteAddress = async (addressId: string) => {
        if (!authUser?._id) return;

        Alert.alert(
            "Delete Address",
            "Are you sure you want to delete this address?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const response = await authApi.delete(`/users/${authUser._id}/addresses/${addressId}`);
                            if (response.success && response.data) {
                                const data = response.data as { addresses: typeof authUser.addresses };
                                updateUser({ ...authUser, addresses: data.addresses });
                            }
                        } catch (error) {
                            console.error("Delete address failed:", error);
                            Alert.alert("Error", "Failed to delete address");
                        }
                    }
                }
            ]
        );
    };

    const startEditAddress = (address: Address) => {
        setEditingAddressId(address._id);
        setAddressForm({
            street: address.street,
            city: address.city,
            country: address.country,
            postalCode: address.postalCode,
            isDefault: address.isDefault
        });
        setAddressModalVisible(true);
    };

    const recentOrders = orders.slice(0, 3);

    return (
        <SafeAreaView className="flex-1 bg-gray-50" edges={['bottom']}>
            {/* Header */}
            <View
                className="px-5 py-4 bg-white"
                style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.04,
                    shadowRadius: 6,
                    elevation: 3,
                }}
            >
                <Text className="text-xl font-extrabold text-gray-900">My Account</Text>
                <Text className="text-xs text-gray-400 mt-0.5 font-medium">Manage your profile & preferences</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View className="px-5 pt-5 pb-2">
                    {/* Hero Card */}
                    <View
                        className="overflow-hidden mb-5"
                        style={{
                            borderRadius: 24,
                            backgroundColor: '#29beb3',
                            shadowColor: '#29beb3',
                            shadowOffset: { width: 0, height: 6 },
                            shadowOpacity: 0.3,
                            shadowRadius: 14,
                            elevation: 8,
                        }}
                    >
                        {/* Decorative circles */}
                        <View className="absolute -right-8 -top-8 w-32 h-32 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
                        <View className="absolute -left-6 -bottom-10 w-40 h-40 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }} />

                        <View className="p-6 flex-row items-center">
                            {/* Avatar */}
                            <View className="relative mr-4">
                                <View
                                    className="w-20 h-20 rounded-2xl overflow-hidden bg-white items-center justify-center"
                                    style={{ borderWidth: 3, borderColor: 'rgba(255,255,255,0.4)' }}
                                >
                                    {(avatarPreview && avatarPreview.trim() !== "") ? (
                                        <Image 
                                            source={{ uri: avatarPreview }} 
                                            className="w-full h-full" 
                                            onError={() => setAvatarPreview("")}
                                        />
                                    ) : (
                                        <Text className="text-3xl font-extrabold text-babyshopSky">
                                            {authUser?.name ? authUser.name.trim().charAt(0).toUpperCase() : "U"}
                                        </Text>
                                    )}
                                </View>
                                {/* Online dot */}
                                <View className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-green-400 rounded-full" style={{ borderWidth: 3, borderColor: '#29beb3' }} />
                            </View>

                            {/* Info */}
                            <View className="flex-1">
                                <Text className="text-xl font-extrabold text-white mb-0.5 tracking-tight">{authUser?.name || "User Name"}</Text>
                                <Text className="text-xs text-white/80 font-medium mb-2">{authUser?.email || "user@example.com"}</Text>
                                <View className="self-start px-3 py-1 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                                    <Text className="text-[10px] text-white capitalize font-bold tracking-wider">{authUser?.role || "User"}</Text>
                                </View>
                            </View>
                        </View>

                        {/* Logout Button */}
                        <Pressable
                            onPress={handleLogout}
                            disabled={isLoading}
                            className="mx-6 mb-5 py-3 rounded-xl flex-row justify-center items-center"
                            style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' }}
                        >
                            {isLoading ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <>
                                    <LogOut size={16} color="#fff" />
                                    <Text className="text-white font-bold text-sm ml-2">Sign Out</Text>
                                </>
                            )}
                        </Pressable>
                    </View>

                    {/* Stats Row */}
                    <View className="flex-row justify-between gap-3 mb-5">
                        {[
                            { label: "Orders", count: orders.length, icon: <Package size={20} color="#29beb3" />, bg: '#E8F8F5', onPress: () => router.push("/orders" as any) },
                            { label: "Wishlist", count: wishlistItems.length, icon: <Heart size={20} color="#ef4444" />, bg: '#FFF1F2', onPress: () => router.push("/wishlist" as any) },
                            { label: "Cart", count: cartItems.length, icon: <ShoppingCart size={20} color="#a96bde" />, bg: '#F3E8FF', onPress: () => router.push("/cart" as any) },
                        ].map((stat) => (
                            <Pressable
                                key={stat.label}
                                onPress={stat.onPress}
                                className="flex-1 bg-white p-4 items-center"
                                style={{
                                    borderRadius: 18,
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.04,
                                    shadowRadius: 8,
                                    elevation: 2,
                                }}
                            >
                                <View className="w-10 h-10 rounded-xl items-center justify-center mb-2" style={{ backgroundColor: stat.bg }}>
                                    {stat.icon}
                                </View>
                                <Text className="text-xl font-extrabold text-gray-900">{stat.count}</Text>
                                <Text className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mt-0.5">{stat.label}</Text>
                            </Pressable>
                        ))}
                    </View>

                    {/* Update Profile Form */}
                    <View
                        className="bg-white p-5 mb-5"
                        style={{
                            borderRadius: 20,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.04,
                            shadowRadius: 8,
                            elevation: 2,
                        }}
                    >
                        <View className="flex-row items-center gap-2 mb-5">
                            <View className="w-8 h-8 rounded-lg bg-babyshopSky/10 items-center justify-center">
                                <Edit3 size={16} color="#29beb3" />
                            </View>
                            <Text className="text-base font-bold text-gray-900">Update Profile</Text>
                        </View>

                        <View className="mb-5">
                            <Text className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Profile Picture</Text>
                            <View className="flex-row items-center gap-4">
                                <Pressable
                                    onPress={handleImageUpload}
                                    className="w-16 h-16 rounded-xl bg-gray-50 items-center justify-center overflow-hidden"
                                    style={{ borderWidth: 1.5, borderColor: '#e5e7eb', borderStyle: 'dashed' }}
                                >
                                    {avatarPreview ? (
                                        <Image source={{ uri: avatarPreview }} className="w-full h-full" />
                                    ) : (
                                        <Camera size={22} color="#94a3b8" />
                                    )}
                                </Pressable>
                                <Pressable
                                    onPress={handleImageUpload}
                                    className="px-4 py-2.5 bg-gray-50 rounded-xl flex-row items-center"
                                    style={{ borderWidth: 1, borderColor: '#e5e7eb' }}
                                >
                                    <Upload size={14} color="#29beb3" />
                                    <Text className="text-xs font-bold text-gray-600 ml-2">Upload Photo</Text>
                                </Pressable>
                            </View>
                        </View>

                        <View className="mb-5">
                            <Text className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Full Name</Text>
                            <TextInput
                                className="bg-gray-50 rounded-xl p-3.5 text-gray-900 font-medium text-sm"
                                style={{ borderWidth: 1, borderColor: '#e5e7eb' }}
                                value={name}
                                onChangeText={setName}
                                placeholder="Enter your full name"
                            />
                        </View>

                        <Pressable
                            onPress={handleUpdateProfile}
                            disabled={isUpdating}
                            className="w-full py-3.5 rounded-xl flex-row items-center justify-center"
                            style={{
                                backgroundColor: isUpdating ? '#d1d5db' : '#29beb3',
                                shadowColor: '#29beb3',
                                shadowOffset: { width: 0, height: 3 },
                                shadowOpacity: isUpdating ? 0 : 0.25,
                                shadowRadius: 6,
                                elevation: isUpdating ? 0 : 4,
                            }}
                        >
                            {isUpdating ? <ActivityIndicator size="small" color="#fff" /> : <Edit3 size={14} color="#fff" />}
                            <Text className="text-white font-bold text-sm ml-2">{isUpdating ? "Saving..." : "Save Changes"}</Text>
                        </Pressable>
                    </View>

                    {/* Delivery Addresses */}
                    <View
                        className="bg-white p-5 mb-5"
                        style={{
                            borderRadius: 20,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.04,
                            shadowRadius: 8,
                            elevation: 2,
                        }}
                    >
                        <View className="flex-row items-center justify-between mb-5">
                            <View className="flex-row items-center gap-2">
                                <View className="w-8 h-8 rounded-lg bg-orange-50 items-center justify-center">
                                    <MapPin size={16} color="#f97316" />
                                </View>
                                <Text className="text-base font-bold text-gray-900">Addresses</Text>
                            </View>
                            <Pressable
                                onPress={() => {
                                    setEditingAddressId(null);
                                    setAddressForm({ street: "", city: "", country: "", postalCode: "", isDefault: false });
                                    setAddressModalVisible(true);
                                }}
                                className="flex-row items-center bg-babyshopSky px-4 py-2.5 rounded-xl"
                                style={{
                                    shadowColor: '#29beb3',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.2,
                                    shadowRadius: 4,
                                    elevation: 3,
                                }}
                            >
                                <Plus size={14} color="#fff" />
                                <Text className="text-xs font-bold text-white ml-1">Add New</Text>
                            </Pressable>
                        </View>

                        {authUser?.addresses && authUser.addresses.length > 0 ? (
                            <View className="gap-3">
                                {authUser.addresses.map((addr) => (
                                    <View
                                        key={addr._id}
                                        className="bg-gray-50 p-4 flex-row items-start"
                                        style={{ borderRadius: 16, borderWidth: 1, borderColor: '#f1f5f9' }}
                                    >
                                        <View className="w-9 h-9 rounded-xl bg-orange-50 items-center justify-center mt-0.5 mr-3">
                                            <MapPin size={16} color="#f97316" />
                                        </View>
                                        <View className="flex-1">
                                            <View className="flex-row items-center gap-2 mb-1">
                                                <Text className="text-sm font-bold text-gray-800 flex-1" numberOfLines={1}>{addr.street}</Text>
                                                {addr.isDefault && (
                                                    <View className="px-2 py-0.5 bg-babyshopSky/10 rounded-full">
                                                        <Text className="text-[9px] font-bold text-babyshopSky uppercase">Default</Text>
                                                    </View>
                                                )}
                                            </View>
                                            <Text className="text-xs text-gray-400 font-medium">{addr.city}, {addr.country}</Text>
                                            <Text className="text-xs font-semibold text-babyshopSky mt-0.5">{addr.postalCode}</Text>
                                        </View>
                                        <View className="flex-row items-center gap-1 ml-2">
                                            <Pressable onPress={() => startEditAddress(addr)} className="w-8 h-8 items-center justify-center rounded-lg bg-white">
                                                <Edit3 size={14} color="#94a3b8" />
                                            </Pressable>
                                            <Pressable onPress={() => handleDeleteAddress(addr._id)} className="w-8 h-8 items-center justify-center rounded-lg bg-white">
                                                <Trash2 size={14} color="#94a3b8" />
                                            </Pressable>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        ) : (
                            <View className="py-8 items-center bg-gray-50" style={{ borderRadius: 16, borderWidth: 1.5, borderColor: '#e5e7eb', borderStyle: 'dashed' }}>
                                <MapPin size={28} color="#d1d5db" />
                                <Text className="text-gray-400 font-medium text-sm mt-2">No addresses saved yet</Text>
                            </View>
                        )}
                    </View>

                    {/* Recent Orders Overview */}
                    <View
                        className="bg-white p-5 mb-5"
                        style={{
                            borderRadius: 20,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.04,
                            shadowRadius: 8,
                            elevation: 2,
                        }}
                    >
                        <View className="flex-row items-center gap-2 mb-4">
                            <View className="w-8 h-8 rounded-lg bg-blue-50 items-center justify-center">
                                <Package size={16} color="#3b82f6" />
                            </View>
                            <Text className="text-base font-bold text-gray-900">Recent Orders</Text>
                        </View>

                        {recentOrders.length > 0 ? (
                            <View>
                                {recentOrders.map((order, idx) => (
                                    <View key={order._id} className={`flex-row justify-between items-center py-3.5 ${idx !== recentOrders.length - 1 ? 'border-b border-gray-100' : ''}`}>
                                        <View>
                                            <Text className="text-sm font-bold text-gray-800 mb-1">#{order._id.slice(-6).toUpperCase()}</Text>
                                            <Text className="text-[11px] text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</Text>
                                        </View>
                                        <View className={`px-3 py-1.5 rounded-lg ${order.status === 'completed' ? 'bg-green-50' :
                                                order.status === 'pending' ? 'bg-amber-50' : 'bg-blue-50'
                                            }`}>
                                            <Text className={`text-[10px] font-bold capitalize ${order.status === 'completed' ? 'text-green-600' :
                                                    order.status === 'pending' ? 'text-amber-600' : 'text-blue-600'
                                                }`}>{order.status}</Text>
                                        </View>
                                    </View>
                                ))}
                                <Pressable
                                    onPress={() => router.push("/orders" as any)}
                                    className="mt-4 flex-row items-center justify-center py-2.5 bg-gray-50 rounded-xl"
                                >
                                    <Text className="text-babyshopSky font-bold text-xs mr-1">View All Orders</Text>
                                    <ChevronRight size={14} color="#29beb3" />
                                </Pressable>
                            </View>
                        ) : (
                            <View className="py-6 items-center">
                                <Text className="text-gray-400 font-medium text-sm">No recent orders</Text>
                            </View>
                        )}
                    </View>

                    <View className="h-4" />
                </View>

                {/* Shared Footer component matching Client context */}
                <Footer />
            </ScrollView>

            {/* Address Modal */}
            <Modal visible={isAddressModalVisible} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setAddressModalVisible(false)}>
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1 bg-gray-50">
                    <View
                        className="px-5 py-4 bg-white flex-row justify-between items-center"
                        style={{
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.04,
                            shadowRadius: 6,
                            elevation: 3,
                        }}
                    >
                        <Text className="text-lg font-extrabold text-gray-900">{editingAddressId ? 'Edit Address' : 'Add New Address'}</Text>
                        <Pressable onPress={() => setAddressModalVisible(false)} className="w-9 h-9 bg-gray-100 rounded-xl items-center justify-center">
                            <X size={18} color="#475569" />
                        </Pressable>
                    </View>
                    <ScrollView className="px-5 pt-5" contentContainerStyle={{ paddingBottom: 40 }}>
                        <View className="gap-4">
                            <View>
                                <Text className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Street</Text>
                                <TextInput
                                    className="bg-white rounded-xl p-3.5 text-gray-900 text-sm"
                                    style={{ borderWidth: 1, borderColor: '#e5e7eb' }}
                                    value={addressForm.street}
                                    onChangeText={(val) => setAddressForm({ ...addressForm, street: val })}
                                    placeholder="Street address"
                                />
                            </View>
                            <View className="flex-row gap-3">
                                <View className="flex-1">
                                    <Text className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">City</Text>
                                    <TextInput
                                        className="bg-white rounded-xl p-3.5 text-gray-900 text-sm"
                                        style={{ borderWidth: 1, borderColor: '#e5e7eb' }}
                                        value={addressForm.city}
                                        onChangeText={(val) => setAddressForm({ ...addressForm, city: val })}
                                        placeholder="City"
                                    />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Country</Text>
                                    <TextInput
                                        className="bg-white rounded-xl p-3.5 text-gray-900 text-sm"
                                        style={{ borderWidth: 1, borderColor: '#e5e7eb' }}
                                        value={addressForm.country}
                                        onChangeText={(val) => setAddressForm({ ...addressForm, country: val })}
                                        placeholder="Country"
                                    />
                                </View>
                            </View>
                            <View>
                                <Text className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Postal Code</Text>
                                <TextInput
                                    className="bg-white rounded-xl p-3.5 text-gray-900 text-sm"
                                    style={{ borderWidth: 1, borderColor: '#e5e7eb' }}
                                    value={addressForm.postalCode}
                                    onChangeText={(val) => setAddressForm({ ...addressForm, postalCode: val })}
                                    placeholder="Postal code"
                                />
                            </View>
                            <Pressable
                                onPress={() => setAddressForm({ ...addressForm, isDefault: !addressForm.isDefault })}
                                className="flex-row items-center mt-1 py-2"
                            >
                                <View
                                    className="w-6 h-6 rounded-lg mr-3 items-center justify-center"
                                    style={{
                                        backgroundColor: addressForm.isDefault ? '#29beb3' : '#fff',
                                        borderWidth: 1.5,
                                        borderColor: addressForm.isDefault ? '#29beb3' : '#d1d5db',
                                    }}
                                >
                                    {addressForm.isDefault && <Text className="text-white text-xs font-bold">✓</Text>}
                                </View>
                                <Text className="text-gray-700 font-medium text-sm">Set as default address</Text>
                            </Pressable>

                            <Pressable
                                onPress={handleSaveAddress}
                                disabled={isUpdating}
                                className="w-full py-4 mt-4 rounded-xl items-center justify-center"
                                style={{
                                    backgroundColor: isUpdating ? '#d1d5db' : '#29beb3',
                                    shadowColor: '#29beb3',
                                    shadowOffset: { width: 0, height: 3 },
                                    shadowOpacity: isUpdating ? 0 : 0.25,
                                    shadowRadius: 6,
                                    elevation: isUpdating ? 0 : 4,
                                }}
                            >
                                {isUpdating ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-bold text-base">Save Address</Text>}
                            </Pressable>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </Modal>
        </SafeAreaView>
    );
}
