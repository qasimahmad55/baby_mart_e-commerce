import "../global.css";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="product/[id]"
        options={{
          headerShown: true,
          headerTitle: "Product Details",
          headerTintColor: "#29beb3",
        }}
      />
      <Stack.Screen
        name="auth/signin"
        options={{
          headerShown: true,
          headerTitle: "Sign In",
          headerTintColor: "#29beb3",
        }}
      />
      <Stack.Screen
        name="auth/signup"
        options={{
          headerShown: true,
          headerTitle: "Sign Up",
          headerTintColor: "#a96bde",
        }}
      />
      <Stack.Screen
        name="orders"
        options={{
          headerShown: true,
          headerTitle: "My Orders",
          headerTintColor: "#29beb3",
        }}
      />
      <Stack.Screen
        name="wishlist"
        options={{
          headerShown: true,
          headerTitle: "My Wishlist",
          headerTintColor: "#29beb3",
        }}
      />
      <Stack.Screen
        name="order/[id]"
        options={{
          headerShown: true,
          headerTitle: "Order Details",
          headerTintColor: "#29beb3",
        }}
      />
    </Stack>
  );
}
