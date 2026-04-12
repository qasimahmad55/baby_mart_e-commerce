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
    ShoppingCart, Package, Heart, User, ChevronRight, X
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

    const [name, setName] = useState(authUser?.name || "");
    const [avatar, setAvatar] = useState(authUser?.avatar || "");
    const [avatarPreview, setAvatarPreview] = useState(authUser?.avatar || "");

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
                    setAvatarPreview(authUser.avatar || "");
                    setAvatar(authUser.avatar || "");
                }
            }
        }, [isAuthenticated, authUser, router])
    );

    // Track authUser changes explicitly to update form if it hydrates late
    useEffect(() => {
        if (authUser) {
            setName(authUser.name || "");
            setAvatarPreview(authUser.avatar || "");
            setAvatar(authUser.avatar || "");
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
            // First clear local context so user feels immediate response
            logoutUser();
            router.replace("/(tabs)");
            // Optional: tell server to invalidate token
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
            <View className="px-4 py-3 bg-white border-b border-gray-200">
                <Text className="text-xl font-bold text-gray-900">My Account</Text>
                <Text className="text-sm text-gray-500 mt-1">Manage your account, orders, and preferences</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
                <View className="p-4 gap-3">
                    {/* Hero Card */}
                    <View className="rounded-2xl p-6 bg-[#0ad4c7] shadow-xl relative overflow-hidden flex-col items-center justify-center">
                        {/* Background Overlay (Mocking purple gradient manually using view opacity layering) */}
                        <View className="absolute inset-0 bg-purple-500 opacity-40 rounded-2xl" />

                        <View className="relative z-10 flex-col items-center w-full">
                            {/* Avatar */}
                            <View className="relative mb-3">
                                <View className="w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-white items-center justify-center">
                                    {(avatarPreview && avatarPreview.trim() !== "") ? (
                                        <Image 
                                            source={{ uri: avatarPreview }} 
                                            className="w-full h-full" 
                                            onError={() => setAvatarPreview("")}
                                        />
                                    ) : (
                                        <Text className="text-4xl font-extrabold text-[#0ad4c7]">
                                            {authUser?.name ? authUser.name.trim().charAt(0).toUpperCase() : "U"}
                                        </Text>
                                    )}
                                </View>
                                {/* Online Status Dot */}
                                <View className="absolute bottom-1 right-1 w-5 h-5 bg-green-400 border-[3px] border-white rounded-full" />
                            </View>

                            {/* Info */}
                            <Text className="text-2xl font-extrabold text-white mb-1 tracking-tight">{authUser?.name || "User Name"}</Text>
                            <View className="flex-row items-center justify-center mb-2">
                                <View className="mr-1 mt-0.5">
                                    <Text className="text-white">✉</Text>
                                </View>
                                <Text className="text-sm text-white/90 font-medium">
                                    {authUser?.email || "user@example.com"}
                                </Text>
                            </View>

                            {/* Badge */}
                            <View className="bg-white/30 px-4 py-1 rounded-full mb-6">
                                <Text className="text-xs text-white capitalize font-bold tracking-wider">{authUser?.role || "User"}</Text>
                            </View>

                            {/* Action Buttons Stacked */}
                            <View className="w-full mt-2">
                                <Pressable
                                    onPress={handleLogout}
                                    disabled={isLoading}
                                    className="w-full py-3 bg-white/20 rounded-xl flex-row justify-center items-center backdrop-blur-md border border-white/20"
                                >
                                    {isLoading ? (
                                        <ActivityIndicator size="small" color="#fff" />
                                    ) : (
                                        <>
                                            <LogOut size={18} color="#fff" className="mr-2" />
                                            <Text className="text-white font-bold text-base">Logout</Text>
                                        </>
                                    )}
                                </Pressable>
                            </View>
                        </View>
                    </View>

                    {/* Stats Row */}
                    <View className="flex-row justify-between gap-3">
                        <Pressable onPress={() => router.push("/orders" as any)} className="flex-1 bg-white p-4 rounded-xl border border-gray-100 items-center shadow-sm">
                            <Package size={24} color="#29beb3" className="mb-2" />
                            <Text className="text-xl font-bold text-gray-900 mb-1">{orders.length}</Text>
                            <Text className="text-xs text-gray-500 font-medium">Orders</Text>
                        </Pressable>
                        <Pressable onPress={() => router.push("/wishlist" as any)} className="flex-1 bg-white p-4 rounded-xl border border-gray-100 items-center shadow-sm">
                            <Heart size={24} color="#ef4444" className="mb-2" />
                            <Text className="text-xl font-bold text-gray-900 mb-1">{wishlistItems.length}</Text>
                            <Text className="text-xs text-gray-500 font-medium">Wishlist</Text>
                        </Pressable>
                        <Pressable onPress={() => router.push("/cart" as any)} className="flex-1 bg-white p-4 rounded-xl border border-gray-100 items-center shadow-sm">
                            <ShoppingCart size={24} color="#a96bde" className="mb-2" />
                            <Text className="text-xl font-bold text-gray-900 mb-1">{cartItems.length}</Text>
                            <Text className="text-xs text-gray-500 font-medium">Cart</Text>
                        </Pressable>
                    </View>

                    {/* Update Profile Form */}
                    <View className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm border-l-4 border-l-babyshopSky">
                        <View className="flex-row items-center gap-2 mb-4">
                            <Edit3 size={20} color="#29beb3" />
                            <Text className="text-lg font-bold text-gray-900">Update Profile</Text>
                        </View>

                        <View className="mb-4">
                            <Text className="text-sm font-medium text-gray-700 mb-2">Profile Picture</Text>
                            <View className="flex-row items-center gap-4">
                                <Pressable
                                    onPress={handleImageUpload}
                                    className="w-16 h-16 rounded-full bg-gray-100 items-center justify-center overflow-hidden border border-gray-200"
                                >
                                    {avatarPreview ? (
                                        <Image source={{ uri: avatarPreview }} className="w-full h-full" />
                                    ) : (
                                        <User size={24} color="#ccc" />
                                    )}
                                </Pressable>
                                <Pressable
                                    onPress={handleImageUpload}
                                    className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg flex-row items-center"
                                >
                                    <Upload size={16} color="#29beb3" className="mr-2" />
                                    <Text className="text-sm font-medium text-gray-700">Upload Photo</Text>
                                </Pressable>
                            </View>
                        </View>

                        <View className="mb-5">
                            <Text className="text-sm font-medium text-gray-700 mb-2">Full Name</Text>
                            <TextInput
                                className="border border-gray-300 rounded-lg p-3 text-gray-900 font-medium"
                                value={name}
                                onChangeText={setName}
                                placeholder="Enter your full name"
                            />
                        </View>

                        <Pressable
                            onPress={handleUpdateProfile}
                            disabled={isUpdating}
                            className={`w-full py-3 rounded-lg flex-row items-center justify-center ${isUpdating ? "bg-gray-300" : "bg-babyshopSky"}`}
                        >
                            {isUpdating ? <ActivityIndicator size="small" color="#fff" /> : <Edit3 size={16} color="#fff" className="mr-2" />}
                            <Text className="text-white font-bold">{isUpdating ? "Updating..." : "Save Changes"}</Text>
                        </Pressable>
                    </View>

                    {/* Delivery Addresses */}
                    <View className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm border-l-4 border-l-[#29beb3]">
                        <View className="flex-row items-center justify-between mb-5">
                            <View className="flex-row items-center gap-2">
                                <MapPin size={24} color="#000" />
                                <Text className="text-xl font-extrabold text-black ml-1">Delivery{"\n"}Addresses</Text>
                            </View>
                            <Pressable
                                onPress={() => {
                                    setEditingAddressId(null);
                                    setAddressForm({ street: "", city: "", country: "", postalCode: "", isDefault: false });
                                    setAddressModalVisible(true);
                                }}
                                className="flex-row items-center bg-[#29beb3] px-4 py-2.5 rounded-xl shadow-sm"
                            >
                                <Text className="mr-1 text-white font-bold text-lg leading-tight">+</Text>
                                <Text className="text-sm font-bold text-white mt-0.5">Add New</Text>
                            </Pressable>
                        </View>

                        {authUser?.addresses && authUser.addresses.length > 0 ? (
                            <View className="space-y-4">
                                {authUser.addresses.map((addr) => (
                                    <View key={addr._id} className="border border-gray-200 rounded-2xl p-4 bg-white shadow-sm flex-col relative overflow-hidden">
                                        <View className="flex-row justify-between items-start mb-2 pr-[90px]">
                                            <Text className="text-base font-bold text-black" numberOfLines={1}>{addr.street}</Text>
                                        </View>
                                        <Text className="text-sm text-gray-400 mb-1 font-medium">{addr.city}, {addr.country}</Text>
                                        <Text className="text-sm font-medium text-[#29beb3]">{addr.postalCode}</Text>

                                        <View className="absolute right-4 top-4 bottom-4 flex-row items-center gap-3">
                                            {addr.isDefault && (
                                                <View className="px-3 py-1 bg-white rounded-full border border-[#29beb3]">
                                                    <Text className="text-xs font-medium text-[#29beb3]">Default</Text>
                                                </View>
                                            )}
                                            <Pressable onPress={() => startEditAddress(addr)} className="p-1.5 active:opacity-50">
                                                <Edit3 size={18} color="#9ca3af" />
                                            </Pressable>
                                            <Pressable onPress={() => handleDeleteAddress(addr._id)} className="p-1.5 active:opacity-50">
                                                <Trash2 size={18} color="#9ca3af" />
                                            </Pressable>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        ) : (
                            <View className="py-6 items-center border border-dashed border-gray-300 rounded-xl bg-gray-50">
                                <MapPin size={32} color="#ccc" className="mb-2" />
                                <Text className="text-gray-500 font-medium">No addresses saved yet</Text>
                            </View>
                        )}
                    </View>

                    {/* Recent Orders Overview */}
                    <View className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm border-l-4 border-l-gray-800">
                        <View className="flex-row items-center justify-between">
                            <View className="flex-row items-center gap-2">
                                <Package size={20} color="#333" />
                                <Text className="text-lg font-bold text-gray-900">Recent Orders</Text>
                            </View>
                        </View>

                        {recentOrders.length > 0 ? (
                            <View>
                                {recentOrders.map((order, idx) => (
                                    <View key={order._id} className={`flex-row justify-between items-center py-3 ${idx !== recentOrders.length - 1 ? 'border-b border-gray-100' : ''}`}>
                                        <View>
                                            <Text className="text-sm font-bold text-gray-800 mb-1">#{order._id.slice(-6).toUpperCase()}</Text>
                                            <Text className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</Text>
                                        </View>
                                        <View className={`px-3 py-1 rounded-full ${order.status === 'completed' ? 'bg-green-100 text-green-600' :
                                                order.status === 'pending' ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-100 text-blue-600'
                                            }`}>
                                            <Text className="text-xs font-bold capitalize">{order.status}</Text>
                                        </View>
                                    </View>
                                ))}
                                <Pressable
                                    onPress={() => router.push("/orders" as any)}
                                    className="mt-3 flex-row items-center justify-center p-2"
                                >
                                    <Text className="text-babyshopSky font-bold mr-1">View All Orders</Text>
                                    <ChevronRight size={16} color="#29beb3" />
                                </Pressable>
                            </View>
                        ) : (
                            <View className="py-6 items-center">
                                <Text className="text-gray-500 font-medium">No recent orders</Text>
                            </View>
                        )}
                    </View>

                    <View className="h-6" />
                </View>

                {/* Shared Footer component matching Client context */}
                <Footer />
            </ScrollView>

            {/* Address Modal */}
            <Modal visible={isAddressModalVisible} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setAddressModalVisible(false)}>
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1 bg-gray-50">
                    <View className="px-4 py-4 bg-white border-b border-gray-200 flex-row justify-between items-center">
                        <Text className="text-xl font-bold text-gray-900">{editingAddressId ? 'Edit Address' : 'Add New Address'}</Text>
                        <Pressable onPress={() => setAddressModalVisible(false)} className="p-2 -mr-2">
                            <X size={24} color="#333" />
                        </Pressable>
                    </View>
                    <ScrollView className="p-4" contentContainerStyle={{ paddingBottom: 40 }}>
                        <View className="space-y-4">
                            <View>
                                <Text className="text-sm font-medium text-gray-700 mb-2">Street</Text>
                                <TextInput
                                    className="border border-gray-300 rounded-lg p-3 text-gray-900 bg-white"
                                    value={addressForm.street}
                                    onChangeText={(val) => setAddressForm({ ...addressForm, street: val })}
                                    placeholder="Street address"
                                />
                            </View>
                            <View className="flex-row gap-4">
                                <View className="flex-1">
                                    <Text className="text-sm font-medium text-gray-700 mb-2">City</Text>
                                    <TextInput
                                        className="border border-gray-300 rounded-lg p-3 text-gray-900 bg-white"
                                        value={addressForm.city}
                                        onChangeText={(val) => setAddressForm({ ...addressForm, city: val })}
                                        placeholder="City"
                                    />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-sm font-medium text-gray-700 mb-2">Country</Text>
                                    <TextInput
                                        className="border border-gray-300 rounded-lg p-3 text-gray-900 bg-white"
                                        value={addressForm.country}
                                        onChangeText={(val) => setAddressForm({ ...addressForm, country: val })}
                                        placeholder="Country"
                                    />
                                </View>
                            </View>
                            <View>
                                <Text className="text-sm font-medium text-gray-700 mb-2">Postal Code</Text>
                                <TextInput
                                    className="border border-gray-300 rounded-lg p-3 text-gray-900 bg-white"
                                    value={addressForm.postalCode}
                                    onChangeText={(val) => setAddressForm({ ...addressForm, postalCode: val })}
                                    placeholder="Postal code"
                                />
                            </View>
                            <Pressable
                                onPress={() => setAddressForm({ ...addressForm, isDefault: !addressForm.isDefault })}
                                className="flex-row items-center mt-2 py-2"
                            >
                                <View className={`w-6 h-6 rounded-md mr-3 items-center justify-center border ${addressForm.isDefault ? 'bg-babyshopSky border-babyshopSky' : 'border-gray-300 bg-white'}`}>
                                    {addressForm.isDefault && <Text className="text-white text-xs font-bold">✓</Text>}
                                </View>
                                <Text className="text-gray-700 font-medium">Set as default address</Text>
                            </Pressable>

                            <Pressable
                                onPress={handleSaveAddress}
                                disabled={isUpdating}
                                className={`w-full py-4 mt-6 rounded-lg items-center justify-center ${isUpdating ? "bg-gray-300" : "bg-babyshopSky"}`}
                            >
                                {isUpdating ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-bold text-lg">Save Address</Text>}
                            </Pressable>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </Modal>
        </SafeAreaView>
    );
}
