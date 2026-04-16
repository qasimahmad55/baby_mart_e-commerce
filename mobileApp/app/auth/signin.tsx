import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Link } from 'expo-router';
import { useUserStore } from '../../lib/store';
import { LogIn, Mail, Lock } from 'lucide-react-native';
import authApi from '../../lib/authApi';

export default function SignInScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    
    const router = useRouter();
    const setAuthToken = useUserStore(state => state.setAuthToken);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please fill in all fields.");
            return;
        }

        setLoading(true);
        try {
            const data = { email, password };
            const response = await authApi.post("/auth/login", data);
            
            const resData = response.data as any;
            
            if (resData && resData.token) {
                setAuthToken(resData.token);
                Alert.alert("Success", "Logged in successfully!");
                router.replace("/(tabs)");
            } else {
                throw new Error("Invalid response");
            }
        } catch (error: any) {
            console.error("Login error:", error);
            Alert.alert("Sign In Failed", error?.response?.data?.message || "Check your credentials and try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                className="flex-1"
            >
                <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
                    {/* Top accent */}
                    <View className="absolute top-0 left-0 right-0 h-1 bg-babyshopSky" />

                    <View className="px-6">
                        <View className="items-center mb-10">
                            <View
                                className="w-20 h-20 rounded-3xl items-center justify-center mb-5"
                                style={{ backgroundColor: '#E8F8F5' }}
                            >
                                <LogIn size={36} color="#29beb3" />
                            </View>
                            <Text className="text-2xl font-extrabold text-gray-900 mb-2">Welcome Back</Text>
                            <Text className="text-sm text-gray-400 text-center leading-5">Sign in to your BabyMart account</Text>
                        </View>

                        <View>
                            <View className="mb-4">
                                <Text className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Email Address</Text>
                                <View className="flex-row items-center bg-gray-50 rounded-xl px-4" style={{ borderWidth: 1, borderColor: '#e5e7eb' }}>
                                    <Mail size={16} color="#94a3b8" />
                                    <TextInput
                                        className="flex-1 py-3.5 ml-3 text-gray-900 text-sm"
                                        placeholder="you@example.com"
                                        placeholderTextColor="#c0c0c0"
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        value={email}
                                        onChangeText={setEmail}
                                    />
                                </View>
                            </View>

                            <View className="mb-6">
                                <Text className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Password</Text>
                                <View className="flex-row items-center bg-gray-50 rounded-xl px-4" style={{ borderWidth: 1, borderColor: '#e5e7eb' }}>
                                    <Lock size={16} color="#94a3b8" />
                                    <TextInput
                                        className="flex-1 py-3.5 ml-3 text-gray-900 text-sm"
                                        placeholder="••••••••"
                                        placeholderTextColor="#c0c0c0"
                                        secureTextEntry
                                        value={password}
                                        onChangeText={setPassword}
                                    />
                                </View>
                            </View>

                            <Pressable 
                                className="w-full py-4 rounded-xl items-center justify-center flex-row"
                                onPress={handleLogin}
                                disabled={loading}
                                style={{
                                    backgroundColor: loading ? '#93d5d0' : '#29beb3',
                                    shadowColor: '#29beb3',
                                    shadowOffset: { width: 0, height: 4 },
                                    shadowOpacity: loading ? 0 : 0.3,
                                    shadowRadius: 8,
                                    elevation: loading ? 0 : 5,
                                }}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text className="text-white font-bold text-base">Sign In</Text>
                                )}
                            </Pressable>

                            <View className="flex-row justify-center items-center mt-8">
                                <Text className="text-gray-400 text-sm">Don't have an account? </Text>
                                <Link href="/auth/signup" asChild>
                                    <Pressable>
                                        <Text className="text-babyshopSky font-bold text-sm">Sign Up</Text>
                                    </Pressable>
                                </Link>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
