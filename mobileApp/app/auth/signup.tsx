import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Link } from 'expo-router';
import { UserPlus } from 'lucide-react-native';
import { useUserStore } from '../../lib/store';

export default function SignUpScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    
    const router = useRouter();
    const register = useUserStore(state => state.register);

    const handleRegister = async () => {
        if (!name || !email || !password) {
            Alert.alert("Error", "Please fill in all fields.");
            return;
        }

        setLoading(true);
        try {
            await register({ name, email, password, role: 'user' });
            Alert.alert("Success", "Registered successfully! You can now sign in.");
            router.push("/auth/signin");
        } catch (error: any) {
            console.error("Signup error:", error);
            Alert.alert("Sign Up Failed", error.message || "Failed to register.");
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
                        <View className="bg-babyshopPurple/10 p-4 rounded-full mb-4">
                            <UserPlus size={40} color="#a96bde" />
                        </View>
                        <Text className="text-2xl font-bold text-gray-900 mb-2">Create Account</Text>
                        <Text className="text-sm text-gray-500 text-center">Sign up to get started with BabyMart.</Text>
                    </View>

                    <View className="space-y-4">
                        <View>
                            <Text className="mb-2 text-sm font-medium text-gray-700">Full Name</Text>
                            <TextInput
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-black"
                                placeholder="John Doe"
                                value={name}
                                onChangeText={setName}
                            />
                        </View>

                        <View className="mt-4">
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
                            className="w-full py-4 mt-8 bg-babyshopPurple rounded-lg items-center justify-center flex-row"
                            onPress={handleRegister}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text className="text-white font-bold text-base">Sign Up</Text>
                            )}
                        </Pressable>

                        <View className="flex-row justify-center items-center mt-6">
                            <Text className="text-gray-500">Already have an account? </Text>
                            <Link href="/auth/signin" asChild>
                                <Pressable>
                                    <Text className="text-babyshopPurple font-bold">Sign In</Text>
                                </Pressable>
                            </Link>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
