import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Link } from 'expo-router';
import { useUserStore } from '../../lib/store';
import { LogIn } from 'lucide-react-native';
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
                <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20, justifyContent: 'center' }}>
                    <View className="items-center mb-8">
                        <View className="bg-babyshopSky/10 p-4 rounded-full mb-4">
                            <LogIn size={40} color="#29beb3" />
                        </View>
                        <Text className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</Text>
                        <Text className="text-sm text-gray-500 text-center">Enter your details to sign in to your BabyMart account.</Text>
                    </View>

                    <View className="space-y-4">
                        <View>
                            <Text className="mb-2 text-sm font-medium text-gray-700">Email Address</Text>
                            <TextInput
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-black"
                                placeholder="you@example.com"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={email}
                                onChangeText={setEmail}
                            />
                        </View>

                        <View className="mt-4">
                            <Text className="mb-2 text-sm font-medium text-gray-700">Password</Text>
                            <TextInput
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-black"
                                placeholder="••••••••"
                                secureTextEntry
                                value={password}
                                onChangeText={setPassword}
                            />
                        </View>

                        <Pressable 
                            className="w-full py-4 mt-6 bg-babyshopSky rounded-lg items-center justify-center flex-row"
                            onPress={handleLogin}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text className="text-white font-bold text-base">Sign In</Text>
                            )}
                        </Pressable>

                        <View className="flex-row justify-center items-center mt-6">
                            <Text className="text-gray-500">Don&apos;t have an account? </Text>
                            <Link href="/auth/signup" asChild>
                                <Pressable>
                                    <Text className="text-babyshopSky font-bold">Sign Up</Text>
                                </Pressable>
                            </Link>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
