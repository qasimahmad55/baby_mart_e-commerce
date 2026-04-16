import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Link } from 'expo-router';
import { UserPlus, Mail, Lock, User } from 'lucide-react-native';
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
                <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
                    {/* Top accent */}
                    <View className="absolute top-0 left-0 right-0 h-1 bg-babyshopPurple" />

                    <View className="px-6">
                        <View className="items-center mb-10">
                            <View
                                className="w-20 h-20 rounded-3xl items-center justify-center mb-5"
                                style={{ backgroundColor: '#F3E8FF' }}
                            >
                                <UserPlus size={36} color="#a96bde" />
                            </View>
                            <Text className="text-2xl font-extrabold text-gray-900 mb-2">Create Account</Text>
                            <Text className="text-sm text-gray-400 text-center leading-5">Sign up to get started with BabyMart</Text>
                        </View>

                        <View>
                            <View className="mb-4">
                                <Text className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Full Name</Text>
                                <View className="flex-row items-center bg-gray-50 rounded-xl px-4" style={{ borderWidth: 1, borderColor: '#e5e7eb' }}>
                                    <User size={16} color="#94a3b8" />
                                    <TextInput
                                        className="flex-1 py-3.5 ml-3 text-gray-900 text-sm"
                                        placeholder="John Doe"
                                        placeholderTextColor="#c0c0c0"
                                        value={name}
                                        onChangeText={setName}
                                    />
                                </View>
                            </View>

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
                                onPress={handleRegister}
                                disabled={loading}
                                style={{
                                    backgroundColor: loading ? '#c9a8e6' : '#a96bde',
                                    shadowColor: '#a96bde',
                                    shadowOffset: { width: 0, height: 4 },
                                    shadowOpacity: loading ? 0 : 0.3,
                                    shadowRadius: 8,
                                    elevation: loading ? 0 : 5,
                                }}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text className="text-white font-bold text-base">Sign Up</Text>
                                )}
                            </Pressable>

                            <View className="flex-row justify-center items-center mt-8">
                                <Text className="text-gray-400 text-sm">Already have an account? </Text>
                                <Link href="/auth/signin" asChild>
                                    <Pressable>
                                        <Text className="text-babyshopPurple font-bold text-sm">Sign In</Text>
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
